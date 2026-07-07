import { Question, Answer } from '@/types';

export interface LibraryQuestion {
  id: string;
  category: string;
  text: string;
  emoji: string;
  answers: Omit<Answer, 'id'>[];
}

export interface LibraryCategory {
  id: string;
  name: string;
  emoji: string;
}

export const libraryCategories: LibraryCategory[] = [
  { id: 'romance', name: 'Романтика', emoji: '❤️' },
  { id: 'food', name: 'Еда', emoji: '🍕' },
  { id: 'coffee', name: 'Кофе', emoji: '☕' },
  { id: 'entertainment', name: 'Развлечения', emoji: '🎬' },
  { id: 'evening', name: 'Вечер', emoji: '🌇' },
  { id: 'transportation', name: 'Транспорт', emoji: '🚗' },
  { id: 'meeting', name: 'Встреча', emoji: '📍' },
  { id: 'time', name: 'Время', emoji: '🕒' },
  { id: 'surprises', name: 'Сюрпризы', emoji: '🎁' },
  { id: 'fun', name: 'Веселье', emoji: '😄' },
  { id: 'music', name: 'Музыка', emoji: '🎵' },
  { id: 'memories', name: 'Воспоминания', emoji: '📸' }
];

export const libraryQuestions: LibraryQuestion[] = [
  // ❤️ Romance
  {
    id: 'rom-1',
    category: 'romance',
    text: 'Любишь приятные сюрпризы? 🥺',
    emoji: '🎁',
    answers: [
      { text: 'Да, безумно!', emoji: '🥰', color: '#ff6b9d', is_runaway: false },
      { text: 'Смотря какие...', emoji: '😏', color: '#a78bfa', is_runaway: false },
      { text: 'Только если от тебя', emoji: '😳', color: '#60a5fa', is_runaway: false },
      { text: 'Не люблю', emoji: '🙅‍♀️', color: '#6b7280', is_runaway: true },
    ]
  },
  {
    id: 'rom-2',
    category: 'romance',
    text: 'Могу я приготовить для тебя кое-что особенное? ✨',
    emoji: '💫',
    answers: [
      { text: 'Да, я буду ждать!', emoji: '😍', color: '#ec4899', is_runaway: false },
      { text: 'Конечно, заинтриговал', emoji: '😊', color: '#8b5cf6', is_runaway: false },
      { text: 'Удиви меня', emoji: '✨', color: '#6366f1', is_runaway: false },
      { text: 'Не стоит', emoji: '🙅‍♀️', color: '#374151', is_runaway: true },
    ]
  },
  {
    id: 'rom-3',
    category: 'romance',
    text: 'Будем сегодня держаться за руки? 🤝',
    emoji: '🤝',
    answers: [
      { text: 'Обязательно!', emoji: '🥰', color: '#ef4444', is_runaway: false },
      { text: 'Если заслужишь', emoji: '😜', color: '#f59e0b', is_runaway: false },
      { text: 'Посмотрим...', emoji: '😏', color: '#10b981', is_runaway: false },
      { text: 'Ни за что!', emoji: '😤', color: '#6b7280', is_runaway: true },
    ]
  },
  {
    id: 'rom-4',
    category: 'romance',
    text: 'Готова провести этот вечер вместе? 🌙',
    emoji: '💕',
    answers: [
      { text: 'Да, поскорее бы!', emoji: '🥰', color: '#ec4899', is_runaway: false },
      { text: 'С удовольствием', emoji: '😊', color: '#a78bfa', is_runaway: false },
      { text: 'Уже собираюсь', emoji: '💄', color: '#60a5fa', is_runaway: false },
      { text: 'Я занята', emoji: '🙅‍♀️', color: '#6b7280', is_runaway: true },
    ]
  },
  {
    id: 'rom-5',
    category: 'romance',
    text: 'Можно украсть у тебя одну улыбку? 😊',
    emoji: '👁️',
    answers: [
      { text: 'Да, дарю!', emoji: '😊', color: '#f59e0b', is_runaway: false },
      { text: 'Я уже улыбаюсь', emoji: '🥰', color: '#06b6d4', is_runaway: false },
      { text: 'Только взамен на твою', emoji: '😳', color: '#8b5cf6', is_runaway: false },
      { text: 'Нет', emoji: '🙅‍♀️', color: '#6b7280', is_runaway: true },
    ]
  },

  // 🍕 Food
  {
    id: 'food-1',
    category: 'food',
    text: 'Что бы ты хотела попробовать сегодня? 🍽️',
    emoji: '🍴',
    answers: [
      { text: 'Итальянскую пасту', emoji: '🍝', color: '#ef4444', is_runaway: false },
      { text: 'Свежие роллы', emoji: '🍣', color: '#f59e0b', is_runaway: false },
      { text: 'Сочные бургеры', emoji: '🍔', color: '#10b981', is_runaway: false },
      { text: 'Что-то легкое/салат', emoji: '🥗', color: '#8b5cf6', is_runaway: false },
    ]
  },
  {
    id: 'food-2',
    category: 'food',
    text: 'Какую кухню ты предпочитаешь? 🌍',
    emoji: '🍝',
    answers: [
      { text: 'Итальянскую 🇮🇹', emoji: '🍝', color: '#ef4444', is_runaway: false },
      { text: 'Японскую 🇯🇵', emoji: '🍱', color: '#f59e0b', is_runaway: false },
      { text: 'Грузинскую 🇬🇪', emoji: '🍷', color: '#10b981', is_runaway: false },
      { text: 'Секрет (увидишь!)', emoji: '🤫', color: '#8b5cf6', is_runaway: false },
    ]
  },
  {
    id: 'food-3',
    category: 'food',
    text: 'Пицца или Суши? 🍕🍣',
    emoji: '🍕',
    answers: [
      { text: 'Пицца, конечно!', emoji: '🍕', color: '#f97316', is_runaway: false },
      { text: 'Определенно суши!', emoji: '🍣', color: '#ef4444', is_runaway: false },
      { text: 'И то, и другое!', emoji: '🤩', color: '#ec4899', is_runaway: false },
      { text: 'Я на диете', emoji: '🤐', color: '#6b7280', is_runaway: true },
    ]
  },
  {
    id: 'food-4',
    category: 'food',
    text: 'Оставим место для десерта? 🍰',
    emoji: '🍰',
    answers: [
      { text: 'Да, обязательно!', emoji: '🍰', color: '#ec4899', is_runaway: false },
      { text: 'Нежное мороженое', emoji: '🍦', color: '#a78bfa', is_runaway: false },
      { text: 'Только если фрукты', emoji: '🍓', color: '#60a5fa', is_runaway: false },
      { text: 'Нет, я не ем сладкое', emoji: '🙅‍♀️', color: '#6b7280', is_runaway: true },
    ]
  },

  // ☕ Coffee
  {
    id: 'cof-1',
    category: 'coffee',
    text: 'Какой напиток ты выберешь для душевного разговора? ☕',
    emoji: '☕',
    answers: [
      { text: 'Нежный латте', emoji: '☕', color: '#c8956c', is_runaway: false },
      { text: 'Бодрящий капучино', emoji: '🥛', color: '#a78bfa', is_runaway: false },
      { text: 'Японскую матчу', emoji: '🍵', color: '#10b981', is_runaway: false },
      { text: 'Ароматный чай', emoji: '🫖', color: '#f59e0b', is_runaway: false },
    ]
  },
  {
    id: 'cof-2',
    category: 'coffee',
    text: 'Кофе или Чай? ☕🫖',
    emoji: '🫖',
    answers: [
      { text: 'Кофе — моя любовь', emoji: '☕', color: '#c8956c', is_runaway: false },
      { text: 'Ароматный чай', emoji: '🫖', color: '#10b981', is_runaway: false },
      { text: 'Горячий шоколад', emoji: '🍫', color: '#7c3aed', is_runaway: false },
      { text: 'Просто воду', emoji: '💧', color: '#60a5fa', is_runaway: false },
    ]
  },
  {
    id: 'cof-3',
    category: 'coffee',
    text: 'Сладкий или крепкий кофе? ☕',
    emoji: '☕',
    answers: [
      { text: 'Сладкий и нежный', emoji: '🍨', color: '#c8956c', is_runaway: false },
      { text: 'Крепкий и бодрящий', emoji: '☕', color: '#8b5e3c', is_runaway: false },
      { text: 'Без сахара, черный', emoji: '🖤', color: '#374151', is_runaway: false },
      { text: 'Я вообще не пью кофе', emoji: '🙅‍♀️', color: '#6b7280', is_runaway: true },
    ]
  },

  // 🎬 Entertainment
  {
    id: 'ent-1',
    category: 'entertainment',
    text: 'Кино или Боулинг? 🎬🎳',
    emoji: '🎪',
    answers: [
      { text: 'Кинотеатр', emoji: '🎬', color: '#3b82f6', is_runaway: false },
      { text: 'Активный боулинг', emoji: '🎳', color: '#10b981', is_runaway: false },
      { text: 'Давай устроим оба!', emoji: '🎪', color: '#ec4899', is_runaway: false },
      { text: 'Ни то, ни другое', emoji: '🤷‍♀️', color: '#6b7280', is_runaway: true },
    ]
  },
  {
    id: 'ent-2',
    category: 'entertainment',
    text: 'Какой жанр фильмов тебе ближе всего? 🎭',
    emoji: '🍿',
    answers: [
      { text: 'Мелодрамы и романтика', emoji: '💕', color: '#ec4899', is_runaway: false },
      { text: 'Комедии (люблю смеяться)', emoji: '😂', color: '#f59e0b', is_runaway: false },
      { text: 'Ужасы (чтобы обняться)', emoji: '😱', color: '#6366f1', is_runaway: false },
      { text: 'Захватывающий экшен', emoji: '⚡', color: '#ef4444', is_runaway: false },
    ]
  },
  {
    id: 'ent-3',
    category: 'entertainment',
    text: 'Тихая прогулка или парк аттракционов? 🎡',
    emoji: '🌳',
    answers: [
      { text: 'Прогулка в тишине', emoji: '🌳', color: '#10b981', is_runaway: false },
      { text: 'Парк аттракционов!', emoji: '🎡', color: '#f59e0b', is_runaway: false },
      { text: 'Попкорн и карусели', emoji: '🎪', color: '#ec4899', is_runaway: false },
      { text: 'Остаться дома', emoji: '🛋️', color: '#6b7280', is_runaway: true },
    ]
  },

  // 🌇 Evening
  {
    id: 'eve-1',
    category: 'evening',
    text: 'Какое завершение вечера ты бы выбрала? 🌇',
    emoji: '🌇',
    answers: [
      { text: 'Прогулка под звездами', emoji: '🌌', color: '#a78bfa', is_runaway: false },
      { text: 'Уютный вечер у камина', emoji: '🔥', color: '#f97316', is_runaway: false },
      { text: 'Вкусный чай на террасе', emoji: '🍵', color: '#10b981', is_runaway: false },
      { text: 'Сразу спать', emoji: '😴', color: '#6b7280', is_runaway: true },
    ]
  },

  // 🚗 Transportation
  {
    id: 'tra-1',
    category: 'transportation',
    text: 'Как мы доберемся до места? 🚗',
    emoji: '🚗',
    answers: [
      { text: 'Поедем на машине', emoji: '🚗', color: '#3b82f6', is_runaway: false },
      { text: 'Прогуляемся пешком', emoji: '🚶‍♀️', color: '#10b981', is_runaway: false },
      { text: 'Возьмем быстрое такси', emoji: '🚕', color: '#f59e0b', is_runaway: false },
      { text: 'Покатаемся на самокатах!', emoji: '🛴', color: '#06b6d4', is_runaway: false },
    ]
  },
  {
    id: 'tra-2',
    category: 'transportation',
    text: 'Заехать за тобой сегодня? 🚗',
    emoji: '📍',
    answers: [
      { text: 'Да, было бы здорово!', emoji: '🥰', color: '#ec4899', is_runaway: false },
      { text: 'Встретимся сразу там', emoji: '📍', color: '#a78bfa', is_runaway: false },
      { text: 'Я напишу адрес позже', emoji: '💬', color: '#60a5fa', is_runaway: false },
      { text: 'Я сама доеду', emoji: '🚙', color: '#6b7280', is_runaway: true },
    ]
  },
  {
    id: 'tra-3',
    category: 'transportation',
    text: 'Такси или поедем на своей машине? 🚕',
    emoji: '🚕',
    answers: [
      { text: 'Закажем комфортное такси', emoji: '🚕', color: '#f59e0b', is_runaway: false },
      { text: 'Поедем на машине', emoji: '🚗', color: '#3b82f6', is_runaway: false },
      { text: 'Пешком гораздо романтичнее', emoji: '🚶‍♀️', color: '#ec4899', is_runaway: false },
      { text: 'Никуда не поеду', emoji: '🤷‍♀️', color: '#6b7280', is_runaway: true },
    ]
  },

  // 📍 Meeting
  {
    id: 'mee-1',
    category: 'meeting',
    text: 'Откуда тебя забрать сегодня? 🏡',
    emoji: '🏡',
    answers: [
      { text: 'Забери меня из дома', emoji: '🏡', color: '#10b981', is_runaway: false },
      { text: 'С работы/учебы', emoji: '🏫', color: '#f59e0b', is_runaway: false },
      { text: 'Давай встретимся в центре', emoji: '📍', color: '#3b82f6', is_runaway: false },
      { text: 'Я буду на набережной', emoji: '🌊', color: '#06b6d4', is_runaway: false },
    ]
  },
  {
    id: 'mee-2',
    category: 'meeting',
    text: 'Где нам будет удобнее всего встретиться? 📍',
    emoji: '📍',
    answers: [
      { text: 'В самом центре города', emoji: '🏛️', color: '#3b82f6', is_runaway: false },
      { text: 'У главного входа в парк', emoji: '🌳', color: '#10b981', is_runaway: false },
      { text: 'В нашей любимой кофейне', emoji: '☕', color: '#c8956c', is_runaway: false },
      { text: 'Напишу в Telegram', emoji: '💬', color: '#60a5fa', is_runaway: false },
    ]
  },

  // 🕒 Time
  {
    id: 'tim-1',
    category: 'time',
    text: 'В какое время тебе удобнее встретиться? 🕕',
    emoji: '🕒',
    answers: [
      { text: 'В 18:00 вечером', emoji: '🕕', color: '#f59e0b', is_runaway: false },
      { text: 'Около 19:00', emoji: '🕖', color: '#f97316', is_runaway: false },
      { text: 'Позже, к 20:00', emoji: '🕗', color: '#a78bfa', is_runaway: false },
      { text: 'Давай спишемся в чате', emoji: '💬', color: '#60a5fa', is_runaway: false },
    ]
  },

  // 🎁 Surprises
  {
    id: 'sur-1',
    category: 'surprises',
    text: 'Ты любишь приятные сюрпризы? 🎁',
    emoji: '🎁',
    answers: [
      { text: 'Обожаю их!', emoji: '🎁', color: '#ec4899', is_runaway: false },
      { text: 'Смотря какие именно', emoji: '🤫', color: '#a78bfa', is_runaway: false },
      { text: 'Главное, чтобы не пугающие', emoji: '😅', color: '#60a5fa', is_runaway: false },
      { text: 'Не люблю сюрпризы', emoji: '🙅‍♀️', color: '#6b7280', is_runaway: true },
    ]
  },
  {
    id: 'sur-2',
    category: 'surprises',
    text: 'Можно я подготовлю для тебя кое-что особенное? ✨',
    emoji: '✨',
    answers: [
      { text: 'Да, я очень жду!', emoji: '✨', color: '#ec4899', is_runaway: false },
      { text: 'Заинтриговал, давай', emoji: '😊', color: '#a78bfa', is_runaway: false },
      { text: 'Пусть это будет тайной', emoji: '🤫', color: '#60a5fa', is_runaway: false },
      { text: 'Не надо', emoji: '🙅‍♀️', color: '#6b7280', is_runaway: true },
    ]
  },

  // 😄 Fun
  {
    id: 'fun-1',
    category: 'fun',
    text: 'Кто сегодня оплачивает наш вечер? 😄',
    emoji: '💸',
    answers: [
      { text: 'Конечно же ты!', emoji: '💸', color: '#ec4899', is_runaway: false },
      { text: 'Поделим пополам', emoji: '🤝', color: '#a78bfa', is_runaway: false },
      { text: 'Сегодня угощаю я!', emoji: '💳', color: '#10b981', is_runaway: true }, // runaway check
      { text: 'Давай найдем клад', emoji: '🪙', color: '#f59e0b', is_runaway: false },
    ]
  },
  {
    id: 'fun-2',
    category: 'fun',
    text: 'Обещаешь смеяться над моими шутками? 😜',
    emoji: '😂',
    answers: [
      { text: 'Даже если они плоские!', emoji: '😂', color: '#ec4899', is_runaway: false },
      { text: 'Только если они смешные', emoji: '😜', color: '#f59e0b', is_runaway: false },
      { text: 'Буду улыбаться', emoji: '😊', color: '#60a5fa', is_runaway: false },
      { text: 'Буду молчать', emoji: '🤐', color: '#6b7280', is_runaway: true },
    ]
  },
  {
    id: 'fun-3',
    category: 'fun',
    text: 'Будем делать много совместных фото? 📸',
    emoji: '📸',
    answers: [
      { text: 'Сделаем миллион кадров!', emoji: '📸', color: '#ec4899', is_runaway: false },
      { text: 'Только пару селфи', emoji: '🤳', color: '#a78bfa', is_runaway: false },
      { text: 'Давай без телефонов сегодня', emoji: '📵', color: '#10b981', is_runaway: false },
      { text: 'Ни одного фото!', emoji: '🙅‍♀️', color: '#6b7280', is_runaway: true },
    ]
  },

  // 🎵 Music
  {
    id: 'mus-1',
    category: 'music',
    text: 'Что мы включим в колонках в дороге? 🎵',
    emoji: '🎧',
    answers: [
      { text: 'Романтичный плейлист', emoji: '💕', color: '#ec4899', is_runaway: false },
      { text: 'Громкие поп-хиты', emoji: '🎵', color: '#a78bfa', is_runaway: false },
      { text: 'Любимую рок-музыку', emoji: '🤘', color: '#ef4444', is_runaway: false },
      { text: 'На твой выбор', emoji: '🎧', color: '#10b981', is_runaway: false },
    ]
  },
  {
    id: 'mus-2',
    category: 'music',
    text: 'Какой музыкальный жанр тебе ближе? 🎵',
    emoji: '🎤',
    answers: [
      { text: 'Поп-музыка', emoji: '🎤', color: '#ec4899', is_runaway: false },
      { text: 'Душевный инди-рок', emoji: '🎸', color: '#a78bfa', is_runaway: false },
      { text: 'Спокойная классика', emoji: '🎹', color: '#10b981', is_runaway: false },
      { text: 'Энергичный хаус/дэнс', emoji: '⚡', color: '#06b6d4', is_runaway: false },
    ]
  },

  // 📸 Memories
  {
    id: 'mem-1',
    category: 'memories',
    text: 'Сделаем совместное фото в рамку? 📸',
    emoji: '📸',
    answers: [
      { text: 'Да, обязательно!', emoji: '📸', color: '#ec4899', is_runaway: false },
      { text: 'Конечно селфи', emoji: '🤳', color: '#a78bfa', is_runaway: false },
      { text: 'Просто запомним момент', emoji: '👁️', color: '#10b981', is_runaway: false },
      { text: 'Я не люблю фото', emoji: '🙅‍♀️', color: '#6b7280', is_runaway: true },
    ]
  },
  {
    id: 'mem-2',
    category: 'memories',
    text: 'Хочешь запомнить этот вечер навсегда? 🥺',
    emoji: '✨',
    answers: [
      { text: 'Очень хочу!', emoji: '💕', color: '#ec4899', is_runaway: false },
      { text: 'Главное провести его вместе', emoji: '🥰', color: '#a78bfa', is_runaway: false },
      { text: 'Посмотрим, как он пройдет', emoji: '😜', color: '#60a5fa', is_runaway: false },
      { text: 'Мне всё равно', emoji: '🤷‍♀️', color: '#6b7280', is_runaway: true },
    ]
  }
];
