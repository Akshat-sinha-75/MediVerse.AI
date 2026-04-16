'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function MedicationsPage() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time_of_day: '',
    notes: '',
  });

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (!error && data) setMedications(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.dosage || !form.frequency) return;

    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.from('medications').insert({
      user_id: session.user.id,
      ...form,
    });

    if (!error) {
      setForm({ name: '', dosage: '', frequency: '', time_of_day: '', notes: '' });
      fetchMedications();
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await supabase.from('medications').delete().eq('id', id);
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="medications-page">
      <h1>Medications</h1>
      <p className="page-subtitle">Track your current medications and dosage schedule.</p>

      <form className="med-form" onSubmit={handleSubmit} id="add-medication-form">
        <div className="auth-field">
          <label htmlFor="med-name">Medication Name *</label>
          <input
            type="text"
            id="med-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g., Amoxicillin"
            required
          />
        </div>
        <div className="auth-field">
          <label htmlFor="med-dosage">Dosage *</label>
          <input
            type="text"
            id="med-dosage"
            value={form.dosage}
            onChange={(e) => setForm({ ...form, dosage: e.target.value })}
            placeholder="e.g., 500mg"
            required
          />
        </div>
        <div className="auth-field">
          <label htmlFor="med-frequency">Frequency *</label>
          <input
            type="text"
            id="med-frequency"
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
            placeholder="e.g., Twice daily"
            required
          />
        </div>
        <div className="auth-field">
          <label htmlFor="med-time">Time of Day</label>
          <input
            type="text"
            id="med-time"
            value={form.time_of_day}
            onChange={(e) => setForm({ ...form, time_of_day: e.target.value })}
            placeholder="e.g., Morning & Evening"
          />
        </div>
        <div className="auth-field full-width">
          <label htmlFor="med-notes">Notes</label>
          <input
            type="text"
            id="med-notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Any additional notes..."
          />
        </div>
        <div className="med-form-actions">
          <button type="submit" className="btn-primary" disabled={saving} id="add-med-btn">
            {saving ? 'Adding...' : 'Add Medication'}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="empty-state">
          <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          <p>Loading medications...</p>
        </div>
      ) : medications.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto', display: 'block' }}>
            <rect x="10" y="4" width="28" height="40" rx="10" stroke="currentColor" strokeWidth="2" />
            <line x1="10" y1="24" x2="38" y2="24" stroke="currentColor" strokeWidth="2" />
          </svg>
          <p>No medications added yet. Use the form above to add your first medication.</p>
        </div>
      ) : (
        <div className="med-list">
          {medications.map((med) => (
            <div key={med.id} className="med-card glass-card">
              <div className="med-info">
                <div className="med-pill-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="5" y="2" width="10" height="16" rx="4" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="5" y1="10" x2="15" y2="10" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div>
                  <div className="med-name">{med.name}</div>
                  <div className="med-details">
                    {med.dosage} · {med.frequency}
                    {med.time_of_day && ` · ${med.time_of_day}`}
                  </div>
                </div>
              </div>
              <div className="record-actions">
                <button className="delete" onClick={() => handleDelete(med.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
