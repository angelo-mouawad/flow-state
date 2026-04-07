import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './Birthdays.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function daysUntil(month, day) {
  const now = new Date();
  const next = new Date(now.getFullYear(), month - 1, day);
  if (next < now) next.setFullYear(now.getFullYear() + 1);
  const diff = Math.ceil((next - now) / (1000 * 60 * 60 * 24));
  return diff === 0 ? 'Today! 🎉' : diff === 1 ? 'Tomorrow!' : `${diff} days`;
}

export default function Birthdays() {
  const [birthdays, setBirthdays] = useLocalStorage('fs-birthdays', []);
  const [name, setName] = useState('');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('');

  const add = () => {
    if (!name.trim() || !day) return;
    setBirthdays(prev => [...prev, {
      id: Date.now(), name: name.trim(),
      month: parseInt(month), day: parseInt(day)
    }]);
    setName(''); setDay('');
  };

  const remove = (id) => setBirthdays(prev => prev.filter(b => b.id !== id));

  const sorted = [...birthdays].sort((a, b) => {
    const now = new Date();
    const da = new Date(now.getFullYear(), a.month - 1, a.day);
    const db = new Date(now.getFullYear(), b.month - 1, b.day);
    if (da < now) da.setFullYear(now.getFullYear() + 1);
    if (db < now) db.setFullYear(now.getFullYear() + 1);
    return da - db;
  });

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">Birthdays</h1>
        <div className="section-subtitle">Never miss an important day</div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="birthday-input-grid">
          <input className="input-field" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <select className="input-field" value={month} onChange={e => setMonth(e.target.value)}>
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <input className="input-field" placeholder="Day" type="number" min="1" max="31"
            value={day} onChange={e => setDay(e.target.value)} />
          <button className="btn btn-primary" onClick={add}>Add</button>
        </div>
      </div>

      <div className="birthday-list">
        {sorted.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">◎</div>
            <div>No birthdays added yet.</div>
          </div>
        )}
        {sorted.map((b, i) => {
          const countdown = daysUntil(b.month, b.day);
          const isToday = countdown === 'Today! 🎉';
          const isSoon = countdown === 'Tomorrow!' || (typeof countdown === 'string' && parseInt(countdown) <= 7);
          return (
            <div key={b.id} className={`birthday-card fade-in ${isToday ? 'today' : ''}`} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="birthday-avatar">{b.name.charAt(0).toUpperCase()}</div>
              <div className="birthday-info">
                <div className="birthday-name">{b.name}</div>
                <div className="birthday-date">{MONTHS[b.month - 1]} {b.day}</div>
              </div>
              <div className={`birthday-countdown ${isToday ? 'today' : isSoon ? 'soon' : ''}`}>
                {countdown}
              </div>
              <button className="btn-delete-b" onClick={() => remove(b.id)}>✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
