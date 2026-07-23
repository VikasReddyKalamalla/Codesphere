import React from 'react';
import { Card } from '../common/Card.jsx';
import { CardBody } from '../common/CardBody.jsx';
import { Button } from '../common/Button.jsx';
import { Calendar, MapPin } from 'lucide-react';

export const EventCard = ({ event = {}, onRegister }) => {
  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 relative">
          {event.image ? (
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Event Banner</div>
          )}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-850 dark:text-white">{event.title}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{event.description}</p>
        </div>
        <div className="flex flex-col gap-1.5 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-850 pt-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{event.location}</span>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={onRegister} className="w-full mt-2">Register</Button>
      </CardBody>
    </Card>
  );
};
