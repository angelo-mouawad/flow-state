import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './Todo.css';

export default function Todo() {
  const [todos, setTodos] = useLocalStorage('fs-todos', []);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  const add = () => {
    const text = input.trim();
    if (!text) return;
    setTodos(prev => [{ id: Date.now(), text, done: false, createdAt: new Date().toISOString() }, ...prev]);
    setInput('');
  };

  const toggle = (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const remove = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const clearDone = () => setTodos(prev => prev.filter(t => !t.done));

  const filtered = todos.filter(t =>
    filter === 'all' ? true : filter === 'active' ? !t.done : t.done
  );

  const doneCount = todos.filter(t => t.done).length;
  const pct = todos.length ? Math.round((doneCount / todos.length) * 100) : 0;

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">Tasks</h1>
        <div className="section-subtitle">{doneCount} of {todos.length} completed</div>
      </div>

      {todos.length > 0 && (
        <div className="progress-bar-wrap">
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-pct">{pct}%</span>
        </div>
      )}

      <div className="input-row">
        <input
          className="input-field"
          placeholder="Add a new task..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button className="btn btn-primary" onClick={add}>Add</button>
      </div>

      <div className="todo-filters">
        {['all', 'active', 'done'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        {doneCount > 0 && (
          <button className="btn btn-danger" style={{ marginLeft: 'auto' }} onClick={clearDone}>
            Clear done
          </button>
        )}
      </div>

      <div className="todo-list">
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">✦</div>
            <div>{filter === 'done' ? 'Nothing completed yet.' : 'All clear — add a task above.'}</div>
          </div>
        )}
        {filtered.map((t, i) => (
          <div
            key={t.id}
            className={`todo-item ${t.done ? 'done' : ''}`}
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <button
              className={`check-btn ${t.done ? 'checked' : ''}`}
              onClick={() => toggle(t.id)}
              aria-label="Toggle task"
            >
              {t.done && <span className="check-mark">✓</span>}
            </button>
            <span className="todo-text">{t.text}</span>
            <button className="btn-delete" onClick={() => remove(t.id)} aria-label="Delete">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
