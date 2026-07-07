import { QuestionTemplate } from '@/types';

export const questionTemplates: QuestionTemplate[] = [
  {
    id: 'first-date',
    name: 'Первое свидание',
    emoji: '❤️',
    description: 'Идеально для приглашения на первое свидание',
    questions: [
      {
        text: 'Как ты себя чувствуешь прямо сейчас? 🥺',
        emoji: '💭',
        answers: [
          { id: '', text: 'В предвкушении! ', emoji: '🤩', color: '#ff6b9d', is_runaway: false },
          { id: '', text: 'Немного волнуюсь', emoji: '😊', color: '#a78bfa', is_runaway: false },
          { id: '', text: 'Любопытно', emoji: '🤔', color: '#60a5fa', is_runaway: false },
          { id: '', text: 'Мне это не интересно', emoji: '🙅‍♀️', color: '#6b7280', is_runaway: true },
        ],
      },
      {
        text: 'Пойдешь со мной на первое свидание? 🌹',
        emoji: '❤️',
        answers: [
          { id: '', text: 'Да! С удовольствием!', emoji: '💯', color: '#ec4899', is_runaway: false },
          { id: '', text: 'Думаю, да...', emoji: '😌', color: '#8b5cf6', is_runaway: false },
          { id: '', text: 'Может быть, как-нибудь', emoji: '💭', color: '#6366f1', is_runaway: false },
          { id: '', text: 'Нет, спасибо', emoji: '😬', color: '#374151', is_runaway: true },
        ],
      },
      {
        text: 'Какое свидание тебе ближе всего? 🎯',
        emoji: '🌟',
        answers: [
          { id: '', text: 'Романтический ужин', emoji: '🍷', color: '#ef4444', is_runaway: false },
          { id: '', text: 'Прогулка в парке', emoji: '🌿', color: '#10b981', is_runaway: false },
          { id: '', text: 'Кофе и разговоры', emoji: '☕', color: '#f59e0b', is_runaway: false },
          { id: '', text: 'Поход в кино', emoji: '🎬', color: '#3b82f6', is_runaway: false },
        ],
      },
      {
        text: 'Когда ты свободна? 📅',
        emoji: '🗓️',
        answers: [
          { id: '', text: 'В эти выходные!', emoji: '⚡', color: '#f59e0b', is_runaway: false },
          { id: '', text: 'На следующей неделе', emoji: '📅', color: '#06b6d4', is_runaway: false },
          { id: '', text: 'Надо проверить расписание', emoji: '🤔', color: '#8b5cf6', is_runaway: false },
          { id: '', text: 'Я всегда занята', emoji: '😅', color: '#6b7280', is_runaway: true },
        ],
      },
    ],
  },
  {
    id: 'dinner',
    name: 'Ужин',
    emoji: '🍕',
    description: 'Приглашение на особенный ужин',
    questions: [
      {
        text: 'Поужинаешь со мной сегодня? 🍽️',
        emoji: '❤️',
        answers: [
          { id: '', text: 'Да, с радостью!', emoji: '✨', color: '#ec4899', is_runaway: false },
          { id: '', text: 'Звучит чудесно', emoji: '😍', color: '#a78bfa', is_runaway: false },
          { id: '', text: 'Может быть...', emoji: '🤷‍♀️', color: '#60a5fa', is_runaway: false },
          { id: '', text: 'Я уже поела', emoji: '😅', color: '#6b7280', is_runaway: true },
        ],
      },
      {
        text: 'Какую кухню ты предпочитаешь? 🌍',
        emoji: '🍴',
        answers: [
          { id: '', text: 'Итальянскую ', emoji: '🍝', color: '#ef4444', is_runaway: false },
          { id: '', text: 'Японскую ', emoji: '🍱', color: '#f59e0b', is_runaway: false },
          { id: '', text: 'Средиземноморскую ', emoji: '🌿', color: '#10b981', is_runaway: false },
          { id: '', text: 'Удиви меня!', emoji: '🎲', color: '#8b5cf6', is_runaway: false },
        ],
      },
      {
        text: 'Какая атмосфера тебе больше нравится? ✨',
        emoji: '🕯️',
        answers: [
          { id: '', text: 'Свечи и романтика', emoji: '🕯️', color: '#ef4444', is_runaway: false },
          { id: '', text: 'Уютная и непринужденная', emoji: '🏡', color: '#f59e0b', is_runaway: false },
          { id: '', text: 'Модный ресторан на крыше', emoji: '🌆', color: '#6366f1', is_runaway: false },
          { id: '', text: 'Любое место, главное — с тобой', emoji: '💕', color: '#ec4899', is_runaway: false },
        ],
      },
      {
        text: 'Что думаешь по поводу сегодняшнего вечера? 🌙',
        emoji: '💫',
        answers: [
          { id: '', text: 'Не могу дождаться!', emoji: '🥰', color: '#ec4899', is_runaway: false },
          { id: '', text: 'Жду с нетерпением', emoji: '😊', color: '#a78bfa', is_runaway: false },
          { id: '', text: 'Немного волнуюсь', emoji: '🦋', color: '#60a5fa', is_runaway: false },
          { id: '', text: 'Сначала расскажи подробнее', emoji: '🧐', color: '#6b7280', is_runaway: false },
        ],
      },
    ],
  },
  {
    id: 'cinema',
    name: 'Кино',
    emoji: '🎬',
    description: 'Приглашение на идеальный киновечер',
    questions: [
      {
        text: 'Киновечер? Только ты и я? 🍿',
        emoji: '🎬',
        answers: [
          { id: '', text: 'Да! Обожаю кино!', emoji: '🎉', color: '#ec4899', is_runaway: false },
          { id: '', text: 'Звучит весело!', emoji: '😄', color: '#a78bfa', is_runaway: false },
          { id: '', text: 'Смотря какой фильм', emoji: '🤔', color: '#60a5fa', is_runaway: false },
          { id: '', text: 'Я лучше дома посмотрю', emoji: '😴', color: '#6b7280', is_runaway: true },
        ],
      },
      {
        text: 'Какое кино ты бы хотела посмотреть? 🎭',
        emoji: '🍿',
        answers: [
          { id: '', text: 'Мелодраму ', emoji: '💕', color: '#ec4899', is_runaway: false },
          { id: '', text: 'Комедию ', emoji: '😂', color: '#f59e0b', is_runaway: false },
          { id: '', text: 'Триллер ', emoji: '😱', color: '#6366f1', is_runaway: false },
          { id: '', text: 'Экшен ', emoji: '⚡', color: '#ef4444', is_runaway: false },
        ],
      },
      {
        text: 'Без чего не обойтись в кино? 🛍️',
        emoji: '🍿',
        answers: [
          { id: '', text: 'Конечно попкорн', emoji: '🍿', color: '#f59e0b', is_runaway: false },
          { id: '', text: 'Начос с соусом', emoji: '🧀', color: '#ef4444', is_runaway: false },
          { id: '', text: 'Сладкие мармеладки', emoji: '🍬', color: '#ec4899', is_runaway: false },
          { id: '', text: 'Главное — сам фильм', emoji: '🎬', color: '#6b7280', is_runaway: false },
        ],
      },
      {
        text: 'Одно условие: я буду держать тебя за руку 🤝',
        emoji: '🫶',
        answers: [
          { id: '', text: 'Договорились! ', emoji: '🤝', color: '#ec4899', is_runaway: false },
          { id: '', text: 'Конечно ', emoji: '🥰', color: '#a78bfa', is_runaway: false },
          { id: '', text: 'Посмотрим...', emoji: '😏', color: '#60a5fa', is_runaway: false },
          { id: '', text: 'Ни за что!', emoji: '😤', color: '#6b7280', is_runaway: true },
        ],
      },
    ],
  },
  {
    id: 'coffee',
    name: 'Кофе',
    emoji: '☕',
    description: 'Уютное приглашение на чашечку кофе',
    questions: [
      {
        text: 'Выпьем кофе вместе? ☕',
        emoji: '☕',
        answers: [
          { id: '', text: 'Да, с удовольствием!', emoji: '☕', color: '#c8956c', is_runaway: false },
          { id: '', text: 'Обожаю кофе!', emoji: '❤️', color: '#ec4899', is_runaway: false },
          { id: '', text: 'Я больше по чаю...', emoji: '🍵', color: '#10b981', is_runaway: false },
          { id: '', text: 'Я не пью кофе', emoji: '😅', color: '#6b7280', is_runaway: true },
        ],
      },
      {
        text: 'Каков твой идеальный заказ? ☕',
        emoji: '🫖',
        answers: [
          { id: '', text: 'Ванильный латте', emoji: '🤍', color: '#c8956c', is_runaway: false },
          { id: '', text: 'Айс матча', emoji: '💚', color: '#10b981', is_runaway: false },
          { id: '', text: 'Капучино', emoji: '☕', color: '#92400e', is_runaway: false },
          { id: '', text: 'Горячий шоколад', emoji: '🍫', color: '#7c3aed', is_runaway: false },
        ],
      },
      {
        text: 'Уютная кофейня или солнечная терраса? 🌤️',
        emoji: '🏡',
        answers: [
          { id: '', text: 'Внутри, где уютно', emoji: '🏡', color: '#f59e0b', is_runaway: false },
          { id: '', text: 'На солнечной террасе', emoji: '☀️', color: '#f97316', is_runaway: false },
          { id: '', text: 'Секретная кофейня "для своих"', emoji: '✨', color: '#8b5cf6', is_runaway: false },
          { id: '', text: 'Любое место, лишь бы был Wi-Fi', emoji: '😄', color: '#60a5fa', is_runaway: false },
        ],
      },
      {
        text: 'О чем поболтаем? 💬',
        emoji: '💭',
        answers: [
          { id: '', text: 'Обо всем на свете', emoji: '💬', color: '#ec4899', is_runaway: false },
          { id: '', text: 'О наших мечтах и планах', emoji: '🌟', color: '#a78bfa', is_runaway: false },
          { id: '', text: 'О тебе', emoji: '👁️', color: '#ef4444', is_runaway: false },
          { id: '', text: 'Я не очень люблю говорить', emoji: '🤐', color: '#6b7280', is_runaway: true },
        ],
      },
    ],
  },
  {
    id: 'evening-walk',
    name: 'Прогулка',
    emoji: '🌅',
    description: 'Романтическая вечерняя прогулка',
    questions: [
      {
        text: 'Погуляем сегодня вечером? 🌅',
        emoji: '🌅',
        answers: [
          { id: '', text: 'Да! Пойдем!', emoji: '🚶‍♀️', color: '#f97316', is_runaway: false },
          { id: '', text: 'Звучит волшебно', emoji: '✨', color: '#a78bfa', is_runaway: false },
          { id: '', text: 'Если погода будет хорошей', emoji: '🌤️', color: '#60a5fa', is_runaway: false },
          { id: '', text: 'Я останусь дома', emoji: '🛋️', color: '#6b7280', is_runaway: true },
        ],
      },
      {
        text: 'Куда направимся? 🗺️',
        emoji: '📍',
        answers: [
          { id: '', text: 'К набережной', emoji: '🌊', color: '#06b6d4', is_runaway: false },
          { id: '', text: 'По улочкам старого города', emoji: '🏛️', color: '#f59e0b', is_runaway: false },
          { id: '', text: 'В парк на природу', emoji: '🌿', color: '#10b981', is_runaway: false },
          { id: '', text: 'Куда поведешь, туда и пойду', emoji: '💕', color: '#ec4899', is_runaway: false },
        ],
      },
      {
        text: 'Какое время идеально? 🕐',
        emoji: '⏰',
        answers: [
          { id: '', text: 'На закате', emoji: '🌇', color: '#f97316', is_runaway: false },
          { id: '', text: 'В золотой час', emoji: '✨', color: '#f59e0b', is_runaway: false },
          { id: '', text: 'Когда стемнеет', emoji: '🌙', color: '#6366f1', is_runaway: false },
          { id: '', text: 'Ранним вечером', emoji: '🌤️', color: '#60a5fa', is_runaway: false },
        ],
      },
      {
        text: 'И последнее — разрешишь составить тебе компанию? 😊',
        emoji: '💫',
        answers: [
          { id: '', text: 'Ты лучшая компания!', emoji: '🥰', color: '#ec4899', is_runaway: false },
          { id: '', text: 'Конечно, да', emoji: '💯', color: '#a78bfa', is_runaway: false },
          { id: '', text: 'Я как раз надеялась, что ты спросишь', emoji: '😊', color: '#60a5fa', is_runaway: false },
          { id: '', text: 'Я гуляю одна', emoji: '🚶‍♀️', color: '#6b7280', is_runaway: true },
        ],
      },
    ],
  },
];
