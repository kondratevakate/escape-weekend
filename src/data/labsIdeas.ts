import { LabIdea } from '@/types/labs';

export const LABS_IDEAS: LabIdea[] = [
  {
    id: 'historical-podcasts',
    emoji: '🎙',
    category: 'content',
    title: {
      ru: 'Исторические подкасты',
      en: 'Historical podcasts',
    },
    description: {
      ru: '8-минутный нарратив про место, где ты сейчас или куда едешь — в стиле любимых подкастеров.',
      en: '8-minute audio narrative about where you are or going — in the voice of your favourite podcasters.',
    },
    goal: 50000,
    baseVotes: 47,
    basePledged: 4500,
    supportAmount: 500,
  },
  {
    id: 'ai-route',
    emoji: '🗺',
    category: 'ai',
    title: {
      ru: 'AI-подбор маршрута',
      en: 'AI route builder',
    },
    description: {
      ru: 'Опиши настроение, бюджет и срок — получи готовый маршрут с местами, логистикой и тайминг.',
      en: 'Describe mood, budget, dates — get a ready itinerary with places, logistics and timing.',
    },
    goal: 30000,
    baseVotes: 62,
    basePledged: 3500,
    supportAmount: 500,
  },
  {
    id: 'surprise-trip',
    emoji: '🎁',
    category: 'service',
    title: {
      ru: 'Поездка-сюрприз под ключ',
      en: 'Surprise trip, all-in-one',
    },
    description: {
      ru: 'Выбираешь даты и бюджет — AI собирает билеты, жильё и маршрут. Узнаёшь точку в день старта.',
      en: 'Pick dates and budget — AI books flights, stays and route. You learn the destination on departure day.',
    },
    goal: 100000,
    baseVotes: 31,
    basePledged: 9000,
    supportAmount: 1000,
  },
  {
    id: 'ai-concierge',
    emoji: '🤖',
    category: 'ai',
    title: {
      ru: 'AI-консьерж в Telegram',
      en: 'AI concierge in Telegram',
    },
    description: {
      ru: 'Диалог в боте: «куда пойти сейчас», «что съесть», «план на день» — с учётом гео и сезона.',
      en: 'Chat in the bot: "where now", "what to eat", "plan my day" — context-aware by geo and season.',
    },
    goal: 40000,
    baseVotes: 54,
    basePledged: 4000,
    supportAmount: 500,
  },
];
