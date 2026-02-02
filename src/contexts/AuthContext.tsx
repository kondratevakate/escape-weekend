import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type UserRole = 'tourist' | 'creator' | null;

interface User {
  email: string;
  role: UserRole;
  displayName?: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  setUserRole: (role: UserRole) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  showRoleSelector: boolean;
  setShowRoleSelector: (show: boolean) => void;
  requireAuth: (callback: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  const login = useCallback((email: string) => {
    setIsAuthenticated(true);
    setUser({ email, role: null });
    setShowLoginModal(false);
    // Show role selector after login
    setShowRoleSelector(true);
  }, []);

  const setUserRole = useCallback((role: UserRole) => {
    setUser(prev => prev ? { ...prev, role } : null);
    setShowRoleSelector(false);
    // Execute pending callback after role selection
    if (pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
    }
  }, [pendingCallback]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const requireAuth = useCallback((callback: () => void) => {
    if (isAuthenticated && user?.role) {
      callback();
    } else if (isAuthenticated && !user?.role) {
      setPendingCallback(() => callback);
      setShowRoleSelector(true);
    } else {
      setPendingCallback(() => callback);
      setShowLoginModal(true);
    }
  }, [isAuthenticated, user?.role]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      login,
      logout,
      setUserRole,
      showLoginModal,
      setShowLoginModal,
      showRoleSelector,
      setShowRoleSelector,
      requireAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
