'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { Invitation, Question, Answer, ResultAnswer } from '@/types';
import { getTheme } from '@/lib/themes';

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

export default function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'welcome' | 'questions' | 'completed'>('welcome');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<ResultAnswer[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [resultToken, setResultToken] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Overhauled runaway button state variables
  const [runawayOffset, setRunawayOffset] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);
  const [speechMessage, setSpeechMessage] = useState('');
  const [showSpeech, setShowSpeech] = useState(false);
  const [particles, setParticles] = useState<{ id: number; tx: number; ty: number }[]>([]);
  const runawayButtonRef = useRef<HTMLButtonElement>(null);
  const speechTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function fetchInvitation() {
      try {
        const res = await fetch(`/api/invite/${token}`);
        if (!res.ok) {
          throw new Error('Приглашение не найдено или неактивно');
        }
        const data = await res.json();
        setInvitation(data);
      } catch (err: any) {
        setError(err.message || 'Что-то пошло не так');
      } finally {
        setLoading(false);
      }
    }
    fetchInvitation();
  }, [token]);

  const handleStart = () => {
    setStartTime(Date.now());
    setStep('questions');
  };

  const handleRunawayMove = () => {
    const maxEscapes = 4;
    
    // Heart particles burst effect
    const newParticles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      tx: (Math.random() - 0.5) * 140,
      ty: (Math.random() - 0.5) * 140,
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 600);

    // If reached max escapes, don't run away anymore, show final message and become clickable
    if (escapeCount >= maxEscapes) {
      setSpeechMessage("Ладно... если ты уверена ❤️");
      setShowSpeech(true);
      return;
    }

    // Smooth elastic offset calculations (80-120px range)
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 40;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    setRunawayOffset(prev => {
      let newX = prev.x + dx;
      let newY = prev.y + dy;
      
      // Safety boundaries to keep it visible on smartphone screens
      if (newX < -110) newX = -110 + Math.random() * 20;
      if (newX > 110) newX = 110 - Math.random() * 20;
      if (newY < -150) newY = -150 + Math.random() * 20;
      if (newY > 150) newY = 150 - Math.random() * 20;
      
      return { x: newX, y: newY };
    });

    // Random message choice
    const msg = runawayMessages[Math.floor(Math.random() * runawayMessages.length)];
    setSpeechMessage(msg);
    setShowSpeech(true);
    setEscapeCount(prev => prev + 1);

    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(() => {
      setShowSpeech(false);
    }, 1500);
  };

  const handleAnswerSelect = async (ans: Answer, question: Question) => {
    // If it runs away and has not reached max escapes, trigger the runaway sequence
    if (ans.is_runaway && escapeCount < 5) {
      handleRunawayMove();
      return;
    }

    // Reset runaway counters and bubbles for the next question
    setRunawayOffset({ x: 0, y: 0 });
    setEscapeCount(0);
    setShowSpeech(false);

    const newAnswer: ResultAnswer = {
      question_id: question.id,
      question_text: question.text,
      answer_text: ans.text,
      answer_emoji: ans.emoji,
      answer_color: ans.color,
    };

    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQIndex] = newAnswer;
    setSelectedAnswers(updatedAnswers);

    if (currentQIndex < (invitation?.questions?.length || 0) - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      const timeTaken = Math.round((Date.now() - startTime) / 1000);
      try {
        const submitRes = await fetch(`/api/invite/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers: updatedAnswers,
            time_taken_seconds: timeTaken,
          }),
        });
        const resultData = await submitRes.json();
        if (submitRes.ok) {
          setResultToken(resultData.result_token);
          setStep('completed');
        } else {
          throw new Error(resultData.error || 'Не удалось сохранить ответы');
        }
      } catch (err: any) {
        alert(err.message || 'Ошибка отправки, попробуйте еще раз.');
      }
    }
  };

  const handleBack = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
      // Reset runaway logic when switching questions
      setRunawayOffset({ x: 0, y: 0 });
      setEscapeCount(0);
      setShowSpeech(false);
    }
  };

  const copyResultLink = () => {
    if (typeof window !== 'undefined') {
      const link = `${window.location.origin}/results/${resultToken}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080810] text-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
          <p className="text-sm text-gray-400">Открываем волшебное приглашение...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080810] text-white p-4">
        <div className="glass max-w-sm w-full p-8 rounded-2xl text-center space-y-4 border-red-500/20">
          <div className="text-4xl">🔒</div>
          <h2 className="text-lg font-bold text-red-400">Приглашение недоступно</h2>
          <p className="text-sm text-gray-400">
            Это приглашение уже было пройдено, удалено или ссылка неверна.
          </p>
        </div>
      </div>
    );
  }

  const theme = getTheme(invitation.theme);
  const questions = invitation.questions || [];
  const currentQuestion = questions[currentQIndex];
  const previousSelected = selectedAnswers[currentQIndex];

  return (
    <div
      className="min-h-screen flex flex-col justify-between items-center p-5 sm:p-6 relative overflow-hidden transition-all duration-700"
      style={{
        background: theme.colors.bg,
        backgroundImage: theme.gradient,
        color: theme.colors.text,
        fontFamily: theme.fontStyle === 'romantic' ? 'var(--font-playfair)' : 'var(--font-sans)',
      }}
    >
      {/* Decorative Floating Theme Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {theme.particleType === 'petals' && (
          <>
            <span className="absolute animate-float text-3xl opacity-20 left-[10%] top-[15%]">🌸</span>
            <span className="absolute animate-float text-2xl opacity-15 right-[20%] top-[25%]" style={{ animationDelay: '1s' }}>🌸</span>
            <span className="absolute animate-float text-4xl opacity-25 left-[30%] bottom-[20%]" style={{ animationDelay: '2.5s' }}>🌸</span>
            <span className="absolute animate-float text-2xl opacity-20 right-[15%] bottom-[35%]" style={{ animationDelay: '4s' }}>🌸</span>
          </>
        )}
        {theme.particleType === 'stars' && (
          <>
            <span className="absolute animate-float text-xl opacity-40 left-[15%] top-[10%]" style={{ animationDuration: '3s' }}>⭐</span>
            <span className="absolute animate-float text-sm opacity-30 right-[25%] top-[30%]" style={{ animationDuration: '4s', animationDelay: '1s' }}>✨</span>
            <span className="absolute animate-float text-lg opacity-40 left-[40%] bottom-[15%]" style={{ animationDuration: '5s', animationDelay: '2s' }}>⭐</span>
            <span className="absolute animate-float text-sm opacity-50 right-[10%] bottom-[25%]" style={{ animationDuration: '3.5s', animationDelay: '3s' }}>✨</span>
          </>
        )}
        {theme.particleType === 'bubbles' && (
          <>
            <span className="absolute animate-float text-4xl opacity-10 left-[12%] bottom-[10%]" style={{ animationDuration: '8s' }}>🫧</span>
            <span className="absolute animate-float text-2xl opacity-15 right-[18%] bottom-[40%]" style={{ animationDuration: '10s', animationDelay: '1.5s' }}>🫧</span>
            <span className="absolute animate-float text-3xl opacity-10 left-[35%] top-[20%]" style={{ animationDuration: '9s', animationDelay: '3s' }}>🫧</span>
            <span className="absolute animate-float text-xl opacity-20 right-[8%] top-[15%]" style={{ animationDuration: '7s', animationDelay: '4s' }}>🫧</span>
          </>
        )}
      </div>

      {/* Header bar / animated progress bar */}
      <div className="w-full max-w-md flex flex-col items-center pt-2 z-10">
        <h1 className="text-lg font-bold tracking-wide opacity-80" style={{ fontFamily: 'var(--font-playfair)' }}>
          LoveFlow
        </h1>
        {step === 'questions' && questions.length > 0 && (
          <div className="w-full mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-white/50">
              <span>Вопрос {currentQIndex + 1} из {questions.length}</span>
              <span style={{ color: theme.colors.primaryLight }}>{Math.round(((currentQIndex + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-white/5 border border-white/8 rounded-full h-2.5 p-0.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((currentQIndex + 1) / questions.length) * 100}%`,
                  background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryLight})`,
                  boxShadow: `0 0 10px ${theme.colors.primary}40`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main card panel */}
      <div className="w-full max-w-md flex-1 flex flex-col justify-center my-4 z-10 relative">
        {step === 'welcome' && (
          <div className="glass p-6 sm:p-8 rounded-[32px] text-center space-y-6 animate-scale-in"
               style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
            <div className="text-6xl animate-float select-none">{theme.emoji}</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
              Привет, {invitation.girl_name}!
            </h2>
            {invitation.welcome_message && (
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-light">
                {invitation.welcome_message}
              </p>
            )}
            {invitation.description && (
              <p className="text-xs sm:text-sm text-gray-400 font-light">
                {invitation.description}
              </p>
            )}
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-2xl text-sm font-bold transition-all duration-300 hover:scale-[1.02] shadow-lg cursor-pointer active-tap"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.buttonText,
                boxShadow: `0 8px 24px ${theme.colors.primary}50`,
              }}
            >
              Открыть приглашение ✨
            </button>
          </div>
        )}

        {step === 'questions' && currentQuestion && (
          <div className="glass p-6 sm:p-8 rounded-[32px] text-center space-y-5 animate-scale-in min-h-[380px] flex flex-col justify-between"
               style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
            
            <div className="space-y-4">
              {/* Header inside card with back button */}
              <div className="flex items-center justify-between w-full">
                {currentQIndex > 0 ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 text-[11px] font-bold transition-all opacity-70 hover:opacity-100 py-1.5 px-3 rounded-xl border border-white/10 bg-white/2 cursor-pointer active-tap"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    ← Назад
                  </button>
                ) : (
                  <div />
                )}
                <span className="text-[10px] uppercase tracking-wider font-bold text-white/30">Вопрос {currentQIndex + 1} из {questions.length}</span>
              </div>

              <div className="text-5xl animate-bounce pt-2" style={{ animationDuration: '2.5s' }}>
                {currentQuestion.emoji || '❓'}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {currentQuestion.text}
              </h2>
            </div>

            {/* Answer buttons container */}
            <div className="space-y-3 pt-4 relative">
              {currentQuestion.answers.map((ans, i) => {
                const isActive = previousSelected && previousSelected.answer_text === ans.text;
                
                if (ans.is_runaway) {
                  return (
                    <div key={ans.id || i} className="relative inline-block w-full">
                      {/* Speech Bubble above runaway button */}
                      {showSpeech && (
                        <div
                          className="absolute left-1/2 -translate-x-1/2 -top-12 z-30 px-3 py-1.5 rounded-2xl text-[11px] font-bold text-white shadow-xl animate-bubble-in text-center whitespace-nowrap"
                          style={{
                            background: '#0d0d17',
                            border: '1px solid rgba(255,255,255,0.1)',
                            transform: `translate(${runawayOffset.x - 70}px, ${runawayOffset.y}px)`
                          }}
                        >
                          {speechMessage}
                          {/* Triangle indicator */}
                          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-[#0d0d17]" />
                        </div>
                      )}

                      {/* Heart particles container */}
                      {particles.map(p => (
                        <span
                          key={p.id}
                          className="absolute text-sm pointer-events-none select-none animate-particle"
                          style={{
                            left: '50%',
                            top: '50%',
                            '--tx': `${p.tx}px`,
                            '--ty': `${p.ty}px`,
                            transform: `translate(${runawayOffset.x}px, ${runawayOffset.y}px)`
                          } as React.CSSProperties}
                        >
                          💖
                        </span>
                      ))}

                      <button
                        ref={runawayButtonRef}
                        onClick={() => handleAnswerSelect(ans, currentQuestion)}
                        onMouseEnter={handleRunawayMove}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          handleRunawayMove();
                        }}
                        className="w-full py-4 px-6 rounded-2xl text-xs sm:text-sm font-bold border text-center select-none cursor-pointer active-tap transition-all"
                        style={{
                          transform: `translate(${runawayOffset.x}px, ${runawayOffset.y}px)`,
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          borderColor: 'rgba(239, 68, 68, 0.3)',
                          color: '#f87171',
                          transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                      >
                        {ans.emoji} {ans.text || 'Нет'}
                      </button>
                    </div>
                  );
                }

                return (
                  <button
                    key={ans.id || i}
                    onClick={() => handleAnswerSelect(ans, currentQuestion)}
                    className="w-full py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 border text-left flex items-center justify-between cursor-pointer active-tap"
                    style={{
                      backgroundColor: isActive ? `${ans.color}35` : `${ans.color}15`,
                      borderColor: isActive ? ans.color : `${ans.color}40`,
                      color: '#ffffff',
                      boxShadow: isActive ? `0 0 15px ${ans.color}30` : 'none',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = `${ans.color}30`;
                      e.currentTarget.style.borderColor = ans.color;
                    }}
                    onMouseOut={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = `${ans.color}15`;
                        e.currentTarget.style.borderColor = `${ans.color}40`;
                      }
                    }}
                  >
                    <span>{ans.text}</span>
                    <span className="text-xl flex-shrink-0 ml-2">{ans.emoji}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 'completed' && (
          <div className="glass p-8 rounded-[32px] text-center space-y-6 animate-scale-in"
               style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
            <div className="relative inline-block my-4">
              <div className="text-7xl animate-heart-beat select-none">❤️</div>
              {/* Decorative floating hearts */}
              <span className="absolute -top-2 -right-2 text-xl animate-float">💖</span>
              <span className="absolute -bottom-2 -left-2 text-xl animate-float" style={{ animationDelay: '1.5s' }}>💕</span>
            </div>
            
            <h2 className="text-3xl font-extrabold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
              Спасибо!
            </h2>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-200 leading-relaxed font-light">
                Твои ответы уже готовы. Скопируй ссылку ниже и отправь её человеку, который создал это приглашение 😊
              </p>
            </div>
            
            <div className="space-y-3 pt-4">
              <button
                onClick={copyResultLink}
                className="w-full py-4 rounded-2xl text-sm font-bold transition-all duration-300 hover:scale-[1.02] active-tap shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                  color: theme.colors.buttonText,
                  boxShadow: `0 8px 24px ${theme.colors.primary}40`,
                }}
              >
                <span>{copied ? '✓ Ссылка скопирована!' : '🔗 Скопировать ссылку'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer disclaimer */}
      <div className="text-center pb-2 text-[10px] opacity-40 z-10">
        Премиум-приглашение LoveFlow.
      </div>
    </div>
  );
}
