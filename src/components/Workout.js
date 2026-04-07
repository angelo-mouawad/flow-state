import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './Workout.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const emptyExercise = () => ({ id: Date.now(), name: '', sets: '', reps: '', weight: '' });

export default function Workout() {
  const [workouts, setWorkouts] = useLocalStorage('fs-workouts', {});
  const [activeDay, setActiveDay] = useState('Monday');
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState([]);

  const exercises = workouts[activeDay] || [];

  const startEdit = () => {
    setDraft(exercises.length ? exercises.map(e => ({ ...e })) : [emptyExercise()]);
    setEditMode(true);
  };

  const cancelEdit = () => { setEditMode(false); setDraft([]); };

  const saveEdit = () => {
    const cleaned = draft.filter(e => e.name.trim());
    setWorkouts(prev => ({ ...prev, [activeDay]: cleaned }));
    setEditMode(false);
    setDraft([]);
  };

  const addExercise = () => setDraft(prev => [...prev, emptyExercise()]);

  const removeExercise = (id) => setDraft(prev => prev.filter(e => e.id !== id));

  const updateExercise = (id, field, val) => {
    setDraft(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  return (
    <div>
      <div className="section-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="section-title">Workout</h1>
          <div className="section-subtitle">Track your weekly training</div>
        </div>
        {!editMode && (
          <button className="btn btn-ghost" onClick={startEdit}>✎ Edit</button>
        )}
      </div>

      <div className="day-tabs">
        {DAYS.map(d => (
          <button
            key={d}
            className={`day-tab ${activeDay === d ? 'active' : ''}`}
            onClick={() => { setActiveDay(d); setEditMode(false); setDraft([]); }}
          >
            <span className="day-short">{d.slice(0, 3)}</span>
            <span className="day-dot" style={{ opacity: workouts[d]?.length ? 1 : 0.2 }}>●</span>
          </button>
        ))}
      </div>

      {editMode ? (
        <div className="edit-panel card">
          <div className="edit-header">
            <span>Editing {activeDay}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEdit}>Save</button>
            </div>
          </div>

          <div className="exercise-grid-header">
            <span>Exercise</span><span>Sets</span><span>Reps</span><span>Weight (kg)</span><span></span>
          </div>

          {draft.map(ex => (
            <div key={ex.id} className="exercise-edit-row">
              <input className="input-field" placeholder="e.g. Bench Press" value={ex.name}
                onChange={e => updateExercise(ex.id, 'name', e.target.value)} />
              <input className="input-field" placeholder="4" value={ex.sets}
                onChange={e => updateExercise(ex.id, 'sets', e.target.value)} />
              <input className="input-field" placeholder="10" value={ex.reps}
                onChange={e => updateExercise(ex.id, 'reps', e.target.value)} />
              <input className="input-field" placeholder="80" value={ex.weight}
                onChange={e => updateExercise(ex.id, 'weight', e.target.value)} />
              <button className="btn btn-danger" onClick={() => removeExercise(ex.id)}>✕</button>
            </div>
          ))}

          <button className="btn btn-ghost" style={{ marginTop: 12, width: '100%' }} onClick={addExercise}>
            + Add Exercise
          </button>
        </div>
      ) : (
        <div>
          {exercises.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◈</div>
              <div>No workout for {activeDay}.</div>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={startEdit}>Add Workout</button>
            </div>
          ) : (
            <div className="exercise-list">
              {exercises.map((ex, i) => (
                <div key={ex.id} className="exercise-card fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="exercise-name">{ex.name}</div>
                  <div className="exercise-stats">
                    {ex.sets && <div className="stat-chip"><span className="stat-val">{ex.sets}</span><span className="stat-lbl">sets</span></div>}
                    {ex.reps && <div className="stat-chip"><span className="stat-val">{ex.reps}</span><span className="stat-lbl">reps</span></div>}
                    {ex.weight && <div className="stat-chip"><span className="stat-val">{ex.weight}</span><span className="stat-lbl">kg</span></div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
