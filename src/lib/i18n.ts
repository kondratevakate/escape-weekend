export type Language = 'ru' | 'en';

export const translations = {
  ru: {
    // Landing — currently not rendered on /. Kept for a future marketing landing route.
    // Voice rules: BRAND.md §Voice.2 "concrete, not flowery". Variant B active (peer authority).
    // Alternatives (swap headline + subheadline below):
    //   A) headline: 'Куда ехать в Мурманск — без турагентств и SEO-сайтов.'
    //      sub:      '120+ мест от тех, кто там был. Без AI-обзоров, без «топ-10», без партнёрок с тур-операторами. Гид по Мурманску — 1500₽, AI-помощник по маршрутам в комплекте.'
    //   C) headline: 'Мурманск, Хибины, Териберка — окно февраль–март, дороги ещё держат.'
    //      sub:      'Карта с честными предупреждениями о дорогах, сезонах и опасностях. Платный гид по Мурманску — 1500₽, AI-помощник по маршрутам в комплекте.'
    landing: {
      brand: 'Escape Weekend',
      headline: 'Карта Кольского от тех, кто там реально был.',
      subheadline: '120+ мест с честными комментариями: где автобусы уже всё затоптали, где связи нет 40 км, где можно увидеть китов без переплат. Гид по Мурманску — 1500₽, AI-планировщик в комплекте.',
      cta: 'Гид по Мурманску · 1500₽',
      ctaSecondary: 'Сначала открыть карту →',
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
      restaurant: 'Рестораны',
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
    
    // AI Sidebar — suggestions written in BRAND.md §Voice.2 voice (concrete questions
    // a real traveller would ask). Avoid generic "что посмотреть" — that's tour-operator speech.
    ai: {
      title: 'AI Помощник',
      placeholder: 'Спросите что-нибудь...',
      thinking: 'Думаю...',
      suggestions: [
        'Хибины за 2 дня без машины — реально?',
        'Сияние в феврале — где встать на ночь?',
        'Что брать в Териберку зимой?',
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
    
    // Trip Planner
    tripPlanner: {
      title: 'Планировщик маршрута',
      dates: 'Даты поездки',
      selectDates: 'Выберите даты',
      vehicle: 'Транспорт',
      interests: 'Интересы',
      placesAdded: 'Добавлено мест',
      generateAI: 'AI: Собери маршрут',
      generating: 'Генерирую...',
      credit: 'кредит',
      day: 'День',
      places: 'мест',
      dragHint: 'Перетащите места сюда',
      addPlace: 'Добавить',
      aiBuilt: 'AI собрал маршрут',
      tips: 'Рекомендации',
      accept: 'Принять',
      edit: 'Редактировать',
      selectDatesToStart: 'Выберите даты поездки',
      selectDatesHint: 'Выберите даты слева, чтобы начать планирование',
      routeAdded: 'Маршрут добавлен!',
    },
    
    // Legend
    legend: 'Легенда',
    
    // Loading
    loading: 'Загружаем карту...',
  },
  
  en: {
    // Landing — currently not rendered on /. Kept for a future marketing landing route.
    // BRAND.md §Voice.4: independent EN, not a translation of the RU above. Variant B (peer authority).
    landing: {
      brand: 'Escape Weekend',
      headline: 'A Kola map for people who plan their own trips.',
      subheadline: '120+ places with honest field notes — closed roads, no-signal zones, when the tour buses arrive. Murmansk guide 1500₽, AI trip-planner included.',
      cta: 'Get the Murmansk guide · 1500₽',
      ctaSecondary: 'Open the map first →',
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
      restaurant: 'Restaurants',
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
    // AI Sidebar — written independently (BRAND.md §Voice.4), not translated from RU.
    ai: {
      title: 'AI Assistant',
      placeholder: 'Ask me anything...',
      thinking: 'Thinking...',
      suggestions: [
        'Khibiny in 2 days without a car — realistic?',
        'Aurora in February — where to overnight?',
        'What to pack for Teriberka in winter?',
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
    
    // Trip Planner
    tripPlanner: {
      title: 'Trip Planner',
      dates: 'Trip dates',
      selectDates: 'Select dates',
      vehicle: 'Vehicle',
      interests: 'Interests',
      placesAdded: 'Places added',
      generateAI: 'AI: Build route',
      generating: 'Generating...',
      credit: 'credit',
      day: 'Day',
      places: 'places',
      dragHint: 'Drag places here',
      addPlace: 'Add place',
      aiBuilt: 'AI built your route',
      tips: 'Tips',
      accept: 'Accept',
      edit: 'Edit',
      selectDatesToStart: 'Select your trip dates',
      selectDatesHint: 'Pick dates on the left to start planning',
      routeAdded: 'Route added!',
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
