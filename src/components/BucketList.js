import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './BucketList.css';

const CATEGORIES = ['All', 'Travel', 'Adventure', 'Career', 'Personal', 'Other'];

export default function BucketList() {
  const [items, setItems] = useLocalStorage('fs-bucket', []);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('Personal');
  const [filter, setFilter] = useState('All');

  const add = () => {
    const text = input.trim();
    if (!text) return;
    setItems(prev => [{ id: Date.now(), text, category, done: false }, ...prev]);
    setInput('');
  };

  const toggle = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const filtered = items.filter(i => filter === 'All' || i.category === filter);
  const doneCount = items.filter(i => i.done).length;

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">Bucket List</h1>
        <div className="section-subtitle">{doneCount} of {items.length} achieved</div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="bucket-input-row">
          <input
            className="input-field"
            placeholder="Add a bucket list item..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
          />
          <select className="input-field" value={category} onChange={e => setCategory(e.target.value)} style={{ maxWidth: 130 }}>
            {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
          </select>
          <button className="btn btn-primary" onClick={add}>Add</button>
        </div>
      </div>

      <div className="bucket-filters">
        {CATEGORIES.map(c => (
          <button
            key={c}
            className={`filter-btn ${filter === c ? 'active' : ''}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="bucket-list">
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">◇</div>
            <div>Dream big. Add something above.</div>
          </div>
        )}
        {filtered.map((item, i) => (
          <div key={item.id} className={`bucket-item fade-in ${item.done ? 'done' : ''}`} style={{ animationDelay: `${i * 0.04}s` }}>
            <button className={`check-btn ${item.done ? 'checked' : ''}`} onClick={() => toggle(item.id)}>
              {item.done && <span className="check-mark">✓</span>}
            </button>
            <div className="bucket-content">
              <div className="bucket-text">{item.text}</div>
              <span className="bucket-cat">{item.category}</span>
            </div>
            <button className="btn-delete" onClick={() => remove(item.id)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
