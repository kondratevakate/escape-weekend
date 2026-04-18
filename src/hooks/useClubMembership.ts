import { useState, useEffect } from 'react';

export type MembershipStatus = 'none' | 'pending' | 'member';

const KEY = 'club_membership_v1';

interface Application {
  status: MembershipStatus;
  name?: string;
  niches?: string[];
  whyJoin?: string;
  contact?: string;
  submittedAt?: string;
}

const load = (): Application => {
  try { return JSON.parse(localStorage.getItem(KEY) || '{"status":"none"}'); } catch { return { status: 'none' }; }
};

export const useClubMembership = () => {
  const [app, setApp] = useState<Application>(load);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(app)); }, [app]);

  // URL override (admin grants membership): ?club=member
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('club') === 'member' && app.status !== 'member') {
      setApp(a => ({ ...a, status: 'member' }));
    }
  }, []);

  const submitApplication = (data: Omit<Application, 'status' | 'submittedAt'>) => {
    setApp({ ...data, status: 'pending', submittedAt: new Date().toISOString() });
  };

  const reset = () => setApp({ status: 'none' });

  return { app, status: app.status, submitApplication, reset };
};
