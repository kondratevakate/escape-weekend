import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '@/types/roles';
import { lookupToken, tokenGrantsRegion, BuyerToken } from '@/data/buyerTokens';
import { saveToken, getStoredToken, clearStoredToken } from '@/lib/tokenStore';

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
  /** Domain role read from `?role=` URL param. Orthogonal to accessMode. */
  role: UserRole;
  /** Buyer profile if accessMode === 'token' (validated against allowlist). */
  buyer: BuyerToken | null;
  /** True if the user can access the given region (or any if 'all'). */
  canAccessRegion: (region: string) => boolean;
  /** Forget the current token (logout). */
  signOut: () => void;
}

const defaultValue: UserContextType = {
  tgUser: null,
  accessToken: null,
  accessMode: 'guest',
  isTelegramEnv: false,
  role: 'user',
  buyer: null,
  canAccessRegion: () => false,
  signOut: () => {},
};

const UserContext = createContext<UserContextType>(defaultValue);

function getTokenFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}

function getRoleFromUrl(): UserRole {
  const params = new URLSearchParams(window.location.search);
  const role = params.get('role');
  if (role === 'creator' || role === 'admin') return role;
  return 'user';
}

function stripTokenFromUrl(): void {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has('token')) {
      url.searchParams.delete('token');
      window.history.replaceState({}, '', url.toString());
    }
  } catch {
    // ignore
  }
}

interface ResolvedAccess {
  tgUser: TgUser | null;
  isTelegramEnv: boolean;
  accessToken: string | null;
  accessMode: AccessMode;
  buyer: BuyerToken | null;
  role: UserRole;
}

function resolveAccess(): ResolvedAccess {
  const tgWebApp = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined;
  const tgUser = tgWebApp?.initDataUnsafe?.user ?? null;
  const isTelegramEnv = !!tgWebApp?.initData;

  if (tgWebApp) {
    try {
      tgWebApp.ready();
      tgWebApp.expand();
    } catch {
      // not in TG, ignore
    }
  }

  // Token resolution: URL param wins, then localStorage. Validate against allowlist.
  const urlToken = getTokenFromUrl();
  const storedToken = getStoredToken();
  const candidateToken = urlToken ?? storedToken;
  const buyer = lookupToken(candidateToken);

  // If URL had a token: persist if valid, clear if invalid (to avoid leaking it).
  if (urlToken) {
    if (buyer) {
      saveToken(urlToken);
    } else {
      clearStoredToken();
    }
    stripTokenFromUrl();
  } else if (storedToken && !buyer) {
    // Stored token is no longer in allowlist (revoked) — clean up.
    clearStoredToken();
  }

  let accessMode: AccessMode = 'guest';
  if (tgUser) {
    accessMode = 'telegram';
  } else if (buyer) {
    accessMode = 'token';
  } else if (import.meta.env.DEV) {
    accessMode = 'dev';
  }

  return {
    tgUser,
    isTelegramEnv,
    accessToken: buyer ? buyer.token : null,
    accessMode,
    buyer,
    role: getRoleFromUrl(),
  };
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ResolvedAccess>(() => resolveAccess());

  // Re-resolve on mount in case URL changes via SPA navigation that included a token.
  useEffect(() => {
    setState(resolveAccess());
  }, []);

  const canAccessRegion = (region: string): boolean => {
    if (state.accessMode === 'telegram' || state.accessMode === 'dev') return true;
    if (state.buyer) return tokenGrantsRegion(state.buyer, region);
    return false;
  };

  const signOut = () => {
    clearStoredToken();
    setState({
      tgUser: null,
      isTelegramEnv: false,
      accessToken: null,
      accessMode: 'guest',
      buyer: null,
      role: 'user',
    });
  };

  return (
    <UserContext.Provider
      value={{
        tgUser: state.tgUser,
        accessToken: state.accessToken,
        accessMode: state.accessMode,
        isTelegramEnv: state.isTelegramEnv,
        role: state.role,
        buyer: state.buyer,
        canAccessRegion,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export const useUserRole = () => useContext(UserContext).role;
