import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { UserSubmission } from '@/types/labs';

const STORAGE_KEY = 'wowatlas_labs_submissions_v1';

export function useLabsSubmissions() {
  const [submissions, setSubmissions] = useLocalStorage<UserSubmission[]>(STORAGE_KEY, []);

  const addSubmission = useCallback(
    (data: Omit<UserSubmission, 'id' | 'createdAt'>) => {
      const submission: UserSubmission = {
        ...data,
        id: `sub_${Date.now()}`,
        createdAt: Date.now(),
      };
      setSubmissions(prev => [submission, ...prev]);
      return submission;
    },
    [setSubmissions]
  );

  return { submissions, addSubmission };
}
