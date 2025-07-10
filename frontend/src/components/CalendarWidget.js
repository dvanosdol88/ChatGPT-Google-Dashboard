import React, { useState, useEffect } from 'react';
import { 
  CalendarWidget as StyledWidget,
  WidgetHeader, 
  WidgetTitle, 
  WidgetIcon, 
  WidgetContent,
  ListItem,
  ActionButton
} from './styled/WidgetStyles';
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
    <StyledWidget>
      <WidgetHeader>
        <WidgetTitle>Calendar</WidgetTitle>
        <WidgetIcon>📅</WidgetIcon>
      </WidgetHeader>
      <WidgetContent>
        {loading ? (
          <p>Loading events...</p>
        ) : (
          <>
            <div style={{ 
              padding: '12px', 
              background: 'rgba(0, 64, 128, 0.05)',
              borderRadius: '8px',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.9em', color: '#6c757d' }}>
                {formatDate(currentDate)}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ fontSize: '0.95em', marginBottom: '10px', color: '#0A1828' }}>
                Upcoming Events
              </h4>
              
              {events.length === 0 ? (
                <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>
                  No upcoming events
                </p>
              ) : (
                events.map(event => (
                  <ListItem
                    key={event.id}
                    onClick={() => event.htmlLink && window.open(event.htmlLink, '_blank')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      borderLeft: `3px solid ${event.color || '#004080'}`,
                      cursor: event.htmlLink ? 'pointer' : 'default'
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>
                      {getEventIcon(event.type)}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500' }}>{event.title}</div>
                      <div style={{ fontSize: '0.85em', color: '#6c757d' }}>
                        {event.date} • {event.isAllDay ? 'All day' : event.time}
                      </div>
                    </div>
                  </ListItem>
                ))
              )}
            </div>

            <div style={{ textAlign: 'center' }}>
              <ActionButton 
                onClick={openGoogleCalendar}
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                View Full Calendar
              </ActionButton>
            </div>
          </>
        )}
      </WidgetContent>
    </StyledWidget>
  );
}

export default CalendarWidget;