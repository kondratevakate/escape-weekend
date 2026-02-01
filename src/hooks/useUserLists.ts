import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'kola_user_lists';

export interface UserList {
  id: string;
  name: string;
  emoji: string;
  placeIds: string[];
  createdAt: number;
}

const DEFAULT_LISTS: UserList[] = [
  {
    id: 'want_to_visit',
    name: 'Хочу посетить',
    emoji: '🏔️',
    placeIds: [],
    createdAt: Date.now(),
  },
  {
    id: 'favorites',
    name: 'Избранное',
    emoji: '⭐',
    placeIds: [],
    createdAt: Date.now(),
  },
];

export const useUserLists = () => {
  const [lists, setLists] = useState<UserList[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Initialize with default lists
      return DEFAULT_LISTS;
    } catch {
      return DEFAULT_LISTS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    } catch (e) {
      console.error('Failed to save user lists:', e);
    }
  }, [lists]);

  const createList = useCallback((name: string, emoji: string): string => {
    const id = `list_${Date.now()}`;
    const newList: UserList = {
      id,
      name,
      emoji,
      placeIds: [],
      createdAt: Date.now(),
    };
    setLists(prev => [...prev, newList]);
    return id;
  }, []);

  const deleteList = useCallback((id: string) => {
    // Prevent deleting default lists
    if (id === 'want_to_visit' || id === 'favorites') return;
    setLists(prev => prev.filter(list => list.id !== id));
  }, []);

  const addToList = useCallback((listId: string, placeId: string) => {
    setLists(prev => prev.map(list => {
      if (list.id === listId && !list.placeIds.includes(placeId)) {
        return { ...list, placeIds: [...list.placeIds, placeId] };
      }
      return list;
    }));
  }, []);

  const removeFromList = useCallback((listId: string, placeId: string) => {
    setLists(prev => prev.map(list => {
      if (list.id === listId) {
        return { ...list, placeIds: list.placeIds.filter(id => id !== placeId) };
      }
      return list;
    }));
  }, []);

  const toggleInList = useCallback((listId: string, placeId: string) => {
    setLists(prev => prev.map(list => {
      if (list.id === listId) {
        const isIn = list.placeIds.includes(placeId);
        return {
          ...list,
          placeIds: isIn
            ? list.placeIds.filter(id => id !== placeId)
            : [...list.placeIds, placeId],
        };
      }
      return list;
    }));
  }, []);

  const isInList = useCallback((listId: string, placeId: string): boolean => {
    const list = lists.find(l => l.id === listId);
    return list?.placeIds.includes(placeId) ?? false;
  }, [lists]);

  const getListsForPlace = useCallback((placeId: string): UserList[] => {
    return lists.filter(list => list.placeIds.includes(placeId));
  }, [lists]);

  const isInAnyList = useCallback((placeId: string): boolean => {
    return lists.some(list => list.placeIds.includes(placeId));
  }, [lists]);

  return {
    lists,
    createList,
    deleteList,
    addToList,
    removeFromList,
    toggleInList,
    isInList,
    getListsForPlace,
    isInAnyList,
  };
};
