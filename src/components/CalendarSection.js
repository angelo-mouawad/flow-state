import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './CalendarSection.css';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function CalendarSection() {
  const [events, setEvents] = useLocalStorage('fs-events', []);
  const [birthdays] = useLocalStorage('fs-birthdays', []);
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newColor, setNewColor] = useState('#c9a96e');

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const getEventsForDay = (day) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const evts = events.filter(e => e.date === dateStr);
    const bdays = birthdays
      .filter(b => b.month === viewMonth + 1 && b.day === day)
      .map(b => ({ id: `bd-${b.id}`, title: `🎂 ${b.name}`, color: '#6dbf8a', isBirthday: true }));
    return [...evts, ...bdays];
  };

  const openDay = (day) => {
    setSelected(day);
    setShowModal(false);
  };

  const addEvent = () => {
    if (!newTitle.trim() || !selected) return;
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(selected).padStart(2,'0')}`;
    setEvents(prev => [...prev, { id: Date.now(), title: newTitle.trim(), date: dateStr, color: newColor }]);
    setNewTitle('');
    setShowModal(false);
  };

  const removeEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id));

  const selectedDateStr = selected
    ? `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(selected).padStart(2,'0')}`
    : null;

  const selectedEvents = selected ? getEventsForDay(selected) : [];

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">Calendar</h1>
        <div className="section-subtitle">Your schedule & birthdays</div>
      </div>

      <div className="cal-container card">
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
          <div className="cal-month-label">
            {MONTHS_FULL[viewMonth]} <span style={{ color: 'var(--text3)' }}>{viewYear}</span>
          </div>
          <button className="cal-nav-btn" onClick={nextMonth}>›</button>
        </div>

        <div className="cal-grid-header">
          {DAYS_OF_WEEK.map(d => <div key={d} className="cal-dow">{d}</div>)}
        </div>

        <div className="cal-grid">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} className="cal-cell empty" />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
            const dayEvents = getEventsForDay(day);
            const isSelected = selected === day;
            return (
              <div
                key={day}
                className={`cal-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayEvents.length ? 'has-events' : ''}`}
                onClick={() => openDay(day)}
              >
                <span className="cal-day-num">{day}</span>
                <div className="cal-dots">
                  {dayEvents.slice(0, 3).map((e, idx) => (
                    <span key={idx} className="cal-dot" style={{ background: e.color }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selected && (
        <div className="day-panel card fade-in">
          <div className="day-panel-header">
            <div className="day-panel-title">
              {MONTHS_SHORT[viewMonth]} {selected}, {viewYear}
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Event</button>
          </div>

          {showModal && (
            <div className="add-event-form">
              <input className="input-field" placeholder="Event title..." value={newTitle}
                onChange={e => setNewTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && addEvent()} />
              <div className="color-picks">
                {['#c9a96e','#6dbf8a','#7090e0','#e07070','#c07ad0'].map(c => (
                  <button key={c} className={`color-pick ${newColor === c ? 'active' : ''}`}
                    style={{ background: c }} onClick={() => setNewColor(c)} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={addEvent}>Save</button>
              </div>
            </div>
          )}

          {selectedEvents.length === 0 && !showModal && (
            <div style={{ color: 'var(--text3)', fontSize: 13, padding: '8px 0' }}>No events this day.</div>
          )}

          <div className="event-list">
            {selectedEvents.map(e => (
              <div key={e.id} className="event-item">
                <span className="event-dot" style={{ background: e.color }} />
                <span className="event-title">{e.title}</span>
                {!e.isBirthday && (
                  <button className="btn-delete" onClick={() => removeEvent(e.id)}>✕</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
