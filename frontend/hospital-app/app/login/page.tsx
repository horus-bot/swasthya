'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../lib/api/supabase';

export default function LoginPage() {
  const [hospitalId, setHospitalId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    const authStatus = localStorage.getItem('hospital_auth');
    if (authStatus === 'true') {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Bypass validation: allow any input to log in for local/dev convenience.
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hospital_auth', 'true');
        localStorage.setItem('hospital_id', hospitalId || 'local-hospital');
        localStorage.setItem('hospital_name', hospitalId ? hospitalId : 'Local Hospital');
        localStorage.setItem('login_time', new Date().toISOString());
      }
      router.push('/dashboard');
      return;
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-teal-600 to-teal-400 rounded-xl p-3 shadow-md">
            <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
              <span className="text-teal-600 font-bold text-xl">S</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Hospital Login</h1>
          <p className="text-gray-600">
            Hospital Access Portal
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hospital ID
            </label>
            <input
              type="text"
              value={hospitalId}
              onChange={(e) => setHospitalId(e.target.value)}
              placeholder="HOSP-WARD-123456789"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              
              disabled={loading}
              autoComplete="current-password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Login to Dashboard'
            )}
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have a Hospital ID?{' '}
            <Link href="/signup" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">
              Register Hospital
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            For authorized hospitals only
          </p>
        </div>
      </div>
    </div>
  );
}
