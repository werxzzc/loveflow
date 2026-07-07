'use client';

import React, { useState, useEffect, use } from 'react';
import { Result, Theme } from '@/types';
import { getTheme } from '@/lib/themes';
import { formatDateTime, formatDuration } from '@/lib/utils';

export default function ResultsPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [result, setResult] = useState<Result | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`/api/results/${token}`);
        if (!res.ok) {
          throw new Error('Результаты не найдены или неактивны');
        }
        const data = await res.json();
        setResult(data.result);
        setTheme(getTheme(data.invitation.theme));
      } catch (err: any) {
        setError(err.message || 'Что-то пошло не так');
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080810] text-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
          <p className="text-sm text-gray-400">Загрузка ответов...</p>
        </div>
      </div>
    );
  }

  if (error || !result || !theme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080810] text-white p-4">
        <div className="glass max-w-sm w-full p-8 rounded-2xl text-center space-y-4 border-red-500/20">
          <div className="text-4xl">🔒</div>
          <h2 className="text-lg font-bold text-red-400">Результаты недоступны</h2>
          <p className="text-sm text-gray-400">
            Эти результаты больше недоступны или ссылка неверна.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-between items-center p-6 relative overflow-hidden transition-all duration-700"
      style={{
        background: theme.colors.bg,
        backgroundImage: theme.gradient,
        color: theme.colors.text,
        fontFamily: theme.fontStyle === 'romantic' ? 'var(--font-playfair)' : 'var(--font-sans)',
      }}
    >
      {/* Decorative Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[20%] left-[-10%] w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: `radial-gradient(circle, ${theme.colors.primary}, transparent)` }} />
        <div className="absolute bottom-[20%] right-[-10%] w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: `radial-gradient(circle, ${theme.colors.accent}, transparent)` }} />
      </div>

      {/* Header */}
      <div className="w-full max-w-md flex flex-col items-center pt-4 z-10">
        <h1 className="text-xl font-bold tracking-wide opacity-80" style={{ fontFamily: 'var(--font-playfair)' }}>
          LoveFlow
        </h1>
        <p className="text-xs uppercase tracking-widest mt-1 opacity-60">
          Ответы на приглашение
        </p>
      </div>

      {/* Main card panel */}
      <div className="w-full max-w-md flex-1 flex flex-col justify-center my-6 z-10">
        <div className="glass p-6 rounded-3xl space-y-6 animate-scale-in"
             style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
          
          {/* Heart indicator & completion info */}
          <div className="text-center space-y-2 pb-4 border-b border-white/5">
            <div className="text-5xl animate-float">❤️</div>
            <h2 className="text-2xl font-extrabold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
              {result.girl_name || 'София'} ответила!
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-2 font-light">
              <span>📅 {formatDateTime(result.completed_at)}</span>
              <span>⏱️ Время прохождения: {formatDuration(result.time_taken_seconds || 0)}</span>
            </div>
          </div>

          {/* List of answers */}
          <div className="space-y-4">
            {result.answers?.map((ans, idx) => (
              <div
                key={ans.question_id || idx}
                className="p-4 rounded-2xl flex flex-col gap-2 transition-all hover:bg-white/5 border border-white/5"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
              >
                <div className="flex gap-2 items-start">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${theme.colors.primary}20`, color: theme.colors.primaryLight }}>
                    В{idx + 1}
                  </span>
                  <p className="text-sm font-medium text-gray-200">
                    {ans.question_text}
                  </p>
                </div>
                
                <div
                  className="mt-2 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between"
                  style={{
                    backgroundColor: `${ans.answer_color || theme.colors.primary}15`,
                    border: `1px solid ${ans.answer_color || theme.colors.primary}30`,
                    color: '#ffffff',
                  }}
                >
                  <span className="opacity-90">{ans.answer_text}</span>
                  <span className="text-lg">{ans.answer_emoji}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-4 text-xs opacity-40 z-10">
        Премиум-результаты LoveFlow.
      </div>
    </div>
  );
}
