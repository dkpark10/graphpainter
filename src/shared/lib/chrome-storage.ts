/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createJSONStorage, type StateStorage } from 'zustand/middleware';

const BUILD_TARGET = process.env.BUILD_TARGET || 'web';

const isExtension = () => {
  return BUILD_TARGET === 'extension' && typeof chrome !== 'undefined' && !!chrome.storage?.local;
};

const storageAdapter: StateStorage = {
  getItem: async (name: string) => {
    if (!isExtension()) {
      return null;
    }

    const result = await chrome.storage.local.get(name);
    return result[name];
  },

  setItem: async (name: string, value: string) => {
    if (!isExtension()) {
      return;
    }

    await chrome.storage.local.set({ [name]: value });
  },

  removeItem: async (name: string) => {
    if (!isExtension()) {
      return;
    }

    await chrome.storage.local.remove(name);
  },
};

export const chromeStorage = createJSONStorage(() => storageAdapter);
