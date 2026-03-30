export type UserRole = 'user' | 'creator' | 'admin';

export const ROLE_CAPABILITIES = {
  user: {
    viewMap: true,
    saveToStash: false, // requires premium access
    sharePromo: true,
    addCustomMaps: false,
    offlineDownload: false, // requires premium access
    manageCreators: false,
  },
  creator: {
    viewMap: true,
    saveToStash: true,
    sharePromo: false,
    addCustomMaps: true,
    offlineDownload: true,
    manageCreators: false,
  },
  admin: {
    viewMap: true,
    saveToStash: true,
    sharePromo: false,
    addCustomMaps: true,
    offlineDownload: true,
    manageCreators: true,
  },
} as const;

export type RoleCapability = keyof typeof ROLE_CAPABILITIES.user;

export const hasCapability = (role: UserRole, capability: RoleCapability): boolean => {
  return ROLE_CAPABILITIES[role][capability];
};
