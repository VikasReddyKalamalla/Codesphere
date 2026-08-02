import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe2, Sparkles, Search, Filter, Calendar, Bookmark, Award, Flame, Plus,
  Layers, MapPin, Users, Trophy, CheckCircle2, BarChart3, RefreshCw
} from 'lucide-react';

import { Event3DGlobe } from '../components/Event3DGlobe.jsx';
import { EventCard } from '../components/EventCard.jsx';
import { EventFilterSidebar } from '../components/EventFilterSidebar.jsx';
import { EventDetailModal } from '../components/EventDetailModal.jsx';
import { EventCalendarView } from '../components/EventCalendarView.jsx';
import { EventAnalyticsDashboard } from '../components/EventAnalyticsDashboard.jsx';
import { CreateEventModal } from '../components/CreateEventModal.jsx';

import { socket } from '../../../socket/socket.js';

import {
  fetchEventsThunk,
  fetchGlobeMarkersThunk,
  fetchUserMetadataThunk,
  fetchAnalyticsSummaryThunk,
  toggleBookmarkThunk,
  toggleRegistrationThunk,
  createEventThunk,
} from '../redux/eventThunk.js';

import {
  selectFilteredEvents,
  selectGlobeMarkers,
  selectActiveTab,
  selectSearchQuery,
  selectSelectedEventType,
  selectSelectedMode,
  selectSelectedDifficulty,
  selectPriceFilter,
  selectUserBookmarks,
  selectUserRegistrations,
  selectAnalyticsSummary,
} from '../redux/eventSelectors.js';

import {
  setActiveTab,
  setSearchQuery,
  setSelectedEventType,
  setSelectedMode,
  setSelectedDifficulty,
  setPriceFilter,
  resetFilters,
} from '../redux/eventSlice.js';

export const Events = () => {
  const dispatch = useDispatch();

  const filteredEvents = useSelector(selectFilteredEvents);
  const globeMarkers = useSelector(selectGlobeMarkers);
  const activeTab = useSelector(selectActiveTab);
  const searchQuery = useSelector(selectSearchQuery);
  const selectedEventType = useSelector(selectSelectedEventType);
  const selectedMode = useSelector(selectSelectedMode);
  const selectedDifficulty = useSelector(selectSelectedDifficulty);
  const priceFilter = useSelector(selectPriceFilter);
  const userBookmarks = useSelector(selectUserBookmarks);
  const userRegistrations = useSelector(selectUserRegistrations);
  const analyticsSummary = useSelector(selectAnalyticsSummary);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEventsThunk());
    dispatch(fetchGlobeMarkersThunk());
    dispatch(fetchUserMetadataThunk());
    dispatch(fetchAnalyticsSummaryThunk());

    const handleEventChange = (evt) => {
      const entity = evt?.entity;
      if (!entity || entity === 'event') {
        dispatch(fetchEventsThunk());
        dispatch(fetchGlobeMarkersThunk());
        dispatch(fetchAnalyticsSummaryThunk());
      }
    };

    socket.on('admin:data_changed', handleEventChange);
    socket.on('event:changed', handleEventChange);

    return () => {
      socket.off('admin:data_changed', handleEventChange);
      socket.off('event:changed', handleEventChange);
    };
  }, [dispatch]);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleBookmark = (event) => {
    const isBookmarked = userBookmarks.includes(event._id || event.id);
    dispatch(toggleBookmarkThunk(event._id || event.id, isBookmarked));
  };

  const handleRegister = (event) => {
    const isRegistered = userRegistrations.includes(event._id || event.id);
    dispatch(toggleRegistrationThunk(event._id || event.id, isRegistered));

    const targetUrl = event.registrationUrl || event.externalUrl || event.url || event.registrationLink;
    if (targetUrl) {
      const sourceName = (event.registrationSource || event.source || 'official').toUpperCase();
      toast.success(`Redirecting to ${sourceName} official registration portal...`);
      setTimeout(() => {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }, 500);
    } else {
      toast.success(isRegistered ? 'Registration cancelled' : 'Successfully registered on CodeSphere!');
    }
  };

  const handleCreateSubmit = (newEventData) => {
    dispatch(createEventThunk(newEventData));
  };

  const currentUser = useSelector(state => state.auth?.user);
  const canPublish = currentUser?.role === 'admin' || currentUser?.role === 'instructor';

  const bookmarkedList = filteredEvents.filter(e => userBookmarks.includes(e._id || e.id));
  const registeredList = filteredEvents.filter(e => userRegistrations.includes(e._id || e.id));
  const hackathonsList = filteredEvents.filter(e => e.eventType === 'hackathon' || e.eventType === 'coding_contest');

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen text-slate-900 dark:text-slate-100 bg-white dark:bg-[#070a13] p-6 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm dark:shadow-2xl relative overflow-hidden font-sans transition-colors duration-200 pb-16 animate-fade-in">
      {/* Background glow accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#04AA6D] to-teal-600 shadow-lg shadow-emerald-500/25">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-[#04AA6D] dark:from-white dark:via-slate-200 dark:to-emerald-400 bg-clip-text text-transparent tracking-tight">
              Global Developer Events & 3D Earth Hub
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
            Discover hackathons, AI conferences, developer summits, and coding contests happening around the world.
          </p>
        </div>

        {canPublish && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#04AA6D] to-teal-600 hover:from-[#03935e] hover:to-teal-500 active:scale-95 transition-all text-white shadow-xl shadow-emerald-500/20 border border-emerald-500/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Publish Event
          </button>
        )}
      </div>

      {/* Global Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-slate-100/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900/80 p-2 rounded-2xl backdrop-blur-md z-10">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#04AA6D]" />
          <input
            type="text"
            placeholder="Search events by title, technology (AI, React, Cloud), company, country, or city..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#04AA6D]/50 focus:border-[#04AA6D] rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all"
          />
        </div>

        {searchQuery && (
          <button
            onClick={() => dispatch(resetFilters())}
            className="px-4 py-2.5 bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar gap-2">
        {[
          { id: 'globe', label: '3D Earth Globe', icon: Globe2 },
          { id: 'explore', label: `Explore Events (${filteredEvents.length})`, icon: Layers },
          { id: 'hackathons', label: `Hackathons (${hackathonsList.length})`, icon: Flame },
          { id: 'calendar', label: 'Timeline & Calendar', icon: Calendar },
          { id: 'bookmarks', label: `Bookmarks (${userBookmarks.length})`, icon: Bookmark },
          { id: 'registrations', label: `My Registrations (${userRegistrations.length})`, icon: CheckCircle2 },
          { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => dispatch(setActiveTab(tab.id))}
              className={`px-4 py-3 rounded-t-2xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border-t border-x cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-900 text-[#04AA6D] dark:text-emerald-400 border-slate-200 dark:border-slate-800 shadow-sm'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#04AA6D]' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      {activeTab === 'globe' && (
        <div className="flex flex-col gap-6">
          {/* Interactive Fixed-Center 3D Earth Globe */}
          <Event3DGlobe
            markers={globeMarkers}
            onSelectEvent={handleSelectEvent}
          />

          {/* Featured Events Rail below Globe */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#04AA6D]" />
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Featured & Trending Global Events</h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Showing {filteredEvents.length} events</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.slice(0, 6).map(ev => (
                <EventCard
                  key={ev._id || ev.id}
                  event={ev}
                  isBookmarked={userBookmarks.includes(ev._id || ev.id)}
                  isRegistered={userRegistrations.includes(ev._id || ev.id)}
                  onSelect={handleSelectEvent}
                  onBookmark={handleBookmark}
                  onRegister={handleRegister}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'explore' && (
        <div className="flex flex-col lg:flex-row gap-6">
          <EventFilterSidebar
            selectedEventType={selectedEventType}
            selectedMode={selectedMode}
            selectedDifficulty={selectedDifficulty}
            priceFilter={priceFilter}
            searchQuery={searchQuery}
            onTypeChange={(val) => dispatch(setSelectedEventType(val))}
            onModeChange={(val) => dispatch(setSelectedMode(val))}
            onDifficultyChange={(val) => dispatch(setSelectedDifficulty(val))}
            onPriceChange={(val) => dispatch(setPriceFilter(val))}
            onReset={() => dispatch(resetFilters())}
          />

          <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Found {filteredEvents.length} Events</h2>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900 rounded-3xl flex flex-col items-center gap-3">
                <Globe2 className="w-12 h-12 text-slate-400 dark:text-slate-600" />
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200">No events matched your filters</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your category, location or fee filter.</p>
                <button
                  onClick={() => dispatch(resetFilters())}
                  className="mt-2 px-4 py-2 bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map(ev => (
                  <EventCard
                    key={ev._id || ev.id}
                    event={ev}
                    isBookmarked={userBookmarks.includes(ev._id || ev.id)}
                    isRegistered={userRegistrations.includes(ev._id || ev.id)}
                    onSelect={handleSelectEvent}
                    onBookmark={handleBookmark}
                    onRegister={handleRegister}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'hackathons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathonsList.map(ev => (
            <EventCard
              key={ev._id || ev.id}
              event={ev}
              isBookmarked={userBookmarks.includes(ev._id || ev.id)}
              isRegistered={userRegistrations.includes(ev._id || ev.id)}
              onSelect={handleSelectEvent}
              onBookmark={handleBookmark}
              onRegister={handleRegister}
            />
          ))}
        </div>
      )}

      {activeTab === 'calendar' && (
        <EventCalendarView events={filteredEvents} onSelectEvent={handleSelectEvent} />
      )}

      {activeTab === 'bookmarks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedList.map(ev => (
            <EventCard
              key={ev._id || ev.id}
              event={ev}
              isBookmarked={true}
              isRegistered={userRegistrations.includes(ev._id || ev.id)}
              onSelect={handleSelectEvent}
              onBookmark={handleBookmark}
              onRegister={handleRegister}
            />
          ))}
        </div>
      )}

      {activeTab === 'registrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registeredList.map(ev => (
            <EventCard
              key={ev._id || ev.id}
              event={ev}
              isBookmarked={userBookmarks.includes(ev._id || ev.id)}
              isRegistered={true}
              onSelect={handleSelectEvent}
              onBookmark={handleBookmark}
              onRegister={handleRegister}
            />
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <EventAnalyticsDashboard data={analyticsSummary} />
      )}

      {/* Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          isBookmarked={userBookmarks.includes(selectedEvent._id || selectedEvent.id)}
          isRegistered={userRegistrations.includes(selectedEvent._id || selectedEvent.id)}
          onBookmark={() => handleBookmark(selectedEvent)}
          onRegister={() => handleRegister(selectedEvent)}
        />
      )}

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <CreateEventModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateSubmit}
        />
      )}
    </div>
  );
};
export default Events;
