import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface LabsState {
  /** Idea ids the user voted for. */
  votes: string[];
  /** Idea ids the user pledged to support (visual only). */
  pledges: string[];
}

const STORAGE_KEY = 'wowatlas_labs_votes_v1';

const EMPTY: LabsState = { votes: [], pledges: [] };

export function useLabsVotes() {
  const [state, setState] = useLocalStorage<LabsState>(STORAGE_KEY, EMPTY);

  const hasVoted = useCallback((id: string) => state.votes.includes(id), [state.votes]);
  const hasPledged = useCallback((id: string) => state.pledges.includes(id), [state.pledges]);

  const toggleVote = useCallback(
    (id: string) => {
      setState(prev => ({
        ...prev,
        votes: prev.votes.includes(id)
          ? prev.votes.filter(v => v !== id)
          : [...prev.votes, id],
      }));
    },
    [setState]
  );

  const markPledged = useCallback(
    (id: string) => {
      setState(prev =>
        prev.pledges.includes(id)
          ? prev
          : { ...prev, pledges: [...prev.pledges, id] }
      );
    },
    [setState]
  );

  return { state, hasVoted, hasPledged, toggleVote, markPledged };
}
