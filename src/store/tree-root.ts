import { create, type StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { chromeStorage } from '@/shared/lib';

export interface TreeRoot {
  root: string;
  setTreeRoot: (value: string) => void;
}

const treeRoot: StateCreator<TreeRoot, [], [['zustand/persist', unknown], ['zustand/devtools', never]]> = (set) => ({
  root: '',
  setTreeRoot: (value: string) => set(() => ({ root: value })),
});

export const useTreeRoot = create<TreeRoot>()(
  devtools(
    persist(treeRoot, {
      name: 'tree-root-storage',

      storage: chromeStorage,

      partialize: (state) => ({ root: state.root }),
    }),
  ),
);
