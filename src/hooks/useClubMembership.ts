import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/constants';

export type MembershipStatus = 'none' | 'pending' | 'member';

interface Application {
  status: MembershipStatus;
  name?: string;
  niches?: string[];
  whyJoin?: string;
  contact?: string;
  submittedAt?: string;
}

const INITIAL: Application = { status: 'none' };

/**
 * Club membership state (application status + saved form data).
 * Phase 1 stores everything in `localStorage`. Phase 2 will move to Cloud.
 *
 * Admin override: append `?club=member` to any URL to grant member status
 * (the curator uses this to share an "approved" link via Telegram).
 */
export const useClubMembership = () => {
  const [app, setApp] = useLocalStorage<Application>(STORAGE_KEYS.clubMembership, INITIAL);

  // URL override: ?club=member promotes the local user to a member.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('club') === 'member' && app.status !== 'member') {
      setApp((a) => ({ ...a, status: 'member' }));
    }
    // Run once on mount; intentionally ignore deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitApplication = (data: Omit<Application, 'status' | 'submittedAt'>) => {
    setApp({ ...data, status: 'pending', submittedAt: new Date().toISOString() });
  };

  const reset = () => setApp(INITIAL);

  return { app, status: app.status, submitApplication, reset };
};
