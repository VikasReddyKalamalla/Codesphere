import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@services/axios.js';
import {
  Users as UsersIcon, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight,
  Download, Ban, CheckCircle, ShieldAlert, Key, MessageSquare, Mail, RefreshCw,
  Eye, MoreVertical, X, Award, Code2, Flame, UserCheck, UserMinus, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { socket } from '../../../socket/socket.js';

export const Users = () => {
  const navigate = useNavigate();

  // State management
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  // Modals & Drawers
  const [activeUser, setActiveUser] = useState(null);
  const [actionDrawerOpen, setActionDrawerOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  // Custom action forms
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyMessage, setNotifyMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Fetch Dashboard Stats and Users list
  const fetchData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        apiClient.get('/admin/dashboard'),
        apiClient.get('/admin/users', {
          params: {
            page,
            limit,
            search: searchTerm,
            role: selectedRole,
            isActive: selectedStatus,
            plan: selectedPlan,
            sort: sortBy
          }
        })
      ]);

      setStats(statsRes.data.data);
      setUsers(usersRes.data.data.users);
      setTotalPages(usersRes.data.data.pagination.totalPages);
      setTotalEntries(usersRes.data.data.pagination.total);
    } catch (err) {
      toast.error(err.message || 'Error fetching user data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, selectedRole, selectedStatus, selectedPlan, sortBy]);

  // Debounced search trigger
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchData(true);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Socket.IO Real-time Synchronization
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleRealtimeUpdate = () => {
      fetchData(true);
    };

    socket.on('user_updated', handleRealtimeUpdate);
    socket.on('user_created', handleRealtimeUpdate);
    socket.on('user_deleted', handleRealtimeUpdate);
    socket.on('presence_update', handleRealtimeUpdate);
    socket.on('admin_sync', handleRealtimeUpdate);

    return () => {
      socket.off('user_updated', handleRealtimeUpdate);
      socket.off('user_created', handleRealtimeUpdate);
      socket.off('user_deleted', handleRealtimeUpdate);
      socket.off('presence_update', handleRealtimeUpdate);
      socket.off('admin_sync', handleRealtimeUpdate);
    };
  }, []);

  // Real-time Database Sync Handler
  const handleSyncDB = async () => {
    const loader = toast.loading('Synchronizing database & telemetries in real-time...');
    setRefreshing(true);
    try {
      if (socket.connected) {
        socket.emit('admin_sync');
      }
      await fetchData(true);
      toast.success('Database & telemetries synced in real-time', { id: loader });
    } catch (err) {
      toast.error('Sync failed: ' + err.message, { id: loader });
    } finally {
      setRefreshing(false);
    }
  };

  // Helper XML escaper for Excel
  const escapeXml = (str) => String(str).replace(/[<>&"']/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return c;
    }
  });

  // Convert objects array to CSV string
  const convertToCSV = (arr) => {
    let str = 'Full Name,Username,Email,Role,Plan,Status,Day Streak,Progress %,Joined Date\r\n';
    arr.forEach(u => {
      const line = [
        `"${(u.fullName || '').replace(/"/g, '""')}"`,
        `"${(u.username || '').replace(/"/g, '""')}"`,
        `"${(u.email || '').replace(/"/g, '""')}"`,
        `"${(u.role || '').replace(/"/g, '""')}"`,
        `"${(u.plan || '').replace(/"/g, '""')}"`,
        `"${u.isActive ? 'Active' : 'Suspended'}"`,
        `"${u.dayStreak || 0}"`,
        `"${u.learningProgress || 0}%"`,
        `"${new Date(u.createdAt).toLocaleDateString()}"`
      ].join(',');
      str += line + '\r\n';
    });
    return str;
  };

  // Convert objects array to Excel XML format (.xls)
  const convertToExcelXML = (arr) => {
    let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Styles>
  <Style ss:ID="Header">
    <Font ss:Bold="1" ss:Color="#FFFFFF"/>
    <Interior ss:Color="#059669" ss:Pattern="Solid"/>
    <Alignment ss:Horizontal="Center"/>
  </Style>
</Styles>
<Worksheet ss:Name="Users Registry">
  <Table>
    <Row ss:StyleID="Header">
      <Cell><Data ss:Type="String">Full Name</Data></Cell>
      <Cell><Data ss:Type="String">Username</Data></Cell>
      <Cell><Data ss:Type="String">Email</Data></Cell>
      <Cell><Data ss:Type="String">Role</Data></Cell>
      <Cell><Data ss:Type="String">Plan</Data></Cell>
      <Cell><Data ss:Type="String">Status</Data></Cell>
      <Cell><Data ss:Type="String">Day Streak</Data></Cell>
      <Cell><Data ss:Type="String">Progress %</Data></Cell>
      <Cell><Data ss:Type="String">Joined Date</Data></Cell>
    </Row>`;

    arr.forEach(u => {
      xml += `
    <Row>
      <Cell><Data ss:Type="String">${escapeXml(u.fullName || '')}</Data></Cell>
      <Cell><Data ss:Type="String">${escapeXml(u.username || '')}</Data></Cell>
      <Cell><Data ss:Type="String">${escapeXml(u.email || '')}</Data></Cell>
      <Cell><Data ss:Type="String">${escapeXml(u.role || '')}</Data></Cell>
      <Cell><Data ss:Type="String">${escapeXml(u.plan || '')}</Data></Cell>
      <Cell><Data ss:Type="String">${u.isActive ? 'Active' : 'Suspended'}</Data></Cell>
      <Cell><Data ss:Type="Number">${u.dayStreak || 0}</Data></Cell>
      <Cell><Data ss:Type="Number">${u.learningProgress || 0}</Data></Cell>
      <Cell><Data ss:Type="String">${new Date(u.createdAt).toLocaleDateString()}</Data></Cell>
    </Row>`;
    });

    xml += `
  </Table>
</Worksheet>
</Workbook>`;
    return xml;
  };

  const handleExport = async (type) => {
    const loader = toast.loading(`Generating full ${type.toUpperCase()} dataset export...`);
    try {
      // Fetch all matching users across all pages for full export
      const res = await apiClient.get('/admin/users', {
        params: {
          page: 1,
          limit: 5000,
          search: searchTerm,
          role: selectedRole,
          isActive: selectedStatus,
          plan: selectedPlan,
          sort: sortBy
        }
      });
      const exportList = res.data?.data?.users || users;
      if (exportList.length === 0) {
        toast.error('No users to export', { id: loader });
        return;
      }

      let blob;
      let filename;
      if (type === 'excel') {
        const xmlContent = convertToExcelXML(exportList);
        blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel' });
        filename = `codesphere_users_export_${Date.now()}.xls`;
      } else {
        const csvContent = convertToCSV(exportList);
        blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        filename = `codesphere_users_export_${Date.now()}.csv`;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${exportList.length} accounts as ${type.toUpperCase()}`, { id: loader });
    } catch (err) {
      toast.error('Export failed: ' + err.message, { id: loader });
    }
  };

  // Bulk Actions
  const handleBulkAction = async () => {
    if (selectedUserIds.length === 0) {
      toast.error('Please select at least one user');
      return;
    }
    if (!bulkAction) {
      toast.error('Please select a bulk action');
      return;
    }

    const loader = toast.loading('Applying bulk changes...');
    try {
      await Promise.all(
        selectedUserIds.map(async (id) => {
          if (bulkAction === 'suspend') {
            await apiClient.put(`/admin/users/${id}/suspend`, { reason: 'Suspended in bulk action' });
          } else if (bulkAction === 'activate') {
            await apiClient.put(`/admin/users/${id}/activate`);
          } else if (bulkAction === 'delete') {
            await apiClient.delete(`/admin/users/${id}`);
          }
        })
      );
      toast.success('Bulk action applied successfully', { id: loader });
      setSelectedUserIds([]);
      setBulkAction('');
      fetchData(true);
    } catch (err) {
      toast.error(err.message || 'Error executing bulk action', { id: loader });
    }
  };

  const toggleSelectUser = (id) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter((uid) => uid !== id));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map((u) => u._id));
    }
  };

  // Single User Actions
  const handleUserAction = async (action, data = {}) => {
    if (!activeUser) return;
    const loader = toast.loading('Executing admin action...');
    try {
      let res;
      if (action === 'suspend') {
        res = await apiClient.put(`/admin/users/${activeUser._id}/suspend`, { reason: data.reason });
      } else if (action === 'activate') {
        res = await apiClient.put(`/admin/users/${activeUser._id}/activate`);
      } else if (action === 'role') {
        res = await apiClient.put(`/admin/users/${activeUser._id}/role`, { role: data.role });
      } else if (action === 'resetPassword') {
        res = await apiClient.post(`/admin/users/${activeUser._id}/reset-password`);
        alert(`Password reset successful!\nTemporary Password: ${res.data.data.tempPassword}\n\nShare this temporary credential securely with the user.`);
      } else if (action === 'notify') {
        res = await apiClient.post(`/admin/users/${activeUser._id}/notify`, { title: data.title, message: data.message });
      } else if (action === 'email') {
        res = await apiClient.post(`/admin/users/${activeUser._id}/email`, { subject: data.subject, body: data.body });
      } else if (action === 'delete') {
        res = await apiClient.delete(`/admin/users/${activeUser._id}`, { params: { hard: data.hard } });
        setActionDrawerOpen(false);
      }

      toast.success(res?.data?.message || 'Action executed successfully', { id: loader });
      fetchData(true);
      
      // Update activeUser view
      const updatedUserRes = await apiClient.get(`/admin/users/${activeUser._id}`);
      setActiveUser(updatedUserRes.data.data);
    } catch (err) {
      toast.error(err.message || 'Action failed', { id: loader });
    }
  };

  const handleStatCardClick = (filterType, filterValue, actionName) => {
    setPage(1);
    if (filterType === 'role') {
      setSelectedRole(filterValue === selectedRole ? '' : filterValue);
      setSelectedStatus('');
      toast.success(filterValue === selectedRole ? 'Cleared role filter' : `Filtering by role: ${actionName}`);
    } else if (filterType === 'status') {
      setSelectedStatus(filterValue === selectedStatus ? '' : filterValue);
      setSelectedRole('');
      toast.success(filterValue === selectedStatus ? 'Cleared status filter' : `Filtering by status: ${actionName}`);
    } else if (filterType === 'sort') {
      setSortBy(filterValue);
      toast.success(`Sorting by: ${actionName}`);
    } else if (filterType === 'reset') {
      setSelectedRole('');
      setSelectedStatus('');
      setSelectedPlan('');
      setSearchTerm('');
      setSortBy('newest');
      toast.success('Reset all account filters');
    } else {
      toast.info(`Telemetry overview: ${actionName}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-800">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">User Registry & Analytics</h1>
          <p className="text-[11px] text-slate-500 mt-1">Manage platform accounts, audit details, streaks, and learning telemetries.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSyncDB}
            disabled={refreshing}
            className="p-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 text-slate-700 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5 text-xs font-semibold shadow-xs"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>Sync DB</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="px-3.5 py-2 bg-slate-950 text-white rounded-xl hover:bg-slate-850 transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            <Download size={14} />
            <span>CSV</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            <Download size={14} />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Dynamic Interactive Statistics Cards Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 select-none">
          {[
            { label: 'Total Users', value: stats.totalUsers ?? 0, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100', filterType: 'reset', filterValue: '', active: !selectedRole && !selectedStatus && sortBy === 'newest' },
            { label: 'Active Users', value: stats.activeUsers ?? 0, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', filterType: 'status', filterValue: 'true', active: selectedStatus === 'true' },
            { label: 'Suspended Users', value: stats.inactiveUsers ?? 0, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100', filterType: 'status', filterValue: 'false', active: selectedStatus === 'false' },
            { label: 'Students', value: stats.students ?? 0, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-100', filterType: 'role', filterValue: 'student', active: selectedRole === 'student' },
            { label: 'Instructors', value: stats.instructors ?? 0, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100', filterType: 'role', filterValue: 'instructor', active: selectedRole === 'instructor' },
            { label: 'Mentors', value: stats.mentors ?? 0, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100', filterType: 'role', filterValue: 'mentor', active: selectedRole === 'mentor' },
            { label: 'Recruiters', value: stats.recruiters ?? 0, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100', filterType: 'role', filterValue: 'recruiter', active: selectedRole === 'recruiter' },
            { label: 'Organizations', value: stats.organizations ?? 0, color: 'text-pink-600', bg: 'bg-pink-50 border-pink-100', filterType: 'role', filterValue: 'organization', active: selectedRole === 'organization' },
            { label: 'Users Online', value: stats.usersCurrentlyOnline ?? 0, color: 'text-teal-600 animate-pulse', bg: 'bg-teal-50 border-teal-100', filterType: 'status', filterValue: 'true', active: false },
            { label: 'New Today', value: stats.newUsersToday ?? 0, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', filterType: 'sort', filterValue: 'newest', active: false },
            { label: 'Avg Progress', value: `${stats.averageLearningProgress ?? 0}%`, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100', filterType: 'sort', filterValue: 'progress_desc', active: sortBy === 'progress_desc' },
            { label: 'Streak Avg', value: `${stats.averageStreak ?? 0} Days`, color: 'text-orange-700', bg: 'bg-orange-50 border-orange-100', filterType: 'sort', filterValue: 'streak_desc', active: sortBy === 'streak_desc' },
            { label: 'Certificates Issued', value: stats.certificatesIssued ?? 0, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-100', filterType: 'info', filterValue: '', active: false },
            { label: 'Sandbox Projects', value: stats.totalSandboxProjects ?? 0, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100', filterType: 'info', filterValue: '', active: false },
            { label: 'Codex Workspaces', value: stats.totalCodexWorkspaces ?? 0, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-100', filterType: 'info', filterValue: '', active: false },
          ].map((stat) => (
            <div
              key={stat.label}
              onClick={() => handleStatCardClick(stat.filterType, stat.filterValue, stat.label)}
              title={`Click to filter or view ${stat.label}`}
              className={`p-3.5 border rounded-2xl flex flex-col justify-between shadow-[0_1px_2px_0_rgba(0,0,0,0.01)] cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:scale-98 transition-all ${stat.bg} ${
                stat.active ? 'ring-2 ring-emerald-500 ring-offset-1 border-emerald-400 font-bold' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[8.5px] uppercase tracking-wider font-extrabold text-slate-400 font-mono-origin">{stat.label}</span>
                <span className="text-[7.5px] uppercase tracking-wide text-slate-400 font-bold opacity-75">Click to view</span>
              </div>
              <span className={`text-lg font-black mt-1 font-mono-origin ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filter and Bulk Actions Control Panel */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          
          {/* Search bar */}
          <div className="relative md:col-span-2">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Search by name, user, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono-origin"
            />
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => { setSelectedRole(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none transition-all font-semibold text-slate-500"
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="mentor">Mentor</option>
            <option value="recruiter">Recruiter</option>
            <option value="organization">Organization</option>
            <option value="admin">Admin</option>
          </select>

          {/* Plan Filter */}
          <select
            value={selectedPlan}
            onChange={(e) => { setSelectedPlan(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none transition-all font-semibold text-slate-500"
          >
            <option value="">All Plans</option>
            <option value="free">Free</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none transition-all font-semibold text-slate-500"
          >
            <option value="">All Statuses</option>
            <option value="true">Active</option>
            <option value="false">Suspended</option>
          </select>

          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none transition-all font-semibold text-slate-500"
          >
            <option value="newest">Newest Joiners</option>
            <option value="oldest">Oldest Accounts</option>
            <option value="progress_desc">Highest Progress</option>
            <option value="streak_desc">Highest Streak</option>
          </select>

        </div>

        {/* Bulk Action Controls */}
        {selectedUserIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-emerald-50/50 border border-emerald-100 rounded-xl p-2.5"
          >
            <span className="text-[11px] font-bold text-emerald-800">
              {selectedUserIds.length} users selected
            </span>
            <div className="h-4 w-px bg-emerald-200" />
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="px-2.5 py-1 bg-white border border-emerald-250 rounded-lg text-[10.5px] font-bold focus:outline-none text-slate-700"
            >
              <option value="">Select Bulk Action</option>
              <option value="suspend">Suspend Users</option>
              <option value="activate">Activate Users</option>
              <option value="delete">Delete Accounts</option>
            </select>
            <button
              onClick={handleBulkAction}
              className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[10.5px] font-bold hover:bg-emerald-700 transition-all"
            >
              Apply Action
            </button>
            <button
              onClick={() => setSelectedUserIds([])}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase ml-auto"
            >
              Deselect All
            </button>
          </motion.div>
        )}
      </div>

      {/* Main accounts Registry Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="animate-spin text-emerald-600" size={32} />
            <span className="text-xs text-slate-400 font-semibold font-mono-origin">Compiling Accounts registry...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <ShieldAlert size={40} className="text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No users found</p>
            <p className="text-xs text-slate-450 mt-1">Try adjusting your filters or search strings.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse select-none">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 font-mono-origin">
                  <th className="py-3.5 px-4 text-center w-10">
                    <input
                      type="checkbox"
                      checked={selectedUserIds.length === users.length}
                      onChange={toggleSelectAll}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                  </th>
                  <th className="py-3.5 px-4">Profile Info</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Avg Progress</th>
                  <th className="py-3.5 px-4">Projects</th>
                  <th className="py-3.5 px-4">Followers</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-semibold">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(u._id)}
                        onChange={() => toggleSelectUser(u._id)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80'}
                            alt={u.fullName}
                            className="w-full h-full object-cover"
                          />
                          {u.isOnline && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800 text-xs font-mono-origin">{u.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-mono-origin mt-0.5">@{u.username} • {u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] uppercase font-bold tracking-wider leading-none
                        ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          u.role === 'instructor' ? 'bg-rose-100 text-rose-700' :
                          u.role === 'mentor' ? 'bg-orange-100 text-orange-700' :
                          u.role === 'recruiter' ? 'bg-indigo-100 text-indigo-700' :
                          u.role === 'organization' ? 'bg-pink-100 text-pink-700' :
                          'bg-sky-100 text-sky-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide leading-none
                        ${u.isActive ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {u.isActive ? <CheckCircle size={12} /> : <Ban size={12} />}
                        <span>{u.isActive ? 'Active' : 'Suspended'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-mono-origin text-[10.5px] font-bold text-slate-700">{u.learningProgress}%</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${u.learningProgress}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col text-[10px] text-slate-400 font-mono-origin">
                        <span className="font-bold text-slate-700">Sandbox: {u.projects}</span>
                        <span>Certs: {u.certificates}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col text-[10px] text-slate-400 font-mono-origin">
                        <span>Followers: {u.followers}</span>
                        <span>Following: {u.following}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[10px] text-slate-450 font-mono-origin font-bold">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/admin/users/${u._id}`)}
                          className="p-1 text-slate-450 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                          title="Detailed Profile"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={async () => {
                            const detailRes = await apiClient.get(`/admin/users/${u._id}`);
                            setActiveUser(detailRes.data.data);
                            setActionDrawerOpen(true);
                          }}
                          className="p-1 text-slate-450 hover:text-slate-850 hover:bg-slate-100 rounded transition-colors"
                          title="Admin Actions"
                        >
                          <MoreVertical size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {stats && users.length > 0 && (
          <div className="py-3.5 px-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 select-none">
            <span className="font-semibold font-mono-origin">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalEntries)} of {totalEntries} accounts
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(page - 1, 1))}
                disabled={page === 1}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-white bg-slate-100 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold font-mono-origin">{page} / {totalPages}</span>
              <button
                onClick={() => setPage(Math.min(page + 1, totalPages))}
                disabled={page === totalPages}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-white bg-slate-100 disabled:opacity-50 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Admin Action Control Modal Drawer */}
      <AnimatePresence>
        {actionDrawerOpen && activeUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setActionDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="text-sm font-extrabold tracking-tight text-slate-900">Admin Actions</h3>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono-origin">@{activeUser.personal.username} • {activeUser.personal.email}</p>
                </div>
                <button
                  onClick={() => setActionDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-150 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Personal Details Preview in Drawer */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200">
                  <img
                    src={activeUser.personal.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80'}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">{activeUser.personal.fullName}</h4>
                  <p className="text-[9.5px] uppercase font-bold text-slate-450 mt-1 font-mono-origin">Role: {activeUser.personal.role}</p>
                  <p className="text-[9.5px] uppercase font-bold text-slate-450 mt-0.5 font-mono-origin">Plan: {activeUser.personal.plan}</p>
                </div>
              </div>

              {/* Quick Actions Triggers */}
              <div className="flex flex-col gap-4">
                
                {/* 1. Account status controls */}
                <div className="border border-slate-150 rounded-2xl p-4">
                  <h5 className="text-[10.5px] uppercase tracking-wide font-black text-slate-400 mb-3 font-mono-origin">Account Control</h5>
                  <div className="flex items-center gap-2">
                    {activeUser.personal.isActive ? (
                      <button
                        onClick={() => {
                          const reason = prompt('Specify suspension reason:');
                          if (reason !== null) handleUserAction('suspend', { reason });
                        }}
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10.5px] font-bold transition-all flex items-center gap-1.5"
                      >
                        <Ban size={14} />
                        <span>Suspend Account</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUserAction('activate')}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10.5px] font-bold transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle size={14} />
                        <span>Activate Account</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleUserAction('resetPassword')}
                      className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl text-[10.5px] font-bold transition-all flex items-center gap-1.5"
                    >
                      <Key size={14} />
                      <span>Reset Password</span>
                    </button>
                  </div>
                </div>

                {/* 2. Assign User Role */}
                <div className="border border-slate-150 rounded-2xl p-4">
                  <h5 className="text-[10.5px] uppercase tracking-wide font-black text-slate-400 mb-3 font-mono-origin">Change User Role</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {['student', 'instructor', 'mentor', 'recruiter', 'organization', 'admin'].map((role) => (
                      <button
                        key={role}
                        onClick={() => handleUserAction('role', { role })}
                        disabled={activeUser.personal.role === role}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border
                          ${activeUser.personal.role === role
                            ? 'bg-slate-100 text-slate-400 border-slate-200'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'}`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Send Notification Form */}
                <div className="border border-slate-150 rounded-2xl p-4 flex flex-col gap-2.5">
                  <h5 className="text-[10.5px] uppercase tracking-wide font-black text-slate-400 font-mono-origin">Send Notification</h5>
                  <input
                    type="text"
                    placeholder="Notification Title"
                    value={notifyTitle}
                    onChange={(e) => setNotifyTitle(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none w-full font-semibold bg-slate-50 focus:bg-white"
                  />
                  <textarea
                    placeholder="Enter message body here..."
                    value={notifyMessage}
                    onChange={(e) => setNotifyMessage(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none w-full h-18 font-semibold bg-slate-50 focus:bg-white resize-none"
                  />
                  <button
                    onClick={() => {
                      if (!notifyTitle || !notifyMessage) {
                        toast.error('Title and message are required');
                        return;
                      }
                      handleUserAction('notify', { title: notifyTitle, message: notifyMessage });
                      setNotifyTitle('');
                      setNotifyMessage('');
                    }}
                    className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10.5px] font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare size={14} />
                    <span>Send Push Notification</span>
                  </button>
                </div>

                {/* 4. Send Email Form */}
                <div className="border border-slate-150 rounded-2xl p-4 flex flex-col gap-2.5">
                  <h5 className="text-[10.5px] uppercase tracking-wide font-black text-slate-400 font-mono-origin">Send Email (Simulation)</h5>
                  <input
                    type="text"
                    placeholder="Email Subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none w-full font-semibold bg-slate-50 focus:bg-white"
                  />
                  <textarea
                    placeholder="Enter email content here..."
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none w-full h-18 font-semibold bg-slate-50 focus:bg-white resize-none"
                  />
                  <button
                    onClick={() => {
                      if (!emailSubject || !emailBody) {
                        toast.error('Subject and body are required');
                        return;
                      }
                      handleUserAction('email', { subject: emailSubject, body: emailBody });
                      setEmailSubject('');
                      setEmailBody('');
                    }}
                    className="py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10.5px] font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Mail size={14} />
                    <span>Log Simulated Email</span>
                  </button>
                </div>

                {/* 5. Dangerous deletion block */}
                <div className="border border-red-100 bg-red-50/50 rounded-2xl p-4 mt-2">
                  <h5 className="text-[10.5px] uppercase tracking-wide font-black text-red-500 font-mono-origin">Dangerous Zone</h5>
                  <p className="text-[9.5px] text-red-400 mt-1 font-semibold">Deleting users removes references but keeps analytics logs. Confirm type of deletion:</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        if (confirm('Deactivate user account?')) handleUserAction('delete', { hard: false });
                      }}
                      className="px-3.5 py-2 bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 rounded-xl text-[10px] font-bold transition-all"
                    >
                      Deactivate Account (Soft)
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('WARNING: Permanently delete this account? This cannot be undone.')) handleUserAction('delete', { hard: true });
                      }}
                      className="px-3.5 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl text-[10px] font-bold transition-all"
                    >
                      Delete Account (Hard)
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
