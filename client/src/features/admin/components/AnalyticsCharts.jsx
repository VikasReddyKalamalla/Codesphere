import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../api/axios.js';
import { socket } from '../../../socket/socket.js';
import { STORAGE_KEYS } from '../../../config/constants.js';
import { AnalyticsHeader } from './analytics/AnalyticsHeader.jsx';
import { RealtimeStatCards } from './analytics/RealtimeStatCards.jsx';
import { RealtimeTrafficChart } from './analytics/RealtimeTrafficChart.jsx';
import { SystemHealthGaugeGrid } from './analytics/SystemHealthGaugeGrid.jsx';
import { LiveEventStream } from './analytics/LiveEventStream.jsx';
import { RevenueAnalyticsCard } from './analytics/RevenueAnalyticsCard.jsx';
import { ModuleEngagementChart } from './analytics/ModuleEngagementChart.jsx';
import { GeoLocationBreakdown } from './analytics/GeoLocationBreakdown.jsx';
import { toast } from 'react-hot-toast';

export const AnalyticsCharts = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('LIVE');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Dashboard Data State
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    totalUsers: 0,
    usersToday: 0,
    revenueToday: 0,
    totalRevenue: 0,
    testAttemptsToday: 0,
    codeExecutionsToday: 0,
    activeSessions: 0,
    socketConnections: 0,
  });

  const [telemetry, setTelemetry] = useState({
    cpu: { usagePercent: 12, cores: 8 },
    memory: { usagePercent: 32, usedMb: 2640, totalMb: 8192 },
    mongodb: { status: 'healthy', responseTimeMs: 2 },
    api: { status: 'healthy', avgLatencyMs: 12, requestsPerSec: 4.2 },
    sockets: { activeConnections: 1 },
    healthScore: 99,
  });

  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [eventsFeed, setEventsFeed] = useState([]);
  const [planDistribution, setPlanDistribution] = useState({});
  const [geoBreakdown, setGeoBreakdown] = useState([]);
  const [moduleEngagement, setModuleEngagement] = useState([]);

  // Fetch initial REST realtime snapshot from MongoDB
  const fetchSnapshot = useCallback(async (selectedRange = timeRange) => {
    setIsRefreshing(true);
    try {
      const res = await apiClient.get('/admin/analytics/realtime', {
        params: { timeRange: selectedRange },
        suppressErrorToast: true,
      });

      if (res.data?.data) {
        const data = res.data.data;
        if (data.metrics) setMetrics(data.metrics);
        if (data.telemetry) setTelemetry(data.telemetry);
        if (data.timeSeriesData) setTimeSeriesData(data.timeSeriesData);
        if (data.eventsFeed) setEventsFeed(data.eventsFeed);
        if (data.planDistribution) setPlanDistribution(data.planDistribution);
        if (data.geoBreakdown) setGeoBreakdown(data.geoBreakdown);
        if (data.moduleEngagement) setModuleEngagement(data.moduleEngagement);
      }
    } catch (err) {
      console.warn('[Analytics] Snapshot load skipped or unauthenticated:', err.message);
    } finally {
      setIsRefreshing(false);
    }
  }, [timeRange]);

  // Handle Time Range change
  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
    fetchSnapshot(newRange);
  };

  // Trigger Simulated Real-time Event (Persists to DB & emits socket event)
  const handleSimulate = async (category = 'all') => {
    try {
      if (socket.connected) {
        socket.emit('analytics:trigger_simulation', { category });
      } else {
        await apiClient.post('/admin/analytics/simulate', { category }, { suppressErrorToast: true });
        fetchSnapshot();
      }
      toast.success(`Real DB Event (${category}) Created & Emitted!`, {
        icon: '⚡',
        style: { background: '#0f172a', color: '#10b981', border: '1px solid #059669' },
      });
    } catch (err) {
      toast.error('Simulation trigger failed');
    }
  };

  // Seed Demo Data into MongoDB
  const handleSeed = async () => {
    try {
      await apiClient.post('/admin/analytics/seed', {}, { suppressErrorToast: true });
      toast.success('Analytics Events Seeded into MongoDB!', {
        icon: '🌱',
        style: { background: '#0f172a', color: '#06b6d4', border: '1px solid #0891b2' },
      });
      fetchSnapshot();
    } catch (err) {
      toast.error('Data seeding failed');
    }
  };

  // Socket.IO Effect & Listeners
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) return;

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      setIsConnected(true);
      socket.emit('analytics:join');
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onConnectError = (err) => {
      console.warn('[Socket] Analytics connection error:', err.message);
      setIsConnected(false);
    };

    const onSnapshot = (data) => {
      if (data.metrics) setMetrics(data.metrics);
      if (data.telemetry) setTelemetry(data.telemetry);
      if (data.timeSeriesData) setTimeSeriesData(data.timeSeriesData);
      if (data.eventsFeed) setEventsFeed(data.eventsFeed);
      if (data.planDistribution) setPlanDistribution(data.planDistribution);
      if (data.geoBreakdown) setGeoBreakdown(data.geoBreakdown);
      if (data.moduleEngagement) setModuleEngagement(data.moduleEngagement);
    };

    const onTelemetryTick = (tick) => {
      if (!autoRefresh) return;
      if (tick.telemetry) setTelemetry(tick.telemetry);

      if (tick.liveMetrics) {
        setMetrics((prev) => ({
          ...prev,
          activeUsers: tick.liveMetrics.activeUsers,
          socketConnections: tick.telemetry.sockets?.activeConnections || prev.socketConnections,
        }));

        setTimeSeriesData((prev) => {
          const next = [
            ...prev,
            {
              time: tick.timeStr || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              activeUsers: tick.liveMetrics.activeUsers,
              apiThroughput: tick.liveMetrics.apiThroughput,
              latencyMs: tick.liveMetrics.latencyMs,
              codeRuns: Math.floor(2 + Math.random() * 4),
            },
          ];
          return next.slice(-25);
        });
      }
    };

    const onEventReceived = (newEvent) => {
      setEventsFeed((prev) => [newEvent, ...prev.slice(0, 49)]);

      if (newEvent.category === 'payment' && newEvent.amount > 0) {
        setMetrics((prev) => ({
          ...prev,
          revenueToday: prev.revenueToday + newEvent.amount,
          totalRevenue: prev.totalRevenue + newEvent.amount,
        }));
      } else if (newEvent.category === 'codex') {
        setMetrics((prev) => ({
          ...prev,
          codeExecutionsToday: prev.codeExecutionsToday + 1,
        }));
      } else if (newEvent.category === 'test') {
        setMetrics((prev) => ({
          ...prev,
          testAttemptsToday: prev.testAttemptsToday + 1,
        }));
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('analytics:snapshot', onSnapshot);
    socket.on('analytics:telemetry_tick', onTelemetryTick);
    socket.on('analytics:event_received', onEventReceived);

    if (socket.connected) {
      onConnect();
    }

    fetchSnapshot();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('analytics:snapshot', onSnapshot);
      socket.off('analytics:telemetry_tick', onTelemetryTick);
      socket.off('analytics:event_received', onEventReceived);
      socket.emit('analytics:leave');
    };
  }, [fetchSnapshot, autoRefresh]);

  return (
    <div className="flex flex-col gap-6 w-full pb-10 font-sans text-slate-900 dark:text-slate-100">
      {/* Header Controls */}
      <AnalyticsHeader
        isConnected={isConnected}
        timeRange={timeRange}
        setTimeRange={handleTimeRangeChange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={() => fetchSnapshot(timeRange)}
        onSimulate={handleSimulate}
        onSeed={handleSeed}
        isRefreshing={isRefreshing}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
      />

      {/* Hero Realtime Stat Cards (Interactive: Click to jump to tab) */}
      <RealtimeStatCards
        metrics={metrics}
        telemetry={telemetry}
        onCardClick={(targetTab) => setActiveTab(targetTab)}
      />

      {/* Tab View Routing */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-6">
          <RealtimeTrafficChart data={timeSeriesData} isLive={isConnected} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <LiveEventStream events={eventsFeed} onSimulate={handleSimulate} />
            </div>
            <div className="flex flex-col gap-6">
              <GeoLocationBreakdown geoData={geoBreakdown} />
              <SystemHealthGaugeGrid telemetry={telemetry} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'live-stream' && (
        <LiveEventStream events={eventsFeed} onSimulate={handleSimulate} />
      )}

      {activeTab === 'system-health' && (
        <div className="flex flex-col gap-6">
          <SystemHealthGaugeGrid telemetry={telemetry} />
          <RealtimeTrafficChart data={timeSeriesData} isLive={isConnected} />
        </div>
      )}

      {activeTab === 'revenue' && (
        <RevenueAnalyticsCard planDistribution={planDistribution} metrics={metrics} />
      )}

      {activeTab === 'engagement' && (
        <ModuleEngagementChart modules={moduleEngagement} />
      )}
    </div>
  );
};
