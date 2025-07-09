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
      // Mock data for now - replace with actual API response
      const mockEvents = [
        {
          id: '1',
          title: 'Team Standup',
          time: '10:00 AM',
          date: 'Today',
          type: 'meeting',
          color: '#4285f4'
        },
        {
          id: '2',
          title: 'Project Review',
          time: '2:00 PM',
          date: 'Today',
          type: 'meeting',
          color: '#ea4335'
        },
        {
          id: '3',
          title: 'Client Call',
          time: '11:00 AM',
          date: 'Tomorrow',
          type: 'call',
          color: '#34a853'
        },
        {
          id: '4',
          title: 'Code Review',
          time: '3:00 PM',
          date: 'Tomorrow',
          type: 'task',
          color: '#fbbc04'
        }
      ];
      setEvents(response.data?.events || mockEvents);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      // Use mock data as fallback
      setEvents([
        {
          id: '1',
          title: 'Connect Google Calendar',
          time: 'Configure API',
          date: 'Settings',
          type: 'info',
          color: '#6c757d'
        }
      ]);
    } finally {
      setLoading(false);
    }
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
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      borderLeft: `3px solid ${event.color || '#004080'}`
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>
                      {getEventIcon(event.type)}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500' }}>{event.title}</div>
                      <div style={{ fontSize: '0.85em', color: '#6c757d' }}>
                        {event.date} • {event.time}
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