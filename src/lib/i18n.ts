export type Language = 'ru' | 'en';

export const translations = {
  ru: {
    // Landing
    landing: {
      brand: 'Кольский',
      headline: 'Откройте красоту Кольского полуострова',
      subheadline: 'Курированная подборка лучших мест — от северного сияния до древних гор. Исследуйте, сохраняйте, делитесь.',
      cta: 'Открыть карту',
      noPlaces: 'Нет мест для отображения',
    },
    
    // Header
    explore: 'Исследуй Кольский',
    subtitle: 'Край северного сияния',
    places: 'мест',
    
    // Categories
    categories: {
      nature: 'Природа',
      hiking: 'Хайкинг',
      museum: 'Музеи',
      attraction: 'Достопримечательности',
      village: 'Сёла',
      city: 'Города',
      reserve: 'Заповедники',
      history: 'История саамов',
      unesco: 'UNESCO',
    },
    
    // History layer
    historyLayer: {
      title: 'Коренные народы',
      description: 'Территории 12 народов России',
      attribution: 'Данные: Интерактивный атлас КМНС',
    },
    
    // UNESCO layer
    unescoLayer: {
      title: 'UNESCO',
      description: '30+ объектов по всему миру',
      attribution: 'UNESCO World Heritage Centre',
    },
    
    // Actions
    actions: {
      reviews: 'Отзывы',
      googleMaps: 'Google Maps',
      close: 'Закрыть',
      like: 'Нравится',
      skip: 'Пропустить',
      explore: 'Исследовать',
      back: 'Назад',
      next: 'Далее',
    },
    
    // Favorites
    favorites: {
      title: 'Избранное',
      empty: 'Нет избранных мест',
      addHint: 'Свайпните вправо или нажмите ❤️',
      filter: 'Только избранное',
      count: 'избранных',
    },
    
    // Explore mode
    exploreMode: {
      title: 'Режим открытий',
      of: 'из',
      finish: 'Готово!',
      restart: 'Начать заново',
      allViewed: 'Вы просмотрели все места!',
    },
    
    // AI Sidebar
    ai: {
      title: 'AI Помощник',
      placeholder: 'Спросите что-нибудь...',
      thinking: 'Думаю...',
      suggestions: [
        'Что посмотреть за 3 дня?',
        'Где увидеть северное сияние?',
        'Как добраться до Териберки?',
      ],
    },
    
    // Place card
    place: {
      aiSummary: 'AI резюме отзывов',
    },
    
    // Social
    social: {
      likes: 'нравится',
      shares: 'поделились',
      share: 'Поделиться',
      copyLink: 'Скопировать',
      linkCopied: 'Ссылка скопирована!',
      more: 'Ещё...',
    },
    
    // Cookie consent
    cookies: {
      message: 'Мы используем cookies для улучшения работы сайта.',
      accept: 'Принять',
      decline: 'Отклонить',
      learnMore: 'Подробнее',
    },
    
    // Dashboard
    dashboard: {
      sources: 'Источники',
      chat: 'Чат',
      result: 'Результат',
      myRoute: 'Мой маршрут',
      statistics: 'Статистика',
      addSource: 'Добавить источник',
      createLayer: 'Создать слой',
      exportPdf: 'Экспорт в PDF',
      promoteLayer: 'Продвигать слой',
    },
    
    // Roles
    roles: {
      tourist: 'Турист',
      creator: 'Креатор',
      switchRole: 'Сменить роль',
      selectRole: 'Как вы хотите использовать WowAtlas?',
      canChangeAnytime: 'Вы можете изменить роль в любое время',
    },
    
    // Auth
    auth: {
      login: 'Войти',
      logout: 'Выйти',
      signup: 'Регистрация',
      email: 'Email',
      password: 'Пароль',
      forgotPassword: 'Забыли пароль?',
    },
    
    // User Lists
    userLists: {
      title: 'Мои списки',
      saveToList: 'Сохранить в список',
      createList: 'Создать список',
      listName: 'Название списка',
      create: 'Создать',
      wantToVisit: 'Хочу посетить',
      favorites: 'Избранное',
      places: 'мест',
    },
    
    // Resources
    resources: {
      title: 'Ресурсы',
      coffeeGuide: 'Гид по кофейням мира',
      rgo: 'Русское географическое общество',
    },
    
    // Legend
    legend: 'Легенда',
    
    // Loading
    loading: 'Загружаем карту...',
  },
  
  en: {
    // Landing
    landing: {
      brand: 'Kola',
      headline: 'Discover the beauty of Kola Peninsula',
      subheadline: 'A curated collection of the best places — from Northern Lights to ancient mountains. Explore, save, share.',
      cta: 'Open map',
      noPlaces: 'No places to display',
    },
    
    // Header
    explore: 'Explore Kola',
    subtitle: 'Land of Northern Lights',
    places: 'places',
    
    // Categories
    categories: {
      nature: 'Nature',
      hiking: 'Hiking',
      museum: 'Museums',
      attraction: 'Attractions',
      village: 'Villages',
      city: 'Cities',
      reserve: 'Reserves',
      history: 'Saami History',
      unesco: 'UNESCO',
    },
    
    // History layer
    historyLayer: {
      title: 'Indigenous Peoples',
      description: '12 peoples of Russia',
      attribution: 'Data: Indigenous Peoples Atlas',
    },
    
    // UNESCO layer
    unescoLayer: {
      title: 'UNESCO',
      description: '30+ sites worldwide',
      attribution: 'UNESCO World Heritage Centre',
    },
    
    // Actions
    actions: {
      reviews: 'Reviews',
      googleMaps: 'Google Maps',
      close: 'Close',
      like: 'Like',
      skip: 'Skip',
      explore: 'Explore',
      back: 'Back',
      next: 'Next',
    },
    
    // Favorites
    favorites: {
      title: 'Favorites',
      empty: 'No favorite places',
      addHint: 'Swipe right or tap ❤️',
      filter: 'Favorites only',
      count: 'favorites',
    },
    
    // Explore mode
    exploreMode: {
      title: 'Discovery Mode',
      of: 'of',
      finish: 'Done!',
      restart: 'Start over',
      allViewed: 'You\'ve viewed all places!',
    },
    
    // AI Sidebar
    ai: {
      title: 'AI Assistant',
      placeholder: 'Ask me anything...',
      thinking: 'Thinking...',
      suggestions: [
        'What to see in 3 days?',
        'Where to see Northern Lights?',
        'How to get to Teriberka?',
      ],
    },
    
    // Place card
    place: {
      aiSummary: 'AI review summary',
    },
    
    // Social
    social: {
      likes: 'likes',
      shares: 'shares',
      share: 'Share',
      copyLink: 'Copy link',
      linkCopied: 'Link copied!',
      more: 'More...',
    },
    
    // Cookie consent
    cookies: {
      message: 'We use cookies to improve your experience.',
      accept: 'Accept',
      decline: 'Decline',
      learnMore: 'Learn more',
    },
    
    // Dashboard
    dashboard: {
      sources: 'Sources',
      chat: 'Chat',
      result: 'Result',
      myRoute: 'My Route',
      statistics: 'Statistics',
      addSource: 'Add source',
      createLayer: 'Create layer',
      exportPdf: 'Export to PDF',
      promoteLayer: 'Promote Layer',
    },
    
    // Roles
    roles: {
      tourist: 'Tourist',
      creator: 'Creator',
      switchRole: 'Switch role',
      selectRole: 'How would you like to use WowAtlas?',
      canChangeAnytime: 'You can change your role anytime',
    },
    
    // Auth
    auth: {
      login: 'Login',
      logout: 'Logout',
      signup: 'Sign up',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot password?',
    },
    
    // User Lists
    userLists: {
      title: 'My Lists',
      saveToList: 'Save to list',
      createList: 'Create list',
      listName: 'List name',
      create: 'Create',
      wantToVisit: 'Want to visit',
      favorites: 'Favorites',
      places: 'places',
    },
    
    // Resources
    resources: {
      title: 'Resources',
      coffeeGuide: 'Global coffee shop guide',
      rgo: 'Russian Geographical Society',
    },
    
    // Legend
    legend: 'Legend',
    
    // Loading
    loading: 'Loading map...',
  },
} as const;

export type TranslationKey = keyof typeof translations.ru;

// Helper to get nested translation value
export const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) ?? path;
};
