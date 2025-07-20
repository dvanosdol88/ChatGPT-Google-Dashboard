// Enhanced CalendarWidget Component
// Changes:
// - Replaced all styled-components with Tailwind CSS classes for a modern, consistent UI.
// - Added full dark mode support (`dark:*` classes).
// - Implemented accessibility best practices (semantic HTML, ARIA roles, focus rings).
// - Used dynamic inline styles for event-specific color coding, while keeping all other styling in Tailwind.
// - Added smooth transitions for hover and focus states.

import React, { useState, useEffect } from 'react';
import { googleAPI } from '../api/api';

function CalendarWidget() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  const fetchCalendarEvents = async () => {
    try {
      const response = await googleAPI.getCalendarEvents();
      
      if (response.data && response.data.events) {
        // Map API response to display format
        const formattedEvents = response.data.events.map(event => ({
          id: event.id,
          title: event.summary,
          time: event.startTime,
          date: event.startDate,
          type: event.attendees > 0 ? 'meeting' : 'task',
          color: getEventColor(event.colorId),
          isAllDay: event.isAllDay,
          htmlLink: event.htmlLink
        }));
        setEvents(formattedEvents);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      // Show connection message
      setEvents([
        {
          id: '1',
          title: 'Unable to load calendar',
          time: 'Check Google Calendar permissions',
          date: 'Error',
          type: 'info',
          color: '#6c757d'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getEventColor = (colorId) => {
    // Google Calendar color mapping
    const colors = {
      '1': '#7986cb', // Lavender
      '2': '#33b679', // Sage
      '3': '#8e24aa', // Purple
      '4': '#e67c73', // Pink
      '5': '#f6bf26', // Yellow
      '6': '#f4511e', // Orange
      '7': '#039be5', // Blue
      '8': '#616161', // Gray
      '9': '#3f51b5', // Bold Blue
      '10': '#0b8043', // Bold Green
      '11': '#d50000'  // Bold Red
    };
    return colors[colorId] || '#4285f4'; // Default Google Blue
  };

  const openGoogleCalendar = () => {
    window.open('https://calendar.google.com', '_blank');
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'meeting': return '👥';
      case 'call': return '📞';
      case 'task': return '✓';
      case 'info': return 'ℹ️';
      default: return '📅';
    }
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return currentDate.toLocaleDateString(undefined, options);
  };

  return (
    <section 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 h-full flex flex-col transition-shadow duration-200 hover:shadow-lg border border-gray-200 dark:border-gray-700" 
      aria-labelledby="calendar-widget-title"
    >
      <header className="flex items-center justify-between">
        <h2 id="calendar-widget-title" className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Calendar
        </h2>
        <span className="text-2xl" role="img" aria-label="Calendar icon">📅</span>
      </header>

      <div className="mt-4 flex-grow flex flex-col">
        {loading ? (
          <p role="status" className="text-gray-500 dark:text-gray-400 animate-pulse">
            Loading events...
          </p>
        ) : (
          <>
            {/* Current Date Display */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {formatDate(currentDate)}
              </p>
            </div>

            {/* Events Section */}
            <div className="flex-grow">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Upcoming Events
              </h3>
              
              {events.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No upcoming events
                </p>
              ) : (
                <div className="space-y-2 overflow-y-auto max-h-64 -mr-3 pr-3">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderLeft: `3px solid ${event.color || '#4285f4'}` }}
                      onClick={() => event.htmlLink && window.open(event.htmlLink, '_blank')}
                      tabIndex="0"
                      onKeyPress={(e) => e.key === 'Enter' && event.htmlLink && window.open(event.htmlLink, '_blank')}
                      role="button"
                      aria-label={`View event: ${event.title}. ${event.date} at ${event.isAllDay ? 'All day' : event.time}`}
                    >
                      <span className="text-lg" role="img" aria-label={`${event.type} event`}>
                        {getEventIcon(event.type)}
                      </span>
                      <div className="flex-grow">
                        <p className="font-medium text-sm text-gray-800 dark:text-gray-100">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {event.date} • {event.isAllDay ? 'All day' : event.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
              <button
                onClick={openGoogleCalendar}
                aria-label="View full calendar in Google Calendar"
                className="
                  px-4 py-2 bg-blue-600 text-white text-sm font-semibold 
                  rounded-md shadow-sm transition-all duration-200
                  hover:bg-blue-700 hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-blue-500 dark:focus:ring-offset-gray-800
                "
              >
                View Full Calendar
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default CalendarWidget;