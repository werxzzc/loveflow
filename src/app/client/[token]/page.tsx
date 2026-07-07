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

  return (
    <div className="rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 group"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
      }}>
      {/* Theme accent line */}
      <div className="h-0.5 -mt-5 -mx-5 mb-5 rounded-t-2xl" style={{ background: theme.colors.primary }} />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{theme.emoji}</span>
          <div>
            <h3 className="font-semibold text-white text-sm">{invitation.girl_name}</h3>
            <p className="text-xs" style={{ color: '#888899' }}>{theme.name} theme</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ background: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}` }}>
          {invitation.status}
        </span>
      </div>

      {/* Title */}
      {invitation.title && (
        <p className="text-xs mb-3 line-clamp-1" style={{ color: '#888899', fontStyle: 'italic' }}>
          "{invitation.title}"
        </p>
      )}

      {/* Dates */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-xs" style={{ color: '#888899' }}>Created</p>
          <p className="text-xs font-medium text-white">{formatDate(invitation.created_at)}</p>
        </div>
        <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-xs" style={{ color: '#888899' }}>Questions</p>
          <p className="text-xs font-medium text-white">{invitation.questions?.length ?? 0}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/editor/${invitation.id}?client=${clientToken}`)}
            className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{ background: `${theme.colors.primary}22`, color: theme.colors.primary, border: `1px solid ${theme.colors.primary}44` }}>
            Open Editor
          </button>
          <button
            onClick={copyInviteLink}
            className="flex-1 py-2 rounded-xl text-xs font-medium transition-all hover:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.05)', color: copied === 'invite' ? '#34d399' : '#f0f0f4', border: '1px solid rgba(255,255,255,0.08)' }}>
            {copied === 'invite' ? '✓ Copied!' : 'Copy Link'}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onDuplicate}
            className="flex-1 py-1.5 rounded-xl text-xs font-medium transition-all hover:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.03)', color: '#888899', border: '1px solid rgba(255,255,255,0.06)' }}>
            Duplicate
          </button>
          <button
            onClick={onDelete}
            className="flex-1 py-1.5 rounded-xl text-xs font-medium transition-all hover:bg-red-500/20"
            style={{ background: 'rgba(239,68,68,0.06)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)' }}>
            Delete
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
        girl_name: 'My Love',
        title: 'Will You Go Out With Me?',
        theme: 'sakura',
        questions: [],
      }),
    });
    const inv = await res.json();
    setCreating(false);
    if (res.ok) {
      router.push(`/editor/${inv.id}?client=${token}`);
    } else {
      alert(inv.error || 'Failed to create invitation');
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
    if (remaining <= 0) { alert('No credits remaining.'); return; }

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080810' }}>
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">💌</div>
          <p className="text-sm" style={{ color: '#888899' }}>Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (notFound || !client) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080810' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-sm" style={{ color: '#888899' }}>This link is invalid or expired.</p>
        </div>
      </div>
    );
  }

  const remaining = creditsRemaining(client.credits_total, client.credits_used);
  const pct = client.credits_total > 0 ? (client.credits_used / client.credits_total) * 100 : 0;

  return (
    <div className="min-h-screen" style={{ background: '#080810' }}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-8 blur-3xl"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-6 blur-3xl"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b"
        style={{ background: 'rgba(8,8,16,0.85)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <span className="text-xl">💌</span>
          <span className="font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>LoveFlow</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 relative">
        {/* Welcome + Credits */}
        <div className="rounded-2xl p-6 mb-8 animate-fade-in-up"
          style={{
            background: 'linear-gradient(135deg, rgba(236,72,153,0.08), rgba(167,139,250,0.08))',
            border: '1px solid rgba(236,72,153,0.15)',
          }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm mb-1" style={{ color: '#888899' }}>Welcome back,</p>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                {client.name} 👋
              </h1>
            </div>
            <div className="text-right">
              <p className="text-xs mb-1" style={{ color: '#888899' }}>Invitation Credits</p>
              <p className="text-3xl font-bold" style={{
                background: remaining === 0 ? 'none' : 'linear-gradient(135deg, #ec4899, #a78bfa)',
                WebkitBackgroundClip: remaining === 0 ? 'none' : 'text',
                WebkitTextFillColor: remaining === 0 ? '#ef4444' : 'transparent',
                color: remaining === 0 ? '#ef4444' : undefined,
              }}>
                {remaining} <span className="text-sm font-normal" style={{ color: '#888899', WebkitTextFillColor: '#888899' }}>/ {client.credits_total}</span>
              </p>
              <div className="h-1.5 w-32 rounded-full mt-2 ml-auto overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full" style={{
                  width: `${pct}%`,
                  background: pct >= 100 ? '#ef4444' : 'linear-gradient(90deg, #ec4899, #a78bfa)',
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Create button */}
        <div className="mb-8">
          <button
            onClick={handleCreate}
            disabled={creating || remaining === 0}
            className="w-full py-4 rounded-2xl text-base font-semibold transition-all duration-200 relative overflow-hidden group"
            style={{
              background: remaining === 0
                ? 'rgba(255,255,255,0.04)'
                : 'linear-gradient(135deg, #ec4899, #a855f7)',
              color: remaining === 0 ? '#555' : '#fff',
              boxShadow: remaining > 0 ? '0 8px 32px rgba(236,72,153,0.35)' : 'none',
              border: remaining === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              cursor: remaining === 0 || creating ? 'not-allowed' : 'pointer',
            }}>
            <span className="relative z-10 flex items-center justify-center gap-2">
              {creating ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating...
                </>
              ) : remaining === 0 ? (
                '🔒 No Credits Remaining'
              ) : (
                <>✨ Create New Invitation</>
              )}
            </span>
          </button>
        </div>

        {/* Invitations */}
        <div>
          <h2 className="text-sm font-semibold mb-4 uppercase tracking-widest" style={{ color: '#888899' }}>
            Your Invitations ({invitations.length})
          </h2>

          {invitations.length === 0 ? (
            <div className="text-center py-16 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
              <div className="text-5xl mb-4">💌</div>
              <h3 className="text-lg font-semibold text-white mb-2">No invitations yet</h3>
              <p className="text-sm" style={{ color: '#888899' }}>Create your first invitation to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>
      </main>

      {/* Delete modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl p-6 animate-scale-in"
            style={{ background: '#111118', border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="text-lg font-bold text-white mb-1">Delete Invitation?</h3>
              <p className="text-sm" style={{ color: '#888899' }}>
                Invitation for <strong className="text-white">{deleteTarget.girl_name}</strong> will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#888899', border: '1px solid rgba(255,255,255,0.08)' }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteTarget)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(239,68,68,0.9)', color: '#fff' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
