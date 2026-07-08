'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { Client, Invitation } from '@/types';
import { getTheme } from '@/lib/themes';
import { formatDate, creditsRemaining } from '@/lib/utils';

function InvitationCard({
  invitation,
  clientToken,
  onDelete,
  onDuplicate,
}: {
  invitation: Invitation;
  clientToken: string;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const [copied, setCopied] = useState('');
  const theme = getTheme(invitation.theme);
  const router = useRouter();

  function copyInviteLink() {
    const link = `${window.location.origin}/invite/${invitation.token}`;
    navigator.clipboard.writeText(link);
    setCopied('invite');
    setTimeout(() => setCopied(''), 2000);
  }

  const statusColor = {
    draft: { bg: 'rgba(107,114,128,0.15)', text: '#9ca3af', border: 'rgba(107,114,128,0.2)' },
    pending: { bg: 'rgba(251,191,36,0.12)', text: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
    completed: { bg: 'rgba(16,185,129,0.12)', text: '#34d399', border: 'rgba(16,185,129,0.2)' },
  }[invitation.status];

  const statusText = {
    draft: 'Черновик',
    pending: 'Ожидает ответа',
    completed: 'Завершено',
  }[invitation.status];

  return (
    <div className="rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:scale-[1.01] active-tap"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
      }}>
      {/* Theme Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 animate-float"
            style={{ background: `${theme.colors.primary}22`, border: `1px solid ${theme.colors.primary}33` }}>
            {theme.emoji}
          </div>
          <div>
            <h3 className="font-bold text-white text-base leading-tight">{invitation.girl_name}</h3>
            <span className="text-xs font-semibold" style={{ color: theme.colors.primaryLight }}>Тема: {theme.name}</span>
          </div>
        </div>
        <span className="text-[11px] px-3 py-1 rounded-full font-bold"
          style={{ background: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}` }}>
          {statusText}
        </span>
      </div>

      {/* Invitation Info */}
      <div className="space-y-2.5 mb-5">
        {invitation.title && (
          <div className="p-3.5 rounded-2xl bg-white/2 border border-white/5">
            <p className="text-[9px] uppercase tracking-wider font-bold mb-0.5 text-gray-500">Заголовок свидания</p>
            <p className="text-xs font-medium text-white/95 line-clamp-2">«{invitation.title}»</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl p-3 bg-white/2 border border-white/5">
            <p className="text-[9px] uppercase tracking-wider font-bold mb-0.5 text-gray-500">Создано</p>
            <p className="text-[11px] font-bold text-white/90">{formatDate(invitation.created_at)}</p>
          </div>
          <div className="rounded-2xl p-3 bg-white/2 border border-white/5">
            <p className="text-[9px] uppercase tracking-wider font-bold mb-0.5 text-gray-500">Вопросы</p>
            <p className="text-[11px] font-bold text-white/90">{invitation.questions?.length ?? 0} шт.</p>
          </div>
        </div>
      </div>

      {/* Actions stacked vertically on mobile */}
      <div className="flex flex-col gap-2">
        {invitation.status === 'completed' && invitation.result_token && (
          <button
            onClick={() => router.push(`/results/${invitation.result_token}`)}
            className="w-full py-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer hover:opacity-90 active-tap"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
              color: '#ffffff',
            }}
          >
            💬 Просмотреть ответы
          </button>
        )}
        
        <button
          onClick={() => router.push(`/editor/${invitation.id}?client=${clientToken}`)}
          className="w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer hover:bg-white/5 active-tap"
          style={{ background: 'rgba(255,255,255,0.03)', color: '#f0f0f4', borderColor: 'rgba(255,255,255,0.1)' }}>
          ✏️ Редактировать опрос
        </button>

        <button
          onClick={copyInviteLink}
          className="w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer hover:bg-white/5 active-tap"
          style={{
            background: copied === 'invite' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)',
            color: copied === 'invite' ? '#34d399' : '#f0f0f4',
            borderColor: copied === 'invite' ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'
          }}>
          {copied === 'invite' ? '✓ Ссылка скопирована' : '🔗 Скопировать ссылку'}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onDuplicate}
            className="py-2.5 rounded-xl text-[11px] font-semibold transition-all border cursor-pointer hover:bg-white/5 active-tap"
            style={{ background: 'rgba(255,255,255,0.01)', color: '#a78bfa', borderColor: 'rgba(167,139,250,0.15)' }}>
            📋 Дублировать
          </button>
          <button
            onClick={onDelete}
            className="py-2.5 rounded-xl text-[11px] font-semibold transition-all border cursor-pointer hover:bg-red-500/10 active-tap"
            style={{ background: 'rgba(239,68,68,0.01)', color: '#f87171', borderColor: 'rgba(239,68,68,0.15)' }}>
            🗑️ Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ClientPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [client, setClient] = useState<Client | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Invitation | null>(null);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/clients/${token}`);
    if (res.status === 404) { setNotFound(true); setLoading(false); return; }
    const data = await res.json();
    setClient(data.client);
    setInvitations(data.invitations ?? []);
    setLoading(false);
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleCreate() {
    if (!client) return;
    setCreating(true);
    const res = await fetch(`/api/clients/${token}/invitations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        girl_name: 'Моя любовь',
        title: 'Пойдешь со мной на свидание?',
        theme: 'sakura',
        questions: [],
      }),
    });
    const inv = await res.json();
    setCreating(false);
    if (res.ok) {
      router.push(`/editor/${inv.id}?client=${token}`);
    } else {
      alert(inv.error || 'Не удалось создать приглашение');
    }
  }

  async function handleDelete(invitation: Invitation) {
    await fetch(`/api/clients/${token}/invitations`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitationId: invitation.id }),
    });
    setDeleteTarget(null);
    fetchData();
  }

  async function handleDuplicate(invitation: Invitation) {
    if (!client) return;
    const remaining = creditsRemaining(client.credits_total, client.credits_used);
    if (remaining <= 0) { alert('У вас не осталось кредитов для создания приглашений.'); return; }

    const res = await fetch(`/api/clients/${token}/invitations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        girl_name: invitation.girl_name,
        title: invitation.title,
        subtitle: invitation.subtitle,
        welcome_message: invitation.welcome_message,
        description: invitation.description,
        final_message: invitation.final_message,
        theme: invitation.theme,
        questions: invitation.questions,
        font: invitation.font,
        custom_colors: invitation.custom_colors,
      }),
    });
    if (res.ok) fetchData();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080810] text-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
          <p className="text-sm text-gray-400">Загрузка рабочего пространства...</p>
        </div>
      </div>
    );
  }

  if (notFound || !client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080810] text-white p-4">
        <div className="glass max-w-sm w-full p-8 rounded-2xl text-center space-y-4 border-red-500/20">
          <div className="text-4xl">🔒</div>
          <h2 className="text-lg font-bold text-red-400">Доступ ограничен</h2>
          <p className="text-sm text-gray-400">
            Эта ссылка недействительна или устарела.
          </p>
        </div>
      </div>
    );
  }

  const remaining = creditsRemaining(client.credits_total, client.credits_used);
  const pct = client.credits_total > 0 ? (client.credits_used / client.credits_total) * 100 : 0;

  return (
    <div className="min-h-screen pb-28 md:pb-12" style={{ background: '#080810' }}>
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[320px] h-[320px] rounded-full opacity-[0.05] blur-3xl"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-[0.04] blur-3xl"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b"
        style={{ background: 'rgba(8,8,16,0.85)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💌</span>
            <span className="font-bold text-white text-base tracking-wide" style={{ fontFamily: 'var(--font-playfair)' }}>LoveFlow</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 relative z-10">
        {/* Welcome + Credits Banner */}
        <div className="rounded-3xl p-5 mb-6 animate-fade-in-up"
          style={{
            background: 'linear-gradient(135deg, rgba(236,72,153,0.06), rgba(167,139,250,0.06))',
            border: '1px solid rgba(236,72,153,0.12)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs mb-0.5 text-gray-500">Добро пожаловать,</p>
              <h1 className="text-xl font-bold text-white flex items-center gap-1.5">
                {client.name} <span className="animate-bounce">👋</span>
              </h1>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] uppercase tracking-wider font-bold mb-0.5 text-gray-500">Осталось приглашений</p>
              <p className="text-2xl font-bold" style={{
                background: remaining === 0 ? 'none' : 'linear-gradient(135deg, #ec4899, #a78bfa)',
                WebkitBackgroundClip: remaining === 0 ? 'none' : 'text',
                WebkitTextFillColor: remaining === 0 ? '#ef4444' : 'transparent',
                color: remaining === 0 ? '#ef4444' : undefined,
              }}>
                {remaining} <span className="text-xs font-normal text-gray-500" style={{ WebkitTextFillColor: '#6b7280' }}>/ {client.credits_total}</span>
              </p>
              <div className="h-1.5 w-28 rounded-full mt-1.5 sm:ml-auto overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{
                  width: `${pct}%`,
                  background: pct >= 100 ? '#ef4444' : 'linear-gradient(90deg, #ec4899, #a78bfa)',
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Invitations Title */}
        <h2 className="text-[11px] font-bold mb-4 uppercase tracking-widest text-gray-500">
          Ваши приглашения ({invitations.length})
        </h2>

        {/* List of cards */}
        {invitations.length === 0 ? (
          <div className="text-center py-16 rounded-3xl"
            style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.06)' }}>
            <div className="text-4xl mb-3">💌</div>
            <h3 className="text-sm font-bold text-white mb-1">Приглашений пока нет</h3>
            <p className="text-xs text-gray-500">Создайте своё первое интерактивное приглашение!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {invitations.map(inv => (
              <InvitationCard
                key={inv.id}
                invitation={inv}
                clientToken={token}
                onDelete={() => setDeleteTarget(inv)}
                onDuplicate={() => handleDuplicate(inv)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Bottom Create Panel for Mobile - Always Visible */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#080810]/80 backdrop-blur-lg border-t border-white/5 md:relative md:bg-transparent md:border-none md:p-0 md:max-w-4xl md:mx-auto md:px-4 md:mt-6 z-30">
        <button
          onClick={handleCreate}
          disabled={creating || remaining === 0}
          className="w-full py-3.5 rounded-2xl text-xs font-bold transition-all duration-200 shadow-xl cursor-pointer hover:scale-[1.01] active-tap"
          style={{
            background: remaining === 0
              ? 'rgba(255,255,255,0.03)'
              : 'linear-gradient(135deg, #ec4899, #a855f7)',
            color: remaining === 0 ? '#444455' : '#fff',
            boxShadow: remaining > 0 ? '0 8px 30px rgba(236,72,153,0.3)' : 'none',
            border: remaining === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            cursor: remaining === 0 || creating ? 'not-allowed' : 'pointer',
          }}>
          <span className="flex items-center justify-center gap-1.5">
            {creating ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Создание...
              </>
            ) : remaining === 0 ? (
              '🔒 Лимит приглашений исчерпан'
            ) : (
              <>✨ Создать новое приглашение</>
            )}
          </span>
        </button>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-[24px] p-6 animate-scale-in"
            style={{ background: '#0e0e18', border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 30px 60px rgba(0,0,0,0.8)' }}>
            <div className="text-center mb-5">
              <div className="text-3xl mb-3">🗑️</div>
              <h3 className="text-base font-bold text-white mb-1">Удалить приглашение?</h3>
              <p className="text-xs text-gray-500">
                Приглашение для <strong className="text-white">{deleteTarget.girl_name}</strong> будет удалено навсегда.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold cursor-pointer hover:bg-white/5 active-tap"
                style={{ background: 'rgba(255,255,255,0.03)', color: '#888899', border: '1px solid rgba(255,255,255,0.06)' }}>
                Отмена
              </button>
              <button onClick={() => handleDelete(deleteTarget)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold cursor-pointer hover:opacity-90 active-tap"
                style={{ background: '#ef4444', color: '#fff' }}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
