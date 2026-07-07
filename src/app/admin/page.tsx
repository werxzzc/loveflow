'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin/dashboard');
    } else {
      setError('Неверный пароль. Попробуйте еще раз.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#080810]">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }}
        />
      </div>

      {/* Login card */}
      <div className="relative w-full max-w-sm mx-4 animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 relative"
            style={{
              background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(167,139,250,0.2))',
              border: '1px solid rgba(236,72,153,0.3)',
            }}
          >
            <span className="text-3xl">💌</span>
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{
              fontFamily: 'var(--font-playfair)',
              background: 'linear-gradient(135deg, #f9a8d4, #c4b5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            LoveFlow
          </h1>
          <p className="text-sm" style={{ color: '#888899' }}>
            Панель управления
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#888899', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль администратора"
                autoFocus
                required
                className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: error ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.08)',
                  color: '#f0f0f4',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid rgba(167,139,250,0.5)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(167,139,250,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.border = error ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.08)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {error && (
                <p className="mt-2 text-xs text-red-400 animate-fade-in">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden"
              style={{
                background: loading || !password
                  ? 'rgba(255,255,255,0.06)'
                  : 'linear-gradient(135deg, #ec4899, #a78bfa)',
                color: loading || !password ? '#555' : '#fff',
                border: 'none',
                cursor: loading || !password ? 'not-allowed' : 'pointer',
                boxShadow: !loading && password ? '0 8px 24px rgba(236,72,153,0.3)' : 'none',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Вход...
                </span>
              ) : (
                'Войти'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.2)' }}>
          LoveFlow Admin · Ограниченный доступ
        </p>
      </div>
    </div>
  );
}
