'use client';

import { useState, useEffect, useCallback, useRef, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Invitation, Question, Answer, ThemeId, ResultAnswer } from '@/types';
import { themeList, getTheme } from '@/lib/themes';
import { questionTemplates } from '@/lib/templates';
import { generateId } from '@/lib/utils';
import { libraryCategories, libraryQuestions, LibraryQuestion } from '@/lib/library';


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
        placeholder="Текст ответа..."
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
        title="Сделать кнопку убегающей"
        style={{
          background: answer.is_runaway ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)',
          color: answer.is_runaway ? '#f87171' : '#888899',
          border: `1px solid ${answer.is_runaway ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}`,
          minHeight: 'auto', minWidth: 'auto',
        }}>
        {answer.is_runaway ? '🏃 Вкл' : '🏃 Выкл'}
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
          В{index + 1}
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
          placeholder="Текст вопроса..."
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
            + Добавить вариант ответа
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
                {data.girl_name || 'Имя девушки'}
              </h2>
              <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                {data.title || 'Заголовок приглашения'}
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
                {questions[currentQ]?.text || 'Текст вопроса'}
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
  const [step, setStep] = useState<number>(1);
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

  const [showLibrary, setShowLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('romance');
  const [selectedLibQuestions, setSelectedLibQuestions] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [addedQuestionsFeedback, setAddedQuestionsFeedback] = useState<Record<string, boolean>>({});
  const [libView, setLibView] = useState<'categories' | 'questions'>('categories');

  // View as the Girl simulation states
  const [viewAsGirlMode, setViewAsGirlMode] = useState(false);
  const [simStep, setSimStep] = useState<'welcome' | 'questions' | 'completed'>('welcome');
  const [simQIndex, setSimQIndex] = useState(0);
  const [simAnswers, setSimAnswers] = useState<ResultAnswer[]>([]);
  const [simRunawayOffset, setSimRunawayOffset] = useState({ x: 0, y: 0 });
  const [simEscapeCount, setSimEscapeCount] = useState(0);
  const [simSpeechMessage, setSimSpeechMessage] = useState('');
  const [simShowSpeech, setSimShowSpeech] = useState(false);
  const [simParticles, setSimParticles] = useState<{ id: number; tx: number; ty: number }[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('lf_favorite_questions');
      const savedRecent = localStorage.getItem('lf_recent_questions');
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedRecent) setRecent(JSON.parse(savedRecent));
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('lf_favorite_questions', JSON.stringify(updated));
      return updated;
    });
  };

  const addToRecent = (id: string) => {
    setRecent(prev => {
      const filtered = prev.filter(r => r !== id);
      const updated = [id, ...filtered].slice(0, 8);
      localStorage.setItem('lf_recent_questions', JSON.stringify(updated));
      return updated;
    });
  };

  const addQuestionFromLibrary = (libQ: LibraryQuestion) => {
    const q: Question = {
      id: generateId(),
      text: libQ.text,
      emoji: libQ.emoji,
      answers: libQ.answers.map(ans => ({
        ...ans,
        id: generateId()
      })) as Answer[]
    };
    update({ questions: [...(invitation?.questions ?? []), q] });
    addToRecent(libQ.id);

    setAddedQuestionsFeedback(prev => ({ ...prev, [libQ.id]: true }));
    setTimeout(() => {
      setAddedQuestionsFeedback(prev => ({ ...prev, [libQ.id]: false }));
    }, 1500);
  };

  const addSelectedQuestionsFromLibrary = () => {
    const selectedObjs = libraryQuestions.filter(lq => selectedLibQuestions.includes(lq.id));
    const newQuestions = selectedObjs.map(libQ => ({
      id: generateId(),
      text: libQ.text,
      emoji: libQ.emoji,
      answers: libQ.answers.map(ans => ({
        ...ans,
        id: generateId()
      })) as Answer[]
    }));
    update({ questions: [...(invitation?.questions ?? []), ...newQuestions] });
    selectedObjs.forEach(lq => addToRecent(lq.id));
    setSelectedLibQuestions([]);
    setShowLibrary(false);
  };

  const runawayMessages = [
    "Даже не думай 😏",
    "Не сегодня 😄",
    "Мимо 🤭",
    "Такой вариант сегодня недоступен ❤️",
    "А может всё-таки «Да»? 🥹",
    "Попробуй другую кнопку 😉",
    "Он ведь старался 💖",
    "Дай ему шанс 🌸",
    "Кажется, ты промахнулась 😄",
    "Даже не пытайся 😝",
    "Нет сегодня в отпуске 😂",
    "Здесь принимается только любовь ❤️",
    "Эта кнопка решила пожить ещё 😅",
    "Не получится 😌"
  ];

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
      text: 'Новый вопрос?',
      emoji: '💭',
      answers: [
        { id: generateId(), text: 'Да!', emoji: '✅', color: '#10b981', is_runaway: false },
        { id: generateId(), text: 'Возможно', emoji: '🤔', color: '#f59e0b', is_runaway: false },
        { id: generateId(), text: 'Нет', emoji: '❌', color: '#6b7280', is_runaway: true },
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
          <p className="text-sm" style={{ color: '#888899' }}>Загрузка редактора...</p>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080810' }}>
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-sm" style={{ color: '#888899' }}>Приглашение не найдено.</p>
        </div>
      </div>
    );
  }

  const theme = getTheme(invitation.theme ?? 'sakura');

  return (
    <div className="flex flex-col" style={{ background: '#080810', minHeight: '100dvh' }}>
      {/* Top bar */}
      <header className="flex-shrink-0 h-14 border-b flex items-center px-4 gap-3 z-30"
        style={{ background: 'rgba(8,8,16,0.95)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => router.push(clientToken ? `/client/${clientToken}` : '/admin/dashboard')}
          className="flex items-center gap-2 text-sm transition-all hover:opacity-70"
          style={{ color: '#888899', minHeight: 'auto', minWidth: 'auto' }}>
          ← Назад
        </button>
        <div className="h-4 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <span className="text-sm text-white font-medium flex-1">
          Редактор: {invitation.girl_name || 'Приглашение'}
        </span>

        {/* Save status */}
        <div className="text-xs" style={{ color: saved ? '#34d399' : '#888899' }}>
          {saving ? 'Сохранение...' : saved ? '✓ Сохранено' : 'Автосохранение'}
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
            {copied ? '✓ Скопировано!' : '🔗 Ссылка'}
          </button>
        )}
      </header>

      <div className="flex flex-1 flex-col md:flex-row md:overflow-hidden" style={{ minHeight: 0 }}>
        {/* Step indicator on mobile - always visible top strip */}
        <div className="md:hidden flex-shrink-0 px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex gap-1 flex-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{ background: s <= step ? 'linear-gradient(90deg, #ec4899, #a78bfa)' : 'rgba(255,255,255,0.08)' }} />
            ))}
          </div>
          <span className="text-[10px] font-bold ml-2 flex-shrink-0" style={{ color: '#666677' }}>
            {step === 1 ? 'Инфо' : step === 2 ? 'Тема' : step === 3 ? 'Вопросы' : step === 4 ? 'Просмотр' : 'Публикация'}
          </span>
        </div>

        {/* ─── LEFT PANEL: STEP-BY-STEP WIZARD ─────────────────────────────────── */}
        <div className={`w-full md:w-[450px] flex-shrink-0 flex flex-col border-r ${step === 4 ? 'hidden md:flex' : 'flex'}`}
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#0c0c18' }}>
          
          {/* Wizard Step Tracker Header — desktop only */}
          <div className="hidden md:block p-4 border-b space-y-2.5" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.1)' }}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white uppercase tracking-wider">Шаг {step} из 5</span>
              <span className="text-gray-500 font-medium">
                {step === 1 ? 'Информация' : step === 2 ? 'Тема оформления' : step === 3 ? 'Вопросы' : step === 4 ? 'Проверка' : 'Публикация'}
              </span>
            </div>
            
            {/* Visual Step Dots */}
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className="h-1.5 flex-1 rounded-full transition-all duration-300"
                  style={{
                    background: s <= step ? 'linear-gradient(90deg, #ec4899, #a78bfa)' : 'rgba(255,255,255,0.08)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Step content — pb-28 on mobile so fixed nav bar never covers content */}
          <div className="flex-1 p-5 pb-28 md:pb-5 space-y-5 md:overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* ─ STEP 1: INFO ─ */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in-up">
                {[
                  { label: "Имя девушки", key: 'girl_name', placeholder: 'София' },
                  { label: 'Заголовок приглашения', key: 'title', placeholder: 'Пойдешь со мной на свидание?' },
                  { label: 'Подзаголовок', key: 'subtitle', placeholder: 'Небольшой вопрос для тебя...' },
                  { label: 'Приветственное сообщение', key: 'welcome_message', placeholder: 'Привет! Я сделал кое-что особенное для тебя ❤️' },
                  { label: 'Описание', key: 'description', placeholder: 'Ответь на пару вопросов для меня...' },
                  { label: 'Финальное сообщение', key: 'final_message', placeholder: 'Спасибо! Твои ответы очень важны для меня ❤️' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider text-gray-500">
                      {label}
                    </label>
                    {key === 'welcome_message' || key === 'description' || key === 'final_message' ? (
                      <textarea
                        value={(invitation as Record<string, string>)[key] ?? ''}
                        onChange={(e) => update({ [key]: e.target.value } as Partial<Invitation>)}
                        placeholder={placeholder}
                        rows={3}
                        className="w-full px-3.5 py-3 rounded-2xl text-xs resize-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f0f4', outline: 'none' }}
                        onFocus={(e) => { e.target.style.border = `1px solid ${theme.colors.primary}66`; }}
                        onBlur={(e) => { e.target.style.border = '1px solid rgba(255,255,255,0.08)'; }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={(invitation as Record<string, string>)[key] ?? ''}
                        onChange={(e) => update({ [key]: e.target.value } as Partial<Invitation>)}
                        placeholder={placeholder}
                        className="w-full px-3.5 py-3 rounded-2xl text-xs transition-all"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f0f4', outline: 'none' }}
                        onFocus={(e) => { e.target.style.border = `1px solid ${theme.colors.primary}66`; }}
                        onBlur={(e) => { e.target.style.border = '1px solid rgba(255,255,255,0.08)'; }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ─ STEP 2: THEME ─ */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-3.5 animate-fade-in-up py-2">
                {themeList.map(t => (
                  <button
                    key={t.id}
                    onClick={() => update({ theme: t.id as ThemeId })}
                    className="p-3.5 rounded-3xl text-left transition-all hover:scale-[1.02] cursor-pointer"
                    style={{
                      background: t.colors.bg,
                      border: invitation.theme === t.id
                        ? `2px solid ${t.colors.primary}`
                        : '2px solid rgba(255,255,255,0.06)',
                      boxShadow: invitation.theme === t.id ? `0 4px 20px ${t.colors.primary}30` : 'none',
                      minHeight: 'auto', minWidth: 'auto',
                    }}>
                    <div className="text-2xl mb-1.5">{t.emoji}</div>
                    <p className="text-xs font-bold" style={{ color: t.colors.text }}>{t.name}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: t.colors.textSecondary }}>{t.description}</p>
                    {/* Color preview dots */}
                    <div className="flex gap-1.5 mt-3">
                      {[t.colors.primary, t.colors.accent, t.colors.bgSecondary].map((c, i) => (
                        <div key={i} className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ background: c }} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* ─ STEP 3: QUESTIONS ─ */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <button onClick={addQuestion}
                    className="py-2.5 px-1 rounded-2xl text-[10px] font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-white/5 active-tap"
                    style={{ background: `${theme.colors.primary}18`, color: theme.colors.primary, border: `1px solid ${theme.colors.primary}33`, minHeight: '56px' }}>
                    <span className="text-sm">➕</span>
                    <span>Вопрос</span>
                  </button>
                  <button onClick={() => setShowTemplates(true)}
                    className="py-2.5 px-1 rounded-2xl text-[10px] font-medium transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-white/5 active-tap"
                    style={{ background: 'rgba(255,255,255,0.02)', color: '#f0f0f4', border: '1px solid rgba(255,255,255,0.08)', minHeight: '56px' }}>
                    <span className="text-sm">📋</span>
                    <span>Шаблоны</span>
                  </button>
                  <button onClick={() => setShowLibrary(true)}
                    className="py-2.5 px-1 rounded-2xl text-[10px] font-medium transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-white/5 active-tap"
                    style={{ background: 'rgba(255,255,255,0.02)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.15)', minHeight: '56px' }}>
                    <span className="text-sm">📚</span>
                    <span>Библиотека</span>
                  </button>
                </div>

                {(invitation.questions ?? []).length === 0 ? (
                  <div className="text-center py-12 rounded-3xl"
                    style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.06)' }}>
                    <div className="text-4xl mb-3">❓</div>
                    <p className="text-xs text-gray-500 max-w-[200px] mx-auto leading-relaxed">
                      Вопросов пока нет. Добавьте свой или выберите из библиотеки.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
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
              </div>
            )}

            {/* ─ STEP 5: PUBLISH ─ */}
            {step === 5 && (
              <div className="space-y-5 animate-fade-in-up py-4">
                <div className="text-center space-y-2">
                  <div className="text-5xl animate-float">🎉</div>
                  <h3 className="text-lg font-bold text-white">Приглашение готово!</h3>
                  <p className="text-xs text-gray-400 max-w-[280px] mx-auto leading-relaxed">
                    Опрос сохранен и готов к отправке вашей любимой.
                  </p>
                </div>

                <div className="p-4 rounded-3xl bg-white/2 border border-white/5 space-y-3.5">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider font-bold mb-1.5 text-gray-500">
                      Ссылка на опрос
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={invLink}
                        className="flex-1 px-3 py-2.5 rounded-xl text-xs bg-black/40 border border-white/8 text-gray-300 outline-none"
                      />
                      <button
                        onClick={copyLink}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active-tap"
                        style={{
                          background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(167,139,250,0.15)',
                          color: copied ? '#34d399' : '#a78bfa',
                          border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(167,139,250,0.3)'}`,
                        }}
                      >
                        {copied ? 'Скопировано!' : 'Копировать'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl p-4 bg-yellow-500/5 border border-yellow-500/10 space-y-2">
                  <h4 className="text-xs font-bold text-yellow-500">💡 Как это работает?</h4>
                  <ul className="text-[11px] text-gray-400 space-y-2 list-disc pl-4 leading-relaxed">
                    <li>Скопируйте ссылку и отправьте её любимой.</li>
                    <li>Она ответит на интерактивные вопросы на своём телефоне.</li>
                    <li>Все ответы мгновенно отобразятся в вашем личном кабинете.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Wizard Footer Controls — desktop only */}
          <div className="hidden md:flex p-4 border-t items-center justify-between gap-3 bg-[#080810]/95 backdrop-blur-md"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => setStep(prev => Math.max(1, prev - 1))}
              disabled={step === 1}
              className="px-5 py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 active-tap"
              style={{ background: 'transparent', color: '#f0f0f4', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              Назад
            </button>
            <button
              onClick={() => {
                if (step === 5) {
                  router.push(clientToken ? `/client/${clientToken}` : '/admin/dashboard');
                } else {
                  setStep(prev => Math.min(5, prev + 1));
                }
              }}
              className="px-6 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shadow-lg active-tap hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #ec4899, #a78bfa)',
                color: '#fff',
              }}
            >
              {step === 4 ? 'Опубликовать ✨' : step === 5 ? 'Завершить ✓' : 'Далее'}
            </button>
          </div>
        </div>

        {/* \u2500\u2500\u2500 RIGHT PANEL: PREVIEW \u2500\u2500\u2500 */}
        <div className={`flex-1 items-center justify-center p-4 pb-28 md:pb-4 relative ${step === 4 ? 'flex' : 'hidden md:flex'}`}
          style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.01) 0%, transparent 70%)', minHeight: step === 4 ? '100dvh' : 'auto' }}>

          <InvitePreview data={invitation} />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE FIXED BOTTOM NAV BAR — always visible on mobile, all steps
          ═════════════════════════════════════════════════════════════════ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
        style={{
          background: 'rgba(8, 8, 16, 0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Back button */}
          <button
            onClick={() => {
              if (step > 1) setStep(prev => prev - 1);
            }}
            disabled={step === 1}
            className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            style={{
              background: 'rgba(255,255,255,0.06)',
              color: '#c0c0d4',
              border: '1px solid rgba(255,255,255,0.1)',
              minHeight: '52px',
              minWidth: '100px',
            }}
          >
            <span style={{ fontSize: '16px' }}>←</span>
            <span>Назад</span>
          </button>

          {/* Primary action button — grows to fill remaining space */}
          <button
            onClick={() => {
              if (step === 5) {
                router.push(clientToken ? `/client/${clientToken}` : '/admin/dashboard');
              } else {
                setStep(prev => Math.min(5, prev + 1));
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-extrabold transition-all active:scale-[0.98] shadow-lg"
            style={{
              background: step === 5
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #ec4899, #a78bfa)',
              color: '#fff',
              minHeight: '52px',
              boxShadow: step === 5
                ? '0 8px 24px rgba(16,185,129,0.35)'
                : '0 8px 24px rgba(236,72,153,0.35)',
            }}
          >
            {step === 1 && <><span>Инфо</span><span>→</span></>}
            {step === 2 && <><span>Тема</span><span>→</span></>}
            {step === 3 && <><span>Просмотреть</span><span>→</span></>}
            {step === 4 && <><span>✨</span><span>Опубликовать</span></>}
            {step === 5 && <><span>✅</span><span>Завершить</span></>}
          </button>
        </div>
      </div>


      {/* ─── TEMPLATE MODAL ───────────────────────────────────────────── */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl p-6 animate-scale-in"
            style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)', maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Шаблоны вопросов</h3>
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
                      <p className="text-xs mt-0.5" style={{ color: '#888899' }}>{t.description} · {t.questions.length} вопросов</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── QUESTION LIBRARY MODAL (Mobile-native bottom sheet) ───────────────── */}
      {showLibrary && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowLibrary(false); setSearchQuery(''); setLibView('categories'); } }}
        >
          {/* Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 md:relative md:inset-auto md:m-auto flex flex-col"
            style={{
              background: '#0d0d1a',
              borderRadius: '28px 28px 0 0',
              maxHeight: '92dvh',
              height: '92dvh',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 -20px 60px rgba(0,0,0,0.7)',
              animation: 'slideUpSheet 0.3s cubic-bezier(0.32,0.72,0,1)',
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* ── Header ── */}
            <div className="px-5 pt-2 pb-3 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  {libView === 'questions' && (
                    <button
                      onClick={() => { setLibView('categories'); setSearchQuery(''); }}
                      className="flex items-center justify-center w-8 h-8 rounded-xl transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', color: '#a0a0b8', minHeight: 'auto', minWidth: 'auto' }}
                    >
                      ←
                    </button>
                  )}
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">
                      {libView === 'categories'
                        ? '📚 Библиотека вопросов'
                        : (() => {
                            if (selectedCategory === 'favorites') return '⭐ Избранное';
                            if (selectedCategory === 'recent') return '⏳ Недавние';
                            const cat = libraryCategories.find(c => c.id === selectedCategory);
                            return cat ? `${cat.emoji} ${cat.name}` : 'Вопросы';
                          })()}
                    </h3>
                    {libView === 'categories' && (
                      <p className="text-[11px] mt-0.5" style={{ color: '#666677' }}>Выберите категорию</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => { setShowLibrary(false); setSearchQuery(''); setLibView('categories'); }}
                  className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all hover:bg-white/10"
                  style={{ background: 'rgba(255,255,255,0.04)', color: '#666677', minHeight: 'auto', minWidth: 'auto' }}
                >✕</button>
              </div>

              {/* Search bar — visible on both views */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base opacity-40" style={{ pointerEvents: 'none' }}>🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim() && libView === 'categories') setLibView('questions');
                    if (!e.target.value.trim() && libView === 'questions') setLibView('categories');
                  }}
                  placeholder="Поиск по всем вопросам..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#f0f0f4',
                    outline: 'none',
                  }}
                  onFocus={(e) => { e.target.style.border = `1px solid ${theme.colors.primary}55`; }}
                  onBlur={(e) => { e.target.style.border = '1px solid rgba(255,255,255,0.08)'; }}
                />
              </div>
            </div>

            {/* ── CATEGORIES VIEW ── */}
            {libView === 'categories' && !searchQuery.trim() && (
              <div className="flex-1 overflow-y-auto px-4 pb-8" style={{ WebkitOverflowScrolling: 'touch' }}>
                {/* Special tabs */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button
                    onClick={() => { setSelectedCategory('favorites'); setLibView('questions'); }}
                    className="flex items-center gap-3 p-4 rounded-2xl text-left transition-all active:scale-95"
                    style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', minHeight: '64px' }}
                  >
                    <span className="text-2xl">⭐</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#fbbf24' }}>Избранное</p>
                      <p className="text-[10px]" style={{ color: '#a8850a' }}>{favorites.length} вопросов</p>
                    </div>
                  </button>
                  <button
                    onClick={() => { setSelectedCategory('recent'); setLibView('questions'); }}
                    className="flex items-center gap-3 p-4 rounded-2xl text-left transition-all active:scale-95"
                    style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', minHeight: '64px' }}
                  >
                    <span className="text-2xl">⏳</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#a78bfa' }}>Недавние</p>
                      <p className="text-[10px]" style={{ color: '#7055c4' }}>{recent.length} вопросов</p>
                    </div>
                  </button>
                </div>

                <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#444455' }}>Категории</p>

                {/* Category grid */}
                <div className="grid grid-cols-2 gap-3">
                  {libraryCategories.map(cat => {
                    const count = libraryQuestions.filter(lq => lq.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id); setLibView('questions'); }}
                        className="flex items-center gap-3 p-4 rounded-2xl text-left transition-all active:scale-95 hover:bg-white/5"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          minHeight: '64px',
                        }}
                      >
                        <span className="text-2xl flex-shrink-0">{cat.emoji}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{cat.name}</p>
                          <p className="text-[10px]" style={{ color: '#555566' }}>{count} вопросов</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── QUESTIONS VIEW ── */}
            {(libView === 'questions' || searchQuery.trim()) && (
              <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-3" style={{ WebkitOverflowScrolling: 'touch' }}>
                {(() => {
                  let toShow: LibraryQuestion[] = [];
                  if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase();
                    toShow = libraryQuestions.filter(lq =>
                      lq.text.toLowerCase().includes(q) ||
                      (libraryCategories.find(c => c.id === lq.category)?.name.toLowerCase() ?? '').includes(q)
                    );
                  } else if (selectedCategory === 'favorites') {
                    toShow = libraryQuestions.filter(lq => favorites.includes(lq.id));
                  } else if (selectedCategory === 'recent') {
                    toShow = recent
                      .map(id => libraryQuestions.find(lq => lq.id === id))
                      .filter((lq): lq is LibraryQuestion => !!lq);
                  } else if (selectedCategory) {
                    toShow = libraryQuestions.filter(lq => lq.category === selectedCategory);
                  } else {
                    toShow = libraryQuestions;
                  }

                  if (toShow.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="text-5xl mb-4 opacity-30">
                          {selectedCategory === 'favorites' ? '⭐' : selectedCategory === 'recent' ? '⏳' : '🔍'}
                        </div>
                        <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
                          {selectedCategory === 'favorites'
                            ? 'Нет избранных вопросов'
                            : selectedCategory === 'recent'
                            ? 'Вы ещё не добавляли вопросы'
                            : 'Ничего не найдено'}
                        </p>
                        <p className="text-xs mt-2" style={{ color: '#444455' }}>
                          {selectedCategory === 'favorites'
                            ? 'Нажмите ☆ рядом с любым вопросом'
                            : selectedCategory === 'recent'
                            ? 'Добавьте вопрос из любой категории'
                            : 'Попробуйте другой запрос'}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <>
                      {toShow.map(libQ => {
                        const isFav = favorites.includes(libQ.id);
                        const isAdded = !!addedQuestionsFeedback[libQ.id];
                        return (
                          <div
                            key={libQ.id}
                            className="rounded-2xl p-4 transition-all"
                            style={{
                              background: isAdded ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.03)',
                              border: isAdded
                                ? '1px solid rgba(16,185,129,0.3)'
                                : '1px solid rgba(255,255,255,0.07)',
                            }}
                          >
                            {/* Question row */}
                            <div className="flex items-start gap-3 mb-3">
                              <span className="text-xl flex-shrink-0 mt-0.5">{libQ.emoji}</span>
                              <p className="flex-1 text-sm font-semibold text-white leading-snug">{libQ.text}</p>
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleFavorite(libQ.id); }}
                                className="flex-shrink-0 text-lg leading-none transition-all active:scale-90"
                                style={{ minHeight: 'auto', minWidth: 'auto', color: isFav ? '#fbbf24' : '#333345' }}
                              >
                                {isFav ? '⭐' : '☆'}
                              </button>
                            </div>

                            {/* Answer chips */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {libQ.answers.map((ans, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-medium"
                                  style={{
                                    background: `${ans.color}18`,
                                    border: `1px solid ${ans.color}30`,
                                    color: '#c4c4d4',
                                  }}
                                >
                                  <span>{ans.emoji}</span>
                                  <span>{ans.text}</span>
                                  {ans.is_runaway && <span className="text-[9px] text-red-400">🏃</span>}
                                </span>
                              ))}
                            </div>

                            {/* Add button full-width */}
                            <button
                              onClick={() => addQuestionFromLibrary(libQ)}
                              className="w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-98 cursor-pointer"
                              style={{
                                background: isAdded
                                  ? 'rgba(16,185,129,0.15)'
                                  : 'linear-gradient(135deg,#ec4899,#a78bfa)',
                                border: isAdded ? '1px solid rgba(16,185,129,0.4)' : 'none',
                                color: isAdded ? '#34d399' : '#fff',
                                boxShadow: isAdded ? 'none' : '0 4px 16px rgba(236,72,153,0.3)',
                              }}
                            >
                              {isAdded ? '✓ Добавлено' : '➕ Добавить вопрос'}
                            </button>
                          </div>
                        );
                      })}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
