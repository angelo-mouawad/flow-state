import React, { useState } from 'react';
import './App.css';
import Todo from './components/Todo';
import Workout from './components/Workout';
import Birthdays from './components/Birthdays';
import CalendarSection from './components/CalendarSection';
import WorldMap from './components/WorldMap';
import BucketList from './components/BucketList';

const NAV = [
  { id: 'todo',     label: 'Tasks',    icon: '✦' },
  { id: 'workout',  label: 'Workout',  icon: '◈' },
  { id: 'birthday', label: 'Birthdays',icon: '◎' },
  { id: 'calendar', label: 'Calendar', icon: '▦' },
  { id: 'map',      label: 'Map',      icon: '◉' },
  { id: 'bucket',   label: 'Bucket',   icon: '◇' },
];

export default function App() {
  const [active, setActive] = useState('todo');

  const renderSection = () => {
    switch (active) {
      case 'todo':     return <Todo />;
      case 'workout':  return <Workout />;
      case 'birthday': return <Birthdays />;
      case 'calendar': return <CalendarSection />;
      case 'map':      return <WorldMap />;
      case 'bucket':   return <BucketList />;
      default:         return <Todo />;
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">◈</span>
          <div>
            <div className="brand-name">Flow State</div>
            <div className="brand-sub">your daily companion</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-item ${active === n.id ? 'active' : ''}`}
              onClick={() => setActive(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </aside>

      <main className="main-content">
        <div className="section-wrapper fade-in" key={active}>
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
