import { useState, useCallback } from 'react';
import type { CreatorProfile, CreatorMap, CreatorProduct, CreatorLink } from '@/types/creator';

const STORAGE_KEY = 'creator-profile';

const generateId = () => Math.random().toString(36).slice(2, 10);

const defaultProfile: CreatorProfile = {
  id: 'me',
  name: '',
  bio: '',
  avatarSeed: generateId(),
  maps: [],
  products: [],
  links: [],
  routePlanEnabled: false,
  routePlanPrice: undefined,
  routePlanCurrency: 'RUB',
};

function loadProfile(): CreatorProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultProfile, ...JSON.parse(raw) };
  } catch {}
  return { ...defaultProfile };
}

function saveProfile(p: CreatorProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function useCreatorProfile() {
  const [profile, setProfile] = useState<CreatorProfile>(loadProfile);

  const update = useCallback((partial: Partial<CreatorProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...partial };
      saveProfile(next);
      return next;
    });
  }, []);

  const addMap = useCallback((map: Omit<CreatorMap, 'id'>) => {
    setProfile(prev => {
      const next = { ...prev, maps: [...prev.maps, { ...map, id: generateId() }] };
      saveProfile(next);
      return next;
    });
  }, []);

  const removeMap = useCallback((id: string) => {
    setProfile(prev => {
      const next = { ...prev, maps: prev.maps.filter(m => m.id !== id) };
      saveProfile(next);
      return next;
    });
  }, []);

  const addProduct = useCallback((product: Omit<CreatorProduct, 'id'>) => {
    setProfile(prev => {
      const next = { ...prev, products: [...prev.products, { ...product, id: generateId() }] };
      saveProfile(next);
      return next;
    });
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProfile(prev => {
      const next = { ...prev, products: prev.products.filter(p => p.id !== id) };
      saveProfile(next);
      return next;
    });
  }, []);

  const addLink = useCallback((link: Omit<CreatorLink, 'id'>) => {
    setProfile(prev => {
      const next = { ...prev, links: [...prev.links, { ...link, id: generateId() }] };
      saveProfile(next);
      return next;
    });
  }, []);

  const removeLink = useCallback((id: string) => {
    setProfile(prev => {
      const next = { ...prev, links: prev.links.filter(l => l.id !== id) };
      saveProfile(next);
      return next;
    });
  }, []);

  return { profile, update, addMap, removeMap, addProduct, removeProduct, addLink, removeLink };
}

export function loadCreatorProfileById(id: string): CreatorProfile | null {
  // MVP: only "me" profile exists
  if (id === 'me') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...defaultProfile, ...JSON.parse(raw) };
    } catch {}
  }
  return null;
}
