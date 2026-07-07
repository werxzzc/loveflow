import { QuestionTemplate } from '@/types';

export const questionTemplates: QuestionTemplate[] = [
  {
    id: 'first-date',
    name: 'First Date',
    emoji: '❤️',
    description: 'Perfect for asking out on a first date',
    questions: [
      {
        text: 'How are you feeling right now? 🥺',
        emoji: '💭',
        answers: [
          { id: '', text: 'Excited!', emoji: '🤩', color: '#ff6b9d', is_runaway: false },
          { id: '', text: 'A little nervous', emoji: '😊', color: '#a78bfa', is_runaway: false },
          { id: '', text: 'Curious', emoji: '🤔', color: '#60a5fa', is_runaway: false },
          { id: '', text: 'Not interested', emoji: '🙅‍♀️', color: '#6b7280', is_runaway: true },
        ],
      },
      {
        text: 'Would you like to go on a first date with me? 🌹',
        emoji: '❤️',
        answers: [
          { id: '', text: 'Yes! Absolutely!', emoji: '💯', color: '#ec4899', is_runaway: false },
          { id: '', text: 'I think so...', emoji: '😌', color: '#8b5cf6', is_runaway: false },
          { id: '', text: 'Maybe sometime', emoji: '💭', color: '#6366f1', is_runaway: false },
          { id: '', text: 'No thanks', emoji: '😬', color: '#374151', is_runaway: true },
        ],
      },
      {
        text: 'What kind of date sounds most appealing? 🎯',
        emoji: '🌟',
        answers: [
          { id: '', text: 'Romantic dinner', emoji: '🍷', color: '#ef4444', is_runaway: false },
          { id: '', text: 'Walk in the park', emoji: '🌿', color: '#10b981', is_runaway: false },
          { id: '', text: 'Coffee & talk', emoji: '☕', color: '#f59e0b', is_runaway: false },
          { id: '', text: 'Cinema night', emoji: '🎬', color: '#3b82f6', is_runaway: false },
        ],
      },
      {
        text: 'When are you free? 📅',
        emoji: '🗓️',
        answers: [
          { id: '', text: 'This weekend!', emoji: '⚡', color: '#f59e0b', is_runaway: false },
          { id: '', text: 'Next week', emoji: '📅', color: '#06b6d4', is_runaway: false },
          { id: '', text: 'Let me check', emoji: '🤔', color: '#8b5cf6', is_runaway: false },
          { id: '', text: 'I\'m always busy', emoji: '😅', color: '#6b7280', is_runaway: true },
        ],
      },
    ],
  },
  {
    id: 'dinner',
    name: 'Dinner',
    emoji: '🍕',
    description: 'Invite her to a special dinner',
    questions: [
      {
        text: 'Will you have dinner with me tonight? 🍽️',
        emoji: '❤️',
        answers: [
          { id: '', text: 'Yes, I\'d love to!', emoji: '✨', color: '#ec4899', is_runaway: false },
          { id: '', text: 'Sounds wonderful', emoji: '😍', color: '#a78bfa', is_runaway: false },
          { id: '', text: 'Maybe...', emoji: '🤷‍♀️', color: '#60a5fa', is_runaway: false },
          { id: '', text: 'I already ate', emoji: '😅', color: '#6b7280', is_runaway: true },
        ],
      },
      {
        text: 'What cuisine do you prefer? 🌍',
        emoji: '🍴',
        answers: [
          { id: '', text: 'Italian 🍝', emoji: '🇮🇹', color: '#ef4444', is_runaway: false },
          { id: '', text: 'Japanese 🍱', emoji: '🇯🇵', color: '#f59e0b', is_runaway: false },
          { id: '', text: 'Mediterranean 🫒', emoji: '🌿', color: '#10b981', is_runaway: false },
          { id: '', text: 'Surprise me!', emoji: '🎲', color: '#8b5cf6', is_runaway: false },
        ],
      },
      {
        text: 'What atmosphere do you prefer? ✨',
        emoji: '🕯️',
        answers: [
          { id: '', text: 'Candlelight & romance', emoji: '🕯️', color: '#ef4444', is_runaway: false },
          { id: '', text: 'Cozy & casual', emoji: '🏡', color: '#f59e0b', is_runaway: false },
          { id: '', text: 'Trendy rooftop', emoji: '🌆', color: '#6366f1', is_runaway: false },
          { id: '', text: 'Anywhere with you', emoji: '💕', color: '#ec4899', is_runaway: false },
        ],
      },
      {
        text: 'How do you feel about tonight? 🌙',
        emoji: '💫',
        answers: [
          { id: '', text: 'I can\'t wait!', emoji: '🥰', color: '#ec4899', is_runaway: false },
          { id: '', text: 'Getting excited', emoji: '😊', color: '#a78bfa', is_runaway: false },
          { id: '', text: 'A bit nervous', emoji: '🦋', color: '#60a5fa', is_runaway: false },
          { id: '', text: 'Tell me more first', emoji: '🧐', color: '#6b7280', is_runaway: false },
        ],
      },
    ],
  },
  {
    id: 'cinema',
    name: 'Cinema',
    emoji: '🎬',
    description: 'A perfect movie night invitation',
    questions: [
      {
        text: 'Movie night? Just you and me? 🍿',
        emoji: '🎬',
        answers: [
          { id: '', text: 'Yes! I love movies!', emoji: '🎉', color: '#ec4899', is_runaway: false },
          { id: '', text: 'Sounds fun!', emoji: '😄', color: '#a78bfa', is_runaway: false },
          { id: '', text: 'Depends on the movie', emoji: '🤔', color: '#60a5fa', is_runaway: false },
          { id: '', text: 'I prefer Netflix at home', emoji: '😴', color: '#6b7280', is_runaway: true },
        ],
      },
      {
        text: 'What kind of movie are you in the mood for? 🎭',
        emoji: '🍿',
        answers: [
          { id: '', text: 'Romance 💕', emoji: '💕', color: '#ec4899', is_runaway: false },
          { id: '', text: 'Comedy 😂', emoji: '😂', color: '#f59e0b', is_runaway: false },
          { id: '', text: 'Thriller 😱', emoji: '😱', color: '#6366f1', is_runaway: false },
          { id: '', text: 'Action ⚡', emoji: '⚡', color: '#ef4444', is_runaway: false },
        ],
      },
      {
        text: 'What\'s your cinema must-have? 🛍️',
        emoji: '🍿',
        answers: [
          { id: '', text: 'Popcorn always', emoji: '🍿', color: '#f59e0b', is_runaway: false },
          { id: '', text: 'Nachos & dip', emoji: '🧀', color: '#ef4444', is_runaway: false },
          { id: '', text: 'Sweet candy', emoji: '🍬', color: '#ec4899', is_runaway: false },
          { id: '', text: 'Just the movie', emoji: '🎬', color: '#6b7280', is_runaway: false },
        ],
      },
      {
        text: 'One condition: I get to hold your hand 🤝',
        emoji: '🫶',
        answers: [
          { id: '', text: 'Deal! 🤝', emoji: '🤝', color: '#ec4899', is_runaway: false },
          { id: '', text: 'Of course 🥰', emoji: '🥰', color: '#a78bfa', is_runaway: false },
          { id: '', text: 'We\'ll see...', emoji: '😏', color: '#60a5fa', is_runaway: false },
          { id: '', text: 'No way!', emoji: '😤', color: '#6b7280', is_runaway: true },
        ],
      },
    ],
  },
  {
    id: 'coffee',
    name: 'Coffee',
    emoji: '☕',
    description: 'An intimate coffee date invitation',
    questions: [
      {
        text: 'Coffee with me? ☕',
        emoji: '☕',
        answers: [
          { id: '', text: 'Yes please!', emoji: '☕', color: '#c8956c', is_runaway: false },
          { id: '', text: 'Love coffee!', emoji: '❤️', color: '#ec4899', is_runaway: false },
          { id: '', text: 'I prefer tea...', emoji: '🍵', color: '#10b981', is_runaway: false },
          { id: '', text: 'I don\'t drink coffee', emoji: '😅', color: '#6b7280', is_runaway: true },
        ],
      },
      {
        text: 'What\'s your perfect coffee order? ☕',
        emoji: '🫖',
        answers: [
          { id: '', text: 'Vanilla latte', emoji: '🤍', color: '#c8956c', is_runaway: false },
          { id: '', text: 'Iced matcha', emoji: '💚', color: '#10b981', is_runaway: false },
          { id: '', text: 'Cappuccino', emoji: '☕', color: '#92400e', is_runaway: false },
          { id: '', text: 'Hot chocolate', emoji: '🍫', color: '#7c3aed', is_runaway: false },
        ],
      },
      {
        text: 'Cozy café or sunny terrace? 🌤️',
        emoji: '🏡',
        answers: [
          { id: '', text: 'Cozy inside', emoji: '🏡', color: '#f59e0b', is_runaway: false },
          { id: '', text: 'Sunny terrace', emoji: '☀️', color: '#f97316', is_runaway: false },
          { id: '', text: 'Hidden gem café', emoji: '✨', color: '#8b5cf6', is_runaway: false },
          { id: '', text: 'Anywhere with WiFi', emoji: '😄', color: '#60a5fa', is_runaway: false },
        ],
      },
      {
        text: 'What do you want to talk about? 💬',
        emoji: '💭',
        answers: [
          { id: '', text: 'Everything & nothing', emoji: '💬', color: '#ec4899', is_runaway: false },
          { id: '', text: 'Our dreams & plans', emoji: '🌟', color: '#a78bfa', is_runaway: false },
          { id: '', text: 'Just you', emoji: '👁️', color: '#ef4444', is_runaway: false },
          { id: '', text: 'I\'m not a talker', emoji: '🤐', color: '#6b7280', is_runaway: true },
        ],
      },
    ],
  },
  {
    id: 'evening-walk',
    name: 'Evening Walk',
    emoji: '🌅',
    description: 'A romantic evening stroll invitation',
    questions: [
      {
        text: 'Walk with me this evening? 🌅',
        emoji: '🌅',
        answers: [
          { id: '', text: 'Yes! Let\'s go!', emoji: '🚶‍♀️', color: '#f97316', is_runaway: false },
          { id: '', text: 'Sounds magical', emoji: '✨', color: '#a78bfa', is_runaway: false },
          { id: '', text: 'If the weather is nice', emoji: '🌤️', color: '#60a5fa', is_runaway: false },
          { id: '', text: 'I\'m staying in', emoji: '🛋️', color: '#6b7280', is_runaway: true },
        ],
      },
      {
        text: 'Where should we go? 🗺️',
        emoji: '📍',
        answers: [
          { id: '', text: 'By the river', emoji: '🌊', color: '#06b6d4', is_runaway: false },
          { id: '', text: 'Old city streets', emoji: '🏛️', color: '#f59e0b', is_runaway: false },
          { id: '', text: 'Park & nature', emoji: '🌿', color: '#10b981', is_runaway: false },
          { id: '', text: 'Anywhere you lead', emoji: '💕', color: '#ec4899', is_runaway: false },
        ],
      },
      {
        text: 'What time is perfect? 🕐',
        emoji: '⏰',
        answers: [
          { id: '', text: 'Sunset hour', emoji: '🌇', color: '#f97316', is_runaway: false },
          { id: '', text: 'Golden hour', emoji: '✨', color: '#f59e0b', is_runaway: false },
          { id: '', text: 'After dark', emoji: '🌙', color: '#6366f1', is_runaway: false },
          { id: '', text: 'Early evening', emoji: '🌤️', color: '#60a5fa', is_runaway: false },
        ],
      },
      {
        text: 'One last thing — can I be your company? 😊',
        emoji: '💫',
        answers: [
          { id: '', text: 'You\'re the best company!', emoji: '🥰', color: '#ec4899', is_runaway: false },
          { id: '', text: 'Obviously yes', emoji: '💯', color: '#a78bfa', is_runaway: false },
          { id: '', text: 'I was hoping you\'d ask', emoji: '😊', color: '#60a5fa', is_runaway: false },
          { id: '', text: 'I walk alone', emoji: '🚶‍♀️', color: '#6b7280', is_runaway: true },
        ],
      },
    ],
  },
];
