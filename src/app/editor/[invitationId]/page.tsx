'use client';

import { useState, useEffect, useCallback, useRef, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Invitation, Question, Answer, ThemeId } from '@/types';
import { themeList, getTheme } from '@/lib/themes';
import { questionTemplates } from '@/lib/templates';
import { generateId } from '@/lib/utils';

// ─── Answer Row ───────────────────────────────────────────────────────────────
function AnswerRow({
  answer,
  onChange,
  onDelete,
}: {
  answer: Answer;
  onChange: (a: Answer) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-xl group transition-all"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Emoji */}
      <input
        type="text"
        value={answer.emoji}
        onChange={(e) => onChange({ ...answer, emoji: e.target.value.slice(-2) || e.target.value })}
        className="w-8 text-center text-lg bg-transparent border-none outline-none"
        maxLength={2}
      />
      {/* Text */}
      <input
        type="text"
        value={answer.text}
        onChange={(e) => onChange({ ...answer, text: e.target.value })}
        placeholder="Answer text..."
        className="flex-1 text-sm bg-transparent border-none outline-none"
        style={{ color: '#f0f0f4' }}
      />
      {/* Color */}
      <div className="relative">
        <input
          type="color"
          value={answer.color}
          onChange={(e) => onChange({ ...answer, color: e.target.value })}
          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
        />
        <div className="w-6 h-6 rounded-lg border-2 border-white/20 cursor-pointer"
          style={{ background: answer.color }} />
      </div>
      {/* Runaway toggle */}
      <button
        onClick={() => onChange({ ...answer, is_runaway: !answer.is_runaway })}
        className="px-2 py-1 rounded-lg text-xs font-medium transition-all"
        title="Toggle runaway button"
        style={{
          background: answer.is_runaway ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)',
          color: answer.is_runaway ? '#f87171' : '#888899',
          border: `1px solid ${answer.is_runaway ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}`,
          minHeight: 'auto', minWidth: 'auto',
        }}>
        {answer.is_runaway ? '🏃 On' : '🏃 Off'}
      </button>
      {/* Delete */}
      <button
        onClick={onDelete}
        className="w-6 h-6 flex items-center justify-center rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
        style={{ color: '#f87171', minHeight: 'auto', minWidth: 'auto' }}>
        ✕
      </button>
    </div>
  );
}

// ─── Question Card ─────────────────────────────────────────────────────────────
function QuestionCard({
  question,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  question: Question;
  index: number;
  total: number;
  onChange: (q: Question) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  function addAnswer() {
    const newAnswer: Answer = {
      id: generateId(),
      text: '',
      emoji: '✨',
      color: '#a78bfa',
      is_runaway: false,
    };
    onChange({ ...question, answers: [...question.answers, newAnswer] });
  }

  function updateAnswer(idx: number, a: Answer) {
    const answers = [...question.answers];
    answers[idx] = a;
    onChange({ ...question, answers });
  }

  function deleteAnswer(idx: number) {
    onChange({ ...question, answers: question.answers.filter((_, i) => i !== idx) });
  }

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}>
          Q{index + 1}
        </span>
        <input
          type="text"
          value={question.emoji}
          onChange={(e) => onChange({ ...question, emoji: e.target.value })}
          className="w-8 text-center bg-transparent border-none outline-none text-lg"
          maxLength={2}
        />
        <input
          type="text"
          value={question.text}
          onChange={(e) => onChange({ ...question, text: e.target.value })}
          placeholder="Question text..."
          className="flex-1 text-sm font-medium bg-transparent border-none outline-none"
          style={{ color: '#f0f0f4' }}
        />
        <div className="flex items-center gap-1 ml-auto">
          <button onClick={onMoveUp} disabled={index === 0}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-xs transition-all hover:bg-white/10 disabled:opacity-30"
            style={{ color: '#888899', minHeight: 'auto', minWidth: 'auto' }}>↑</button>
          <button onClick={onMoveDown} disabled={index === total - 1}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-xs transition-all hover:bg-white/10 disabled:opacity-30"
            style={{ color: '#888899', minHeight: 'auto', minWidth: 'auto' }}>↓</button>
          <button onClick={() => setCollapsed(!collapsed)}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-xs transition-all hover:bg-white/10"
            style={{ color: '#888899', minHeight: 'auto', minWidth: 'auto' }}>
            {collapsed ? '▼' : '▲'}
          </button>
          <button onClick={onDelete}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-xs transition-all hover:bg-red-500/20"
            style={{ color: '#f87171', minHeight: 'auto', minWidth: 'auto' }}>✕</button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-4 space-y-2">
          {question.answers.map((ans, idx) => (
            <AnswerRow
              key={ans.id}
              answer={ans}
              onChange={(a) => updateAnswer(idx, a)}
              onDelete={() => deleteAnswer(idx)}
            />
          ))}
          <button
            onClick={addAnswer}
            className="w-full py-2 rounded-xl text-xs font-medium border-dashed transition-all hover:bg-white/5"
            style={{ border: '1px dashed rgba(255,255,255,0.15)', color: '#888899', minHeight: 'auto' }}>
            + Add Answer
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Preview ──────────────────────────────────────────────────────────────────
function InvitePreview({ data }: { data: Partial<Invitation> }) {
  const theme = getTheme(data.theme ?? 'sakura');
  const [currentQ, setCurrentQ] = useState(0);
  const questions = data.questions ?? [];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {/* Phone frame */}
      <div className="relative w-[280px] h-[560px] rounded-[36px] overflow-hidden shadow-2xl flex-shrink-0"
        style={{
          background: theme.colors.bg,
          border: '8px solid rgba(255,255,255,0.1)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}>
        <div className="absolute inset-0" style={{ background: theme.gradient }} />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center">
          {questions.length === 0 ? (
            <>
              <div className="text-4xl mb-3">{theme.emoji}</div>
              <p className="text-xs font-bold mb-1" style={{ color: theme.colors.primary, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {theme.name}
              </p>
              <h2 className="text-lg font-bold mb-2" style={{ color: theme.colors.text, fontFamily: 'var(--font-playfair)' }}>
                {data.girl_name || 'Her Name'}
              </h2>
              <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                {data.title || 'Invitation Title'}
              </p>
            </>
          ) : (
            <>
              {/* Progress */}
              <div className="absolute top-6 left-5 right-5">
                <div className="h-1 rounded-full overflow-hidden" style={{ background: `${theme.colors.primary}30` }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${((currentQ + 1) / questions.length) * 100}%`, background: theme.colors.primary }} />
                </div>
              </div>

              <div className="text-2xl mb-2 mt-4">{questions[currentQ]?.emoji}</div>
              <p className="text-xs font-semibold mb-4" style={{ color: theme.colors.text, lineHeight: 1.4 }}>
                {questions[currentQ]?.text || 'Question text'}
              </p>

              <div className="w-full space-y-2">
                {questions[currentQ]?.answers?.slice(0, 3).map((ans, i) => (
                  <div key={i} className="w-full py-2 px-3 rounded-xl text-xs font-medium text-left"
                    style={{ background: `${ans.color}22`, border: `1px solid ${ans.color}44`, color: theme.colors.text }}>
                    {ans.emoji} {ans.text}
                  </div>
                ))}
              </div>

              {/* Nav dots */}
              <div className="absolute bottom-6 flex gap-1.5">
                {questions.map((_, i) => (
                  <button key={i} onClick={() => setCurrentQ(i)}
                    className="rounded-full transition-all"
                    style={{
                      width: i === currentQ ? '20px' : '6px',
                      height: '6px',
                      background: i === currentQ ? theme.colors.primary : `${theme.colors.primary}40`,
                      minHeight: 'auto', minWidth: 'auto',
                    }} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Editor Page ──────────────────────────────────────────────────────────────
export default function EditorPage({
  params,
}: {
  params: Promise<{ invitationId: string }>;
}) {
  const { invitationId } = use(params);
  const searchParams = useSearchParams();
  const clientToken = searchParams.get('client') ?? '';
  const router = useRouter();

  const [invitation, setInvitation] = useState<Partial<Invitation> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'questions' | 'theme'>('info');
  const [showTemplates, setShowTemplates] = useState(false);
  const [invLink, setInvLink] = useState('');
  const [copied, setCopied] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/invitations/${invitationId}`);
      if (!res.ok) { setLoading(false); return; }
      const data = await res.json();
      setInvitation(data);
      setLoading(false);
    }
    load();
  }, [invitationId]);

  useEffect(() => {
    if (invitation) {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const token = (invitation as Invitation).token;
      if (token) setInvLink(`${origin}/invite/${token}`);
    }
  }, [invitation]);

  // Auto-save with debounce
  const autoSave = useCallback(async (data: Partial<Invitation>) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      setSaving(true);
      await fetch(`/api/invitations/${invitationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  }, [invitationId]);

  function update(patch: Partial<Invitation>) {
    const updated = { ...invitation, ...patch } as Partial<Invitation>;
    setInvitation(updated);
    autoSave(updated);
  }

  function addQuestion() {
    const q: Question = {
      id: generateId(),
      text: 'New question?',
      emoji: '💭',
      answers: [
        { id: generateId(), text: 'Yes!', emoji: '✅', color: '#10b981', is_runaway: false },
        { id: generateId(), text: 'Maybe', emoji: '🤔', color: '#f59e0b', is_runaway: false },
        { id: generateId(), text: 'No', emoji: '❌', color: '#6b7280', is_runaway: true },
      ],
    };
    update({ questions: [...(invitation?.questions ?? []), q] });
  }

  function updateQuestion(idx: number, q: Question) {
    const questions = [...(invitation?.questions ?? [])];
    questions[idx] = q;
    update({ questions });
  }

  function deleteQuestion(idx: number) {
    update({ questions: (invitation?.questions ?? []).filter((_, i) => i !== idx) });
  }

  function moveQuestion(idx: number, dir: 1 | -1) {
    const questions = [...(invitation?.questions ?? [])];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= questions.length) return;
    [questions[idx], questions[newIdx]] = [questions[newIdx], questions[idx]];
    update({ questions });
  }

  function applyTemplate(templateId: string) {
    const t = questionTemplates.find(t => t.id === templateId);
    if (!t) return;
    const questions: Question[] = t.questions.map(q => ({
      ...q,
      id: generateId(),
      answers: q.answers.map(a => ({ ...a, id: generateId() })),
    }));
    update({ questions });
    setShowTemplates(false);
  }

  function copyLink() {
    navigator.clipboard.writeText(invLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080810' }}>
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">✏️</div>
          <p className="text-sm" style={{ color: '#888899' }}>Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080810' }}>
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-sm" style={{ color: '#888899' }}>Invitation not found.</p>
        </div>
      </div>
    );
  }

  const theme = getTheme(invitation.theme ?? 'sakura');

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#080810' }}>
      {/* Top bar */}
      <header className="flex-shrink-0 h-14 border-b flex items-center px-4 gap-3 z-30"
        style={{ background: 'rgba(8,8,16,0.95)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => router.push(clientToken ? `/client/${clientToken}` : '/admin/dashboard')}
          className="flex items-center gap-2 text-sm transition-all hover:opacity-70"
          style={{ color: '#888899', minHeight: 'auto', minWidth: 'auto' }}>
          ← Back
        </button>
        <div className="h-4 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <span className="text-sm text-white font-medium flex-1">
          Editing: {invitation.girl_name || 'Invitation'}
        </span>

        {/* Save status */}
        <div className="text-xs" style={{ color: saved ? '#34d399' : '#888899' }}>
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Auto-save on'}
        </div>

        {/* Copy link */}
        {invLink && (
          <button onClick={copyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            style={{
              background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(167,139,250,0.15)',
              color: copied ? '#34d399' : '#a78bfa',
              border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(167,139,250,0.3)'}`,
              minHeight: 'auto',
            }}>
            {copied ? '✓ Copied!' : '🔗 Copy Link'}
          </button>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ─── LEFT PANEL ─────────────────────────────────────────────── */}
        <div className="w-full md:w-[400px] flex-shrink-0 flex flex-col border-r overflow-hidden"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#0c0c18' }}>
          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {(['info', 'questions', 'theme'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-3 text-xs font-medium capitalize transition-all"
                style={{
                  color: activeTab === tab ? '#f0f0f4' : '#888899',
                  borderBottom: activeTab === tab ? `2px solid ${theme.colors.primary}` : '2px solid transparent',
                  background: 'transparent',
                  minHeight: 'auto',
                }}>
                {tab === 'info' ? '✏️ Info' : tab === 'questions' ? '❓ Questions' : '🎨 Theme'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* ─ INFO TAB ─ */}
            {activeTab === 'info' && (
              <>
                {[
                  { label: "Girl's Name", key: 'girl_name', placeholder: 'Sofia' },
                  { label: 'Title', key: 'title', placeholder: 'Will you go out with me?' },
                  { label: 'Subtitle', key: 'subtitle', placeholder: 'A little question for you...' },
                  { label: 'Welcome Message', key: 'welcome_message', placeholder: 'Hey! I made something special for you ❤️' },
                  { label: 'Description', key: 'description', placeholder: 'Answer a few questions for me...' },
                  { label: 'Final Message', key: 'final_message', placeholder: 'Thank you! Your answers mean the world to me ❤️' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium mb-1.5 uppercase tracking-widest" style={{ color: '#888899' }}>
                      {label}
                    </label>
                    {key === 'welcome_message' || key === 'description' || key === 'final_message' ? (
                      <textarea
                        value={(invitation as Record<string, string>)[key] ?? ''}
                        onChange={(e) => update({ [key]: e.target.value } as Partial<Invitation>)}
                        placeholder={placeholder}
                        rows={2}
                        className="w-full px-3 py-2.5 rounded-xl text-sm resize-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f0f4', outline: 'none' }}
                        onFocus={(e) => { e.target.style.border = `1px solid ${theme.colors.primary}66`; }}
                        onBlur={(e) => { e.target.style.border = '1px solid rgba(255,255,255,0.08)'; }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={(invitation as Record<string, string>)[key] ?? ''}
                        onChange={(e) => update({ [key]: e.target.value } as Partial<Invitation>)}
                        placeholder={placeholder}
                        className="w-full px-3 py-2.5 rounded-xl text-sm transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f0f4', outline: 'none' }}
                        onFocus={(e) => { e.target.style.border = `1px solid ${theme.colors.primary}66`; }}
                        onBlur={(e) => { e.target.style.border = '1px solid rgba(255,255,255,0.08)'; }}
                      />
                    )}
                  </div>
                ))}
              </>
            )}

            {/* ─ QUESTIONS TAB ─ */}
            {activeTab === 'questions' && (
              <>
                <div className="flex gap-2 mb-2">
                  <button onClick={addQuestion}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: `${theme.colors.primary}22`, color: theme.colors.primary, border: `1px solid ${theme.colors.primary}44`, minHeight: 'auto' }}>
                    + Add Question
                  </button>
                  <button onClick={() => setShowTemplates(true)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-medium transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#f0f0f4', border: '1px solid rgba(255,255,255,0.08)', minHeight: 'auto' }}>
                    📋 Templates
                  </button>
                </div>

                {(invitation.questions ?? []).length === 0 ? (
                  <div className="text-center py-10 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
                    <div className="text-3xl mb-2">❓</div>
                    <p className="text-xs" style={{ color: '#888899' }}>No questions yet. Add one or use a template.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(invitation.questions ?? []).map((q, idx) => (
                      <QuestionCard
                        key={q.id}
                        question={q}
                        index={idx}
                        total={(invitation.questions ?? []).length}
                        onChange={(updated) => updateQuestion(idx, updated)}
                        onDelete={() => deleteQuestion(idx)}
                        onMoveUp={() => moveQuestion(idx, -1)}
                        onMoveDown={() => moveQuestion(idx, 1)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ─ THEME TAB ─ */}
            {activeTab === 'theme' && (
              <div className="grid grid-cols-2 gap-3">
                {themeList.map(t => (
                  <button
                    key={t.id}
                    onClick={() => update({ theme: t.id as ThemeId })}
                    className="p-3 rounded-2xl text-left transition-all hover:-translate-y-0.5"
                    style={{
                      background: t.colors.bg,
                      border: invitation.theme === t.id
                        ? `2px solid ${t.colors.primary}`
                        : '2px solid rgba(255,255,255,0.06)',
                      boxShadow: invitation.theme === t.id ? `0 4px 20px ${t.colors.primary}40` : 'none',
                      minHeight: 'auto', minWidth: 'auto',
                    }}>
                    <div className="text-2xl mb-1">{t.emoji}</div>
                    <p className="text-xs font-semibold" style={{ color: t.colors.text }}>{t.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: t.colors.textSecondary, fontSize: '10px' }}>{t.description}</p>
                    {/* Color preview */}
                    <div className="flex gap-1 mt-2">
                      {[t.colors.primary, t.colors.accent, t.colors.bgSecondary].map((c, i) => (
                        <div key={i} className="w-4 h-4 rounded-full" style={{ background: c }} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── RIGHT: PREVIEW ──────────────────────────────────────────── */}
        <div className="hidden md:flex flex-1 items-center justify-center"
          style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.02) 0%, transparent 70%)' }}>
          <InvitePreview data={invitation} />
        </div>
      </div>

      {/* ─── TEMPLATE MODAL ───────────────────────────────────────────── */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl p-6 animate-scale-in"
            style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)', maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Question Templates</h3>
              <button onClick={() => setShowTemplates(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10"
                style={{ color: '#888899', minHeight: 'auto', minWidth: 'auto' }}>✕</button>
            </div>
            <div className="space-y-3">
              {questionTemplates.map(t => (
                <button key={t.id} onClick={() => applyTemplate(t.id)}
                  className="w-full p-4 rounded-2xl text-left transition-all hover:bg-white/5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', minHeight: 'auto' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{t.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#888899' }}>{t.description} · {t.questions.length} questions</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
