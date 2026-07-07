'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { Invitation, Question, Answer, ResultAnswer } from '@/types';
import { getTheme } from '@/lib/themes';

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
  const [runawayOffset, setRunawayOffset] = useState({ x: 0, y: 0 });
  const runawayButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    async function fetchInvitation() {
      try {
        const res = await fetch(`/api/invite/${token}`);
        if (!res.ok) {
          throw new Error('Invitation not found or inactive');
        }
        const data = await res.json();
        setInvitation(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
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
    // Generate a random translation vector
    const minMove = 100;
    const maxMove = 220;
    
    // Choose a random angle
    const angle = Math.random() * Math.PI * 2;
    const distance = minMove + Math.random() * (maxMove - minMove);
    
    let newX = Math.cos(angle) * distance;
    let newY = Math.sin(angle) * distance;

    // Boundary constraints to keep it reasonably within screen/viewport limits
    if (runawayButtonRef.current) {
      const rect = runawayButtonRef.current.getBoundingClientRect();
      const vw = typeof window !== 'undefined' ? window.innerWidth : 400;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
      
      // Calculate projected absolute position
      const absoluteX = rect.left + runawayOffset.x + newX;
      const absoluteY = rect.top + runawayOffset.y + newY;
      
      // Bounce off walls if it goes outside 10% margins of the viewport
      const margin = 80;
      if (absoluteX < margin || absoluteX > vw - margin - rect.width) {
        newX = -newX;
      }
      if (absoluteY < margin || absoluteY > vh - margin - rect.height) {
        newY = -newY;
      }
    }

    setRunawayOffset(prev => ({
      x: prev.x + newX,
      y: prev.y + newY
    }));
  };

  const handleAnswerSelect = async (ans: Answer, question: Question) => {
    if (ans.is_runaway) {
      handleRunawayMove();
      return;
    }

    // Reset runaway offsets for the next question
    setRunawayOffset({ x: 0, y: 0 });

    const newAnswer: ResultAnswer = {
      question_id: question.id,
      question_text: question.text,
      answer_text: ans.text,
      answer_emoji: ans.emoji,
      answer_color: ans.color,
    };

    const updatedAnswers = [...selectedAnswers, newAnswer];
    setSelectedAnswers(updatedAnswers);

    if (currentQIndex < (invitation?.questions?.length || 0) - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Completed, submit
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
          throw new Error(resultData.error || 'Failed to submit answers');
        }
      } catch (err: any) {
        alert(err.message || 'Submission failed, please try again.');
      }
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
          <p className="text-sm text-gray-400">Opening magical invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080810] text-white p-4">
        <div className="glass max-w-sm w-full p-8 rounded-2xl text-center space-y-4 border-red-500/20">
          <div className="text-4xl">🔒</div>
          <h2 className="text-lg font-bold text-red-400">Invitation Unavailable</h2>
          <p className="text-sm text-gray-400">
            This invitation has already been completed, deleted, or the link is incorrect.
          </p>
        </div>
      </div>
    );
  }

  const theme = getTheme(invitation.theme);
  const questions = invitation.questions || [];
  const currentQuestion = questions[currentQIndex];

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
      {/* Decorative Floating Elements / Particle Background simulator */}
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
            <span className="absolute animate-float text-xl opacity-20 right-[8%] top-[15%]" style={{ animationDuration: '7s', animationDelay: '4.5s' }}>🫧</span>
          </>
        )}
      </div>

      {/* Header bar / progress */}
      <div className="w-full max-w-md flex flex-col items-center pt-4 z-10">
        <h1 className="text-xl font-bold tracking-wide opacity-80" style={{ fontFamily: 'var(--font-playfair)' }}>
          LoveFlow
        </h1>
        {step === 'questions' && questions.length > 0 && (
          <div className="w-full mt-4 bg-white/5 border border-white/10 rounded-full h-2 p-0.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((currentQIndex + 1) / questions.length) * 100}%`,
                backgroundColor: theme.colors.primary,
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Main card panel */}
      <div className="w-full max-w-md flex-1 flex flex-col justify-center my-6 z-10">
        {step === 'welcome' && (
          <div className="glass p-8 rounded-3xl text-center space-y-6 animate-scale-in"
               style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
            <div className="text-6xl animate-float">{theme.emoji}</div>
            <h2 className="text-3xl font-extrabold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
              Hey {invitation.girl_name}!
            </h2>
            {invitation.welcome_message && (
              <p className="text-base text-gray-200 leading-relaxed font-light">
                {invitation.welcome_message}
              </p>
            )}
            {invitation.description && (
              <p className="text-sm text-gray-400 font-light">
                {invitation.description}
              </p>
            )}
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-2xl text-base font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.buttonText,
                boxShadow: `0 8px 24px ${theme.colors.primary}50`,
              }}
            >
              Open Invitation ✨
            </button>
          </div>
        )}

        {step === 'questions' && currentQuestion && (
          <div className="glass p-8 rounded-3xl text-center space-y-6 animate-scale-in min-h-[360px] flex flex-col justify-between"
               style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
            
            <div className="space-y-4">
              <div className="text-5xl animate-bounce" style={{ animationDuration: '2s' }}>
                {currentQuestion.emoji || '❓'}
              </div>
              <h2 className="text-2xl font-bold text-white leading-snug">
                {currentQuestion.text}
              </h2>
            </div>

            {/* Answer buttons container */}
            <div className="space-y-3 pt-6 relative">
              {currentQuestion.answers.map((ans, i) => {
                if (ans.is_runaway) {
                  return (
                    <button
                      key={ans.id || i}
                      ref={runawayButtonRef}
                      onClick={() => handleAnswerSelect(ans, currentQuestion)}
                      onMouseEnter={handleRunawayMove}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        handleRunawayMove();
                      }}
                      className="w-full py-4 px-6 rounded-2xl text-sm font-semibold transition-transform duration-200 ease-out border text-center select-none"
                      style={{
                        transform: `translate(${runawayOffset.x}px, ${runawayOffset.y}px)`,
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderColor: 'rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                      }}
                    >
                      {ans.emoji} {ans.text || 'No'}
                    </button>
                  );
                }

                return (
                  <button
                    key={ans.id || i}
                    onClick={() => handleAnswerSelect(ans, currentQuestion)}
                    className="w-full py-4 px-6 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] border text-left flex items-center justify-between"
                    style={{
                      backgroundColor: `${ans.color}15`,
                      borderColor: `${ans.color}40`,
                      color: '#ffffff',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = `${ans.color}35`;
                      e.currentTarget.style.borderColor = ans.color;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = `${ans.color}15`;
                      e.currentTarget.style.borderColor = `${ans.color}40`;
                    }}
                  >
                    <span>{ans.text}</span>
                    <span className="text-xl">{ans.emoji}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 'completed' && (
          <div className="glass p-8 rounded-3xl text-center space-y-6 animate-scale-in"
               style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
            <div className="text-6xl animate-float">❤️</div>
            <h2 className="text-3xl font-extrabold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
              Thank You!
            </h2>
            <p className="text-base text-gray-200 leading-relaxed font-light">
              {invitation.final_message || 'Your answers have been saved.'}
            </p>
            <p className="text-sm text-gray-400 font-light">
              Send the results link to your boyfriend so he can see your answers.
            </p>
            
            <div className="space-y-3 pt-4">
              <button
                onClick={copyResultLink}
                className="w-full py-4 rounded-2xl text-base font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.buttonText,
                  boxShadow: `0 8px 24px ${theme.colors.primary}50`,
                }}
              >
                <span>{copied ? '✓ Link Copied!' : '🔗 Copy Results Link'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer disclaimer */}
      <div className="text-center pb-4 text-xs opacity-40 z-10">
        LoveFlow premium invitation.
      </div>
    </div>
  );
}
