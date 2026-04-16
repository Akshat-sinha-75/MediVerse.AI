'use client';

import { useState } from 'react';
import './AuthForm.css';

export default function AuthForm({ mode, onSubmit, error, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'signup' && password !== confirmPassword) {
      return;
    }
    onSubmit({ email, password, fullName });
  };

  return (
    <form className="auth-form glass-card" onSubmit={handleSubmit} id={`${mode}-form`}>
      <div className="auth-form-header">
        <div className="auth-logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="16" stroke="url(#authGrad)" strokeWidth="2" />
            <path d="M12 18h12M18 12v12" stroke="url(#authGrad)" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="authGrad" x1="0" y1="0" x2="36" y2="36">
                <stop stopColor="#7C3AED" />
                <stop offset="1" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h2 className="auth-title">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="auth-subtitle">
          {mode === 'login'
            ? 'Sign in to access your health dashboard'
            : 'Join MediVerse.AI for personalized health support'}
        </p>
      </div>

      {error && <div className="auth-error">{error}</div>}

      {mode === 'signup' && (
        <div className="auth-field">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
      )}

      <div className="auth-field">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="auth-field">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
        />
      </div>

      {mode === 'signup' && (
        <div className="auth-field">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />
          {password && confirmPassword && password !== confirmPassword && (
            <span className="field-error">Passwords do not match</span>
          )}
        </div>
      )}

      <button type="submit" className="btn-primary auth-submit" disabled={loading}>
        {loading ? (
          <span className="auth-spinner"></span>
        ) : mode === 'login' ? (
          'Sign In'
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
}
