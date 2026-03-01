import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TgUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

type AccessMode = 'telegram' | 'token' | 'dev' | 'guest';

interface UserContextType {
  tgUser: TgUser | null;
  accessToken: string | null;
  accessMode: AccessMode;
  isTelegramEnv: boolean;
}

const UserContext = createContext<UserContextType>({
  tgUser: null,
  accessToken: null,
  accessMode: 'guest',
  isTelegramEnv: false,
});

function getTokenFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<UserContextType>(() => {
    const tgWebApp = window.Telegram?.WebApp;
    const tgUser = tgWebApp?.initDataUnsafe?.user ?? null;
    const isTelegramEnv = !!tgWebApp?.initData;
    const accessToken = getTokenFromUrl();

    // Initialize Telegram WebApp if available
    if (tgWebApp) {
      try {
        tgWebApp.ready();
        tgWebApp.expand();
      } catch {}
    }

    let accessMode: AccessMode = 'guest';
    if (tgUser) {
      accessMode = 'telegram';
    } else if (accessToken) {
      accessMode = 'token';
    } else if (import.meta.env.DEV) {
      accessMode = 'dev';
    }
    // Guest mode: everyone can view the map and content

    return { tgUser, accessToken, accessMode, isTelegramEnv };
  });

  return (
    <UserContext.Provider value={state}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
