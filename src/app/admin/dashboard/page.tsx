'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Client } from '@/types';
import { formatDate, creditsRemaining } from '@/lib/utils';

type ModalMode = 'create' | 'edit' | null;

function ClientModal({
  mode,
  client,
  onClose,
  onSave,
}: {
  mode: ModalMode;
  client: Client | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    name: client?.name ?? '',
    telegram: client?.telegram ?? '',
    credits_total: client?.credits_total ?? 3,
    comment: client?.comment ?? '',
    status: client?.status ?? 'active',
  });
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (mode === 'create') {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        const origin = window.location.origin;
        setLink(`${origin}/client/${data.token}`);
      }
    } else if (client) {
      await fetch(`/api/admin/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      onSave();
      onClose();
    }
    setLoading(false);
  }

  function copyLink() {
    navigator.clipboard.writeText(link);
  }

  if (link) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="w-full max-w-md rounded-2xl p-8 animate-scale-in"
          style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-white mb-1">Client Created!</h3>
            <p className="text-sm" style={{ color: '#888899' }}>Share this link with your client</p>
          </div>
          <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs break-all" style={{ color: '#a78bfa', fontFamily: 'monospace' }}>{link}</p>
          </div>
          <button onClick={copyLink}
            className="w-full py-3 rounded-xl text-sm font-semibold mb-3 transition-all"
            style={{ background: 'linear-gradient(135deg, #ec4899, #a78bfa)', color: '#fff' }}>
            Copy Link
          </button>
          <button onClick={() => { onSave(); onClose(); }}
            className="w-full py-3 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#888899', border: '1px solid rgba(255,255,255,0.08)' }}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl p-8 animate-scale-in"
        style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">
            {mode === 'create' ? 'New Client' : 'Edit Client'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
            style={{ color: '#888899', minHeight: 'auto', minWidth: 'auto' }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Name', key: 'name', type: 'text', placeholder: 'Artem', required: true },
            { label: 'Telegram', key: 'telegram', type: 'text', placeholder: '@username' },
            { label: 'Comment', key: 'comment', type: 'text', placeholder: 'Any notes...' },
          ].map(({ label, key, type, placeholder, required }) => (
            <div key={key}>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-widest" style={{ color: '#888899' }}>{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form] as string}
                onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                required={required}
                className="w-full px-4 py-2.5 rounded-xl text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f0f4', outline: 'none' }}
                onFocus={(e) => { e.target.style.border = '1px solid rgba(167,139,250,0.5)'; }}
                onBlur={(e) => { e.target.style.border = '1px solid rgba(255,255,255,0.08)'; }}
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-widest" style={{ color: '#888899' }}>Credits</label>
            <input
              type="number"
              min={0}
              value={form.credits_total}
              onChange={(e) => setForm(f => ({ ...f, credits_total: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-2.5 rounded-xl text-sm transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f0f4', outline: 'none' }}
              onFocus={(e) => { e.target.style.border = '1px solid rgba(167,139,250,0.5)'; }}
              onBlur={(e) => { e.target.style.border = '1px solid rgba(255,255,255,0.08)'; }}
            />
          </div>

          {mode === 'edit' && (
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-widest" style={{ color: '#888899' }}>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm(f => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                className="w-full px-4 py-2.5 rounded-xl text-sm"
                style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f0f4', outline: 'none' }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#888899', border: '1px solid rgba(255,255,255,0.08)' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'linear-gradient(135deg, #ec4899, #a78bfa)', color: '#fff', border: 'none' }}>
              {loading ? 'Saving...' : mode === 'create' ? 'Create Client' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ClientCard({
  client,
  onEdit,
  onDelete,
  onCopyLink,
}: {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
  onCopyLink: () => void;
}) {
  const remaining = creditsRemaining(client.credits_total, client.credits_used);
  const pct = client.credits_total > 0 ? (client.credits_used / client.credits_total) * 100 : 0;

  return (
    <div className="rounded-2xl p-5 transition-all duration-200 group hover:-translate-y-0.5"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
      }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(167,139,250,0.2))', border: '1px solid rgba(236,72,153,0.2)' }}>
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm leading-tight">{client.name}</h3>
            {client.telegram && (
              <p className="text-xs mt-0.5" style={{ color: '#60a5fa' }}>{client.telegram}</p>
            )}
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{
            background: client.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(107,114,128,0.15)',
            color: client.status === 'active' ? '#34d399' : '#6b7280',
            border: `1px solid ${client.status === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(107,114,128,0.2)'}`,
          }}>
          {client.status}
        </span>
      </div>

      {/* Credits */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span style={{ color: '#888899' }}>Credits</span>
          <span className="font-semibold" style={{ color: remaining === 0 ? '#ef4444' : '#f0f0f4' }}>
            {remaining} / {client.credits_total} remaining
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: pct >= 100 ? '#ef4444' : 'linear-gradient(90deg, #ec4899, #a78bfa)',
            }} />
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs mb-0.5" style={{ color: '#888899' }}>Used</p>
          <p className="text-sm font-semibold text-white">{client.credits_used}</p>
        </div>
        <div className="rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs mb-0.5" style={{ color: '#888899' }}>Joined</p>
          <p className="text-sm font-semibold text-white">{formatDate(client.created_at)}</p>
        </div>
      </div>

      {client.comment && (
        <p className="text-xs rounded-lg px-3 py-2 mb-4 italic" style={{ color: '#888899', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          "{client.comment}"
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={onCopyLink}
          className="flex-1 py-2 rounded-xl text-xs font-medium transition-all hover:bg-white/10"
          style={{ background: 'rgba(255,255,255,0.05)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}>
          Copy Link
        </button>
        <button onClick={onEdit}
          className="flex-1 py-2 rounded-xl text-xs font-medium transition-all hover:bg-white/10"
          style={{ background: 'rgba(255,255,255,0.05)', color: '#f0f0f4', border: '1px solid rgba(255,255,255,0.08)' }}>
          Edit
        </button>
        <button onClick={onDelete}
          className="py-2 px-3 rounded-xl text-xs font-medium transition-all hover:bg-red-500/20"
          style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', minWidth: 'auto', minHeight: 'auto' }}>
          ✕
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState('');
  const [apiError, setApiError] = useState('');
  const router = useRouter();

  const fetchClients = useCallback(async () => {
    try {
      setApiError('');
      const res = await fetch('/api/admin/clients');
      if (res.status === 401 || res.status === 403) {
        router.push('/admin');
        return;
      }
      
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        let errMsg = `Request failed (status ${res.status})`;
        try {
          const errData = await res.json();
          errMsg = errData.error || errMsg;
        } catch {
          // Response was not JSON
        }
        throw new Error(errMsg);
      }

      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setApiError(err.message || 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchClients(); }, [fetchClients]);


  async function handleDelete(client: Client) {
    await fetch(`/api/admin/clients/${client.id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    fetchClients();
  }

  function copyClientLink(client: Client) {
    const link = `${window.location.origin}/client/${client.token}`;
    navigator.clipboard.writeText(link);
    setCopied(client.id);
    setTimeout(() => setCopied(''), 2000);
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin');
  }

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.telegram ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const totalCredits = clients.reduce((s, c) => s + c.credits_total, 0);
  const usedCredits = clients.reduce((s, c) => s + c.credits_used, 0);
  const activeClients = clients.filter(c => c.status === 'active').length;

  return (
    <div className="min-h-screen" style={{ background: '#080810' }}>
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-8 blur-3xl"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }} />
      </div>

      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b"
        style={{ background: 'rgba(8,8,16,0.8)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">💌</span>
            <span className="font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>LoveFlow</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}>
              Admin
            </span>
          </div>
          <button onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded-lg transition-all hover:bg-white/10"
            style={{ color: '#888899', minHeight: 'auto', minWidth: 'auto' }}>
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 relative">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Clients', value: clients.length, icon: '👥' },
            { label: 'Active Clients', value: activeClients, icon: '✅' },
            { label: 'Invitations Used', value: usedCredits, icon: '💌' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{icon}</span>
                <span className="text-xs" style={{ color: '#888899' }}>{label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex-1 max-w-xs relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f0f4', outline: 'none' }}
              onFocus={(e) => { e.target.style.border = '1px solid rgba(167,139,250,0.4)'; }}
              onBlur={(e) => { e.target.style.border = '1px solid rgba(255,255,255,0.08)'; }}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#888899' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={() => { setSelectedClient(null); setModalMode('create'); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #ec4899, #a78bfa)', color: '#fff', boxShadow: '0 4px 16px rgba(236,72,153,0.3)', minHeight: 'auto' }}>
            <span>+</span>
            New Client
          </button>
        </div>

        {/* Clients grid */}
        {apiError ? (
          <div className="glass p-8 rounded-2xl border-red-500/20 text-center space-y-4 max-w-lg mx-auto my-12 animate-scale-in">
            <div className="text-4xl text-red-500">⚠️</div>
            <h3 className="text-lg font-bold text-red-400">Database Connection Error</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {apiError}
            </p>
            <div className="text-xs text-left bg-black/40 p-4 rounded-xl font-mono text-gray-500 space-y-2 border border-white/5">
              <p className="font-semibold text-gray-300">Possible fixes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Make sure your Supabase keys in <code className="text-pink-400">.env.local</code> are correct.</li>
                <li>Make sure you ran the SQL tables schema script in your Supabase SQL editor.</li>
                <li>Verify your network connectivity to your Supabase project.</li>
              </ul>
            </div>
            <button
              onClick={fetchClients}
              className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold hover:bg-white/10 transition-all"
              style={{ minHeight: 'auto' }}
            >
              Retry Connection
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-56 rounded-2xl animate-pulse"
                style={{ background: 'rgba(255,255,255,0.03)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">{search ? '🔍' : '👥'}</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {search ? 'No clients found' : 'No clients yet'}
            </h3>
            <p className="text-sm" style={{ color: '#888899' }}>
              {search ? 'Try a different search term' : 'Create your first client to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(client => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={() => { setSelectedClient(client); setModalMode('edit'); }}
                onDelete={() => setDeleteTarget(client)}
                onCopyLink={() => copyClientLink(client)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {modalMode && (
        <ClientModal
          mode={modalMode}
          client={selectedClient}
          onClose={() => { setModalMode(null); setSelectedClient(null); }}
          onSave={fetchClients}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl p-6 animate-scale-in"
            style={{ background: '#111118', border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-lg font-bold text-white mb-1">Delete Client?</h3>
              <p className="text-sm" style={{ color: '#888899' }}>
                <strong className="text-white">{deleteTarget.name}</strong> and all their invitations will be permanently deleted.
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

      {/* Copied toast */}
      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-sm font-medium animate-fade-in-up"
          style={{ background: 'rgba(16,185,129,0.9)', color: '#fff', backdropFilter: 'blur(10px)' }}>
          ✓ Link copied!
        </div>
      )}
    </div>
  );
}
