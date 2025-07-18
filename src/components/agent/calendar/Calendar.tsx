import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  CheckCircle2,
  X,
  Edit3,
  Trash2
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  type: 'task' | 'event' | 'meeting' | 'reminder';
  priority?: 'low' | 'medium' | 'high';
  location?: string;
  attendees?: string[];
  description?: string;
  completed?: boolean;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    eventType: 'event' as 'task' | 'event' | 'meeting' | 'reminder',
    startTime: '',
    endTime: '',
    location: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // Mock events data - in real app this would come from your data sources
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Standup',
      date: new Date(2024, 11, 20),
      startTime: '09:00',
      endTime: '09:30',
      type: 'meeting',
      priority: 'high',
      attendees: ['John', 'Sarah', 'Mike']
    },
    {
      id: '2',
      title: 'Review quarterly reports',
      date: new Date(2024, 11, 20),
      type: 'task',
      priority: 'medium',
      completed: false
    },
    {
      id: '3',
      title: 'Doctor Appointment',
      date: new Date(2024, 11, 22),
      startTime: '14:00',
      endTime: '15:00',
      type: 'event',
      location: 'Medical Center'
    },
    {
      id: '4',
      title: 'Project Deadline',
      date: new Date(2024, 11, 25),
      type: 'reminder',
      priority: 'high'
    }
  ]);

  // Calendar navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setDate(prev.getDate() - 7);
      } else {
        newDate.setDate(prev.getDate() + 7);
      }
      return newDate;
    });
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setDate(prev.getDate() - 1);
      } else {
        newDate.setDate(prev.getDate() + 1);
      }
      return newDate;
    });
  };

  const navigate = (direction: 'prev' | 'next') => {
    switch (viewMode) {
      case 'month':
        navigateMonth(direction);
        break;
      case 'week':
        navigateWeek(direction);
        break;
      case 'day':
        navigateDay(direction);
        break;
    }
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Helper functions for different view modes
  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(date.getDate() - day);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const getHourlySlots = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push({
        hour: i,
        display: i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`
      });
    }
    return hours;
  };

  const formatViewTitle = () => {
    switch (viewMode) {
      case 'month':
        return formatMonthYear(currentDate);
      case 'week':
        const weekDays = getWeekDays(currentDate);
        const startDate = weekDays[0];
        const endDate = weekDays[6];
        if (startDate.getMonth() === endDate.getMonth()) {
          return `${startDate.toLocaleDateString('en-US', { month: 'long' })} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`;
        } else {
          return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${endDate.getFullYear()}`;
        }
      case 'day':
        return currentDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      default:
        return formatMonthYear(currentDate);
    }
  };

  // Event creation handler
  const handleCreateEvent = () => {
    if (!newEvent.title.trim()) return;

    const eventDate = selectedDate || currentDate;
    const event: CalendarEvent = {
      id: `event_${Date.now()}`,
      title: newEvent.title,
      description: newEvent.description,
      date: eventDate,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      type: newEvent.eventType,
      priority: newEvent.priority,
      location: newEvent.location,
      attendees: []
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({
      title: '',
      description: '',
      eventType: 'event',
      startTime: '',
      endTime: '',
      location: '',
      priority: 'medium'
    });
    setShowEventForm(false);
  };

  // Event editing handler
  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description || '',
      eventType: event.type,
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      location: event.location || '',
      priority: event.priority || 'medium'
    });
    setShowEventForm(true);
  };

  // Event update handler
  const handleUpdateEvent = () => {
    if (!editingEvent || !newEvent.title.trim()) return;

    const updatedEvent: CalendarEvent = {
      ...editingEvent,
      title: newEvent.title,
      description: newEvent.description,
      type: newEvent.eventType,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      location: newEvent.location,
      priority: newEvent.priority
    };

    setEvents(prev => prev.map(e => e.id === editingEvent.id ? updatedEvent : e));
    setEditingEvent(null);
    setNewEvent({
      title: '',
      description: '',
      eventType: 'event',
      startTime: '',
      endTime: '',
      location: '',
      priority: 'medium'
    });
    setShowEventForm(false);
  };

  // Event deletion handler
  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  }, [currentDate]);

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  // Get event type styling
  const getEventTypeStyle = (type: CalendarEvent['type'], priority?: string) => {
    const baseClasses = "text-xs px-2 py-1 rounded-full font-medium truncate";
    
    switch (type) {
      case 'task':
        return `${baseClasses} ${
          priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
          priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
          'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
        }`;
      case 'meeting':
        return `${baseClasses} bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400`;
      case 'event':
        return `${baseClasses} bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400`;
      case 'reminder':
        return `${baseClasses} bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400`;
      default:
        return `${baseClasses} bg-secondary text-secondary-foreground`;
    }
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is in current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  // Format month/year
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="h-full overflow-y-auto pb-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-foreground">Calendar</h2>
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex bg-secondary rounded-lg p-1">
              {(['month', 'week', 'day'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors capitalize ${
                    viewMode === mode
                      ? 'bg-primary text-primary-foreground'
                      : 'text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowEventForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('prev')}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold text-foreground min-w-[300px] text-center">
              {formatViewTitle()}
            </h3>
            <button
              onClick={() => navigate('next')}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={navigateToToday}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Calendar Views */}
      {viewMode === 'month' && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 bg-muted">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isSelected = selectedDate?.toDateString() === day.toDateString();

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-[120px] p-2 border-r border-b border-border cursor-pointer hover:bg-accent/50 transition-colors ${
                    !isCurrentMonth(day) ? 'bg-muted/30' : ''
                  } ${isSelected ? 'bg-accent' : ''}`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday(day)
                      ? 'w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center'
                      : isCurrentMonth(day)
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                  }`}>
                    {day.getDate()}
                  </div>

                  {/* Events for this day */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={getEventTypeStyle(event.type, event.priority)}
                        title={`${event.title}${event.startTime ? ` at ${event.startTime}` : ''}`}
                      >
                        <div className="flex items-center space-x-1">
                          {event.type === 'task' && event.completed && (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          {event.startTime && (
                            <Clock className="w-3 h-3" />
                          )}
                          <span className="truncate">{event.title}</span>
                        </div>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 bg-muted">
            {getWeekDays(currentDate).map((day, index) => (
              <div key={index} className="p-3 text-center border-r border-border last:border-r-0">
                <div className="text-sm font-medium text-muted-foreground">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-semibold mt-1 ${
                  isToday(day)
                    ? 'w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto'
                    : 'text-foreground'
                }`}>
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Week Days Content */}
          <div className="grid grid-cols-7 min-h-[400px]">
            {getWeekDays(currentDate).map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isSelected = selectedDate?.toDateString() === day.toDateString();

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`p-2 border-r border-border last:border-r-0 cursor-pointer hover:bg-accent/50 transition-colors ${
                    isSelected ? 'bg-accent' : ''
                  }`}
                >
                  <div className="space-y-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={getEventTypeStyle(event.type, event.priority)}
                        title={`${event.title}${event.startTime ? ` at ${event.startTime}` : ''}`}
                      >
                        <div className="flex items-center space-x-1">
                          {event.startTime && (
                            <Clock className="w-3 h-3" />
                          )}
                          <span className="truncate text-xs">{event.title}</span>
                        </div>
                        {event.startTime && (
                          <div className="text-xs opacity-75">{event.startTime}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Day View */}
      {viewMode === 'day' && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {/* Day Header */}
          <div className="bg-muted p-4 border-b border-border">
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
              </div>
              <div className={`text-2xl font-bold mt-1 ${
                isToday(currentDate)
                  ? 'text-primary'
                  : 'text-foreground'
              }`}>
                {currentDate.getDate()}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Hourly Schedule */}
          <div className="max-h-[600px] overflow-y-auto">
            {getHourlySlots().map((slot) => {
              const hourEvents = getEventsForDate(currentDate).filter(event => {
                if (!event.startTime) return false;
                const eventHour = parseInt(event.startTime.split(':')[0]);
                return eventHour === slot.hour;
              });

              return (
                <div key={slot.hour} className="flex border-b border-border hover:bg-accent/30 transition-colors">
                  {/* Time Column */}
                  <div className="w-20 p-3 text-sm font-medium text-muted-foreground border-r border-border bg-muted/30">
                    {slot.display}
                  </div>

                  {/* Events Column */}
                  <div className="flex-1 p-3 min-h-[60px]">
                    {hourEvents.length === 0 ? (
                      <div className="h-full flex items-center">
                        <span className="text-muted-foreground text-sm opacity-50">No events</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {hourEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`${getEventTypeStyle(event.type, event.priority)} p-2 rounded-lg`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {event.type === 'task' && event.completed && (
                                  <CheckCircle2 className="w-4 h-4" />
                                )}
                                <span className="font-medium">{event.title}</span>
                              </div>
                              <div className="text-sm opacity-75">
                                {event.startTime} {event.endTime && `- ${event.endTime}`}
                              </div>
                            </div>
                            {event.location && (
                              <div className="flex items-center space-x-1 mt-1 text-sm opacity-75">
                                <MapPin className="w-3 h-3" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.description && (
                              <div className="mt-1 text-sm opacity-75">
                                {event.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Events for {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          <div className="space-y-3">
            {getEventsForDate(selectedDate).length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No events scheduled for this day</p>
                <button
                  onClick={() => setShowEventForm(true)}
                  className="mt-2 text-primary hover:text-primary/80 transition-colors"
                >
                  Add an event
                </button>
              </div>
            ) : (
              getEventsForDate(selectedDate).map((event) => (
                <div key={event.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-foreground">{event.title}</h4>
                        <span className={getEventTypeStyle(event.type, event.priority)}>
                          {event.type}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {event.startTime && (
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {event.startTime}
                              {event.endTime && ` - ${event.endTime}`}
                            </span>
                          </div>
                        )}
                        
                        {event.location && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>{event.attendees.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {event.type === 'task' && (
                        <button
                          onClick={() => {
                            setEvents(events.map(e =>
                              e.id === event.id ? { ...e, completed: !e.completed } : e
                            ));
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            event.completed
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleEditEvent(event)}
                        className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Tasks</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {events.filter(e => e.type === 'task').length}
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Meetings</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {events.filter(e => e.type === 'meeting').length}
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CalendarIcon className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-muted-foreground">Events</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {events.filter(e => e.type === 'event').length}
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-muted-foreground">Reminders</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {events.filter(e => e.type === 'reminder').length}
          </p>
        </div>
      </div>

      {/* Event Creation Modal */}
      {showEventForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
              <button
                onClick={() => {
                  setShowEventForm(false);
                  setEditingEvent(null);
                  setNewEvent({
                    title: '',
                    description: '',
                    eventType: 'event',
                    startTime: '',
                    endTime: '',
                    location: '',
                    priority: 'medium'
                  });
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="Event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                <select
                  value={newEvent.eventType}
                  onChange={(e) => setNewEvent({...newEvent, eventType: e.target.value as any})}
                  className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                >
                  <option value="event">Event</option>
                  <option value="task">Task</option>
                  <option value="meeting">Meeting</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                    className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">End Time</label>
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                    className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  rows={3}
                  placeholder="Event description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Location</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="Event location"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowEventForm(false)}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
