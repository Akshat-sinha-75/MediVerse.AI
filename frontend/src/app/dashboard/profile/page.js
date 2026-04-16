'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import './profile.css';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    phone: '',
    blood_group: '',
    height_cm: '',
    weight_kg: '',
    allergies: '',
    chronic_conditions: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!error && data) {
      setProfile({
        full_name: data.full_name || '',
        date_of_birth: data.date_of_birth || '',
        gender: data.gender || '',
        phone: data.phone || '',
        blood_group: data.blood_group || '',
        height_cm: data.height_cm || '',
        weight_kg: data.weight_kg || '',
        allergies: data.allergies || '',
        chronic_conditions: data.chronic_conditions || '',
        emergency_contact_name: data.emergency_contact_name || '',
        emergency_contact_phone: data.emergency_contact_phone || '',
      });
    }
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Convert empty strings to null for postgres constraints
    const payload = {
      full_name: profile.full_name || null,
      date_of_birth: profile.date_of_birth || null,
      gender: profile.gender || null,
      phone: profile.phone || null,
      blood_group: profile.blood_group || null,
      height_cm: profile.height_cm ? Number(profile.height_cm) : null,
      weight_kg: profile.weight_kg ? Number(profile.weight_kg) : null,
      allergies: profile.allergies || null,
      chronic_conditions: profile.chronic_conditions || null,
      emergency_contact_name: profile.emergency_contact_name || null,
      emergency_contact_phone: profile.emergency_contact_phone || null,
      profile_completed: true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', session.user.id);

    if (error) {
      console.error('Supabase profile save error:', error);
      setMessage({ type: 'error', text: `Failed: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    }
    setSaving(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const bmi = profile.height_cm && profile.weight_kg
    ? (Number(profile.weight_kg) / Math.pow(Number(profile.height_cm) / 100, 2)).toFixed(1)
    : null;

  if (loading) {
    return (
      <div className="empty-state">
        <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <p className="page-subtitle">Setup your health profile for personalized AI support.</p>

      {message.text && (
        <div className={`profile-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="profile-form" id="profile-form">
        {/* Personal Info */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2 16c0-3 3-5.5 7-5.5s7 2.5 7 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Personal Information
          </h3>
          <div className="profile-grid">
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className="auth-field">
              <label>Date of Birth</label>
              <input
                type="date"
                value={profile.date_of_birth}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
              />
            </div>
            <div className="auth-field">
              <label>Gender</label>
              <select
                value={profile.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="profile-select"
              >
                <option value="">Select gender</option>
                {GENDERS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            <div className="auth-field">
              <label>Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 XXXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Body Vitals */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2l2 4h4l-3.2 2.5 1.2 4.5L9 10.5 4.8 13l1.2-4.5L3 6h4l2-4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
            Body Vitals
          </h3>
          <div className="profile-grid">
            <div className="auth-field">
              <label>Blood Group</label>
              <select
                value={profile.blood_group}
                onChange={(e) => handleChange('blood_group', e.target.value)}
                className="profile-select"
              >
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div className="auth-field">
              <label>Height (cm)</label>
              <input
                type="number"
                value={profile.height_cm}
                onChange={(e) => handleChange('height_cm', e.target.value)}
                placeholder="e.g., 170"
              />
            </div>
            <div className="auth-field">
              <label>Weight (kg)</label>
              <input
                type="number"
                value={profile.weight_kg}
                onChange={(e) => handleChange('weight_kg', e.target.value)}
                placeholder="e.g., 65"
              />
            </div>
            {bmi && (
              <div className="bmi-card glass-card">
                <div className="bmi-value">{bmi}</div>
                <div className="bmi-label">BMI</div>
                <div className={`bmi-status ${
                  bmi < 18.5 ? 'underweight' : bmi < 25 ? 'normal' : bmi < 30 ? 'overweight' : 'obese'
                }`}>
                  {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Medical Info */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 3h8l3 3v9a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.3" />
              <path d="M11 3v3h3" stroke="currentColor" strokeWidth="1.3" />
              <path d="M6 10h4M8 8v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            Medical Information
          </h3>
          <div className="profile-grid">
            <div className="auth-field full-width">
              <label>Known Allergies</label>
              <input
                type="text"
                value={profile.allergies}
                onChange={(e) => handleChange('allergies', e.target.value)}
                placeholder="e.g., Penicillin, Peanuts, Dust"
              />
            </div>
            <div className="auth-field full-width">
              <label>Chronic Conditions</label>
              <input
                type="text"
                value={profile.chronic_conditions}
                onChange={(e) => handleChange('chronic_conditions', e.target.value)}
                placeholder="e.g., Diabetes, Asthma, Hypertension"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="profile-section">
          <h3 className="profile-section-title">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 3h4l2 3-2.5 2.5a11 11 0 005 5L13 11l3 2v4a1 1 0 01-1 1A15 15 0 011 4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
            Emergency Contact
          </h3>
          <div className="profile-grid">
            <div className="auth-field">
              <label>Contact Name</label>
              <input
                type="text"
                value={profile.emergency_contact_name}
                onChange={(e) => handleChange('emergency_contact_name', e.target.value)}
                placeholder="Emergency contact name"
              />
            </div>
            <div className="auth-field">
              <label>Contact Phone</label>
              <input
                type="tel"
                value={profile.emergency_contact_phone}
                onChange={(e) => handleChange('emergency_contact_phone', e.target.value)}
                placeholder="+91 XXXXXXXXXX"
              />
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button type="submit" className="btn-primary" disabled={saving} id="save-profile-btn">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
