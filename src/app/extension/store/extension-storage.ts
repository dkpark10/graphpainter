import { Mode } from '@/shared/lib';

export interface StorageData {
  mode: Mode;
  graphRawInput: string;
  treeRawInput: string;
  treeRoot: string;
}

export const extensionStorage = {
  get: (): Promise<StorageData | undefined> => {
    if (process.env.NODE_ENV === 'development') {
      return Promise.resolve(undefined);
    }

    return chrome.runtime.sendMessage({ type: 'GET_STORAGE' });
  },
  set: (data: StorageData): Promise<{ success: boolean }> => {
    return chrome.runtime.sendMessage({ type: 'SET_STORAGE', data });
  },
};
