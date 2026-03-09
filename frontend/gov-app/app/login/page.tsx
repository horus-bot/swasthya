'use client';
  // Allow any input to log in immediately (developer convenience).
  // Disable native form validation and bypass server checks so any credentials work.
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gov_auth', 'true');
      localStorage.setItem('gov_username', username || 'local-user');
      localStorage.setItem('login_time', new Date().toISOString());
    }
    router.push('/dashboard');
    return;
  } catch (err: any) {
    console.error('Login error:', err);
    setError(err?.message || 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }

      // Dev / mock fallback: when backend isn't configured or we're running locally,
      // allow a seamless login so developers don't get blocked by missing server config.
      const isDev = process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serverNotConfigured = body?.error === 'Server not configured' || res.status === 500;
      if (isDev || serverNotConfigured) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('gov_auth', 'true');
          localStorage.setItem('gov_username', username);
          localStorage.setItem('login_time', new Date().toISOString());
        }
        router.push('/dashboard');
        return;
      }

      // Otherwise show the server error message
      setError(body?.error || 'Login failed');
      setLoading(false);
      return;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 px-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl p-3 shadow-lg">
              <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                <svg 
                  className="w-10 h-10 text-blue-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Government Portal
            </h1>
            <p className="text-gray-500">
              Healthcare Administration & Monitoring
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6" noValidate>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username / Official ID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                
                disabled={loading}
                autoComplete="username"
                suppressHydrationWarning
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                
                disabled={loading}
                autoComplete="current-password"
                minLength={6}
                suppressHydrationWarning
              />
            </div>


            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-md'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-gray-600">
              Need access?{' '}
              <Link href="/request-access" className="text-blue-600 hover:text-blue-700 font-medium">
                Request credentials
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Secure government healthcare monitoring platform
          </p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
            <span>•</span>
            <Link href="/support" className="hover:text-gray-600">Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
