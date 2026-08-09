import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react';
import { useParams as useReactParams, useNavigate as useReactNavigate } from 'react-router-dom';
import { fetchEventByIdAPI, registerEventAPI, bookmarkEventAPI } from '../services/eventAPI.js';
import { EventDetailModal } from '../components/EventDetailModal.jsx';
import { BackButton } from '@components/common/BackButton.jsx';
import toast from 'react-hot-toast';

export const EventDetails = () => {
  const { eventId } = useReactParams();
  const navigate = useReactNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    fetchEventByIdAPI(eventId)
      .then(data => {
        setEvent(data.event || data);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleRegister = () => {
    setIsRegistered(!isRegistered);
    const targetUrl = event?.registrationUrl || event?.externalUrl || event?.url || event?.websiteUrl || event?.registrationLink || event?.link || event?.officialUrl;
    if (targetUrl && typeof targetUrl === 'string' && targetUrl.trim()) {
      const trimmed = targetUrl.trim();
      const formattedUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      window.open(formattedUrl, '_blank', 'noopener,noreferrer');
    }
    toast.success(isRegistered ? 'Registration cancelled' : 'Successfully registered for event!');
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Bookmark removed' : 'Event bookmarked!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-[#04AA6D] font-mono text-xs">
        Loading Event Details...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <BackButton fallbackPath="/events" className="self-start" />
      <EventDetailModal
        event={event}
        onClose={() => navigate('/events')}
        isRegistered={isRegistered}
        isBookmarked={isBookmarked}
        onRegister={handleRegister}
        onBookmark={handleBookmark}
      />
    </div>
  );
};
export default EventDetails;
