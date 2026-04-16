'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import AuthForm from '@/components/AuthForm';
import '../login/login.css';

export default function SignupPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async ({ email, password, fullName }) => {
    setLoading(true);
    setError('');

    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (authError) {
        setError(authError.message);
      } else {
        router.push('/auth/login?registered=true');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow"></div>
      <AuthForm mode="signup" onSubmit={handleSignup} error={error} loading={loading} />
      <p className="auth-switch">
        Already have an account?{' '}
        <Link href="/auth/login">Sign in</Link>
      </p>
    </div>
  );
}
