'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function DashboardHome() {
  const [stats, setStats] = useState({ records: 0, medications: 0, chats: 0 });
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const user = session.user;
      setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');

      // Fetch counts
      const [recordsRes, medsRes, chatsRes] = await Promise.all([
        supabase.from('medical_records').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('medications').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('chat_history').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);

      setStats({
        records: recordsRes.count || 0,
        medications: medsRes.count || 0,
        chats: chatsRes.count || 0,
      });
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="dash-home-header">
        <h1>Welcome back, {userName} 👋</h1>
        <p>Here&apos;s an overview of your health dashboard.</p>
      </div>

      <div className="dash-stats">
        <div className="dash-stat-card glass-card">
          <div className="stat-icon purple">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M4 3h10l4 4v12a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M14 3v4h4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="stat-number">{stats.records}</div>
          <div className="stat-label">Medical Records</div>
        </div>

        <div className="dash-stat-card glass-card">
          <div className="stat-icon blue">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="5" y="2" width="12" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
              <line x1="5" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="stat-number">{stats.medications}</div>
          <div className="stat-label">Medications</div>
        </div>

        <div className="dash-stat-card glass-card">
          <div className="stat-icon green">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 4h16a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 3V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="stat-number">{stats.chats}</div>
          <div className="stat-label">Chat Messages</div>
        </div>
      </div>

      <div className="section-header">
        <h2>Quick Actions</h2>
      </div>
      <div className="dash-stats">
        <Link href="/dashboard/medical-records" className="dash-stat-card glass-card" style={{ textDecoration: 'none' }}>
          <div className="stat-icon purple">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 5v12M5 11h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="stat-label" style={{ fontWeight: 600, color: 'var(--color-text)' }}>Upload Records</div>
        </Link>

        <Link href="/dashboard/medications" className="dash-stat-card glass-card" style={{ textDecoration: 'none' }}>
          <div className="stat-icon blue">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 5v12M5 11h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="stat-label" style={{ fontWeight: 600, color: 'var(--color-text)' }}>Add Medication</div>
        </Link>

        <Link href="/dashboard/chatbot" className="dash-stat-card glass-card" style={{ textDecoration: 'none' }}>
          <div className="stat-icon green">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 4h16a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 3V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8" cy="10" r="1" fill="currentColor" />
              <circle cx="11" cy="10" r="1" fill="currentColor" />
              <circle cx="14" cy="10" r="1" fill="currentColor" />
            </svg>
          </div>
          <div className="stat-label" style={{ fontWeight: 600, color: 'var(--color-text)' }}>Ask AI Chatbot</div>
        </Link>
      </div>
    </div>
  );
}
