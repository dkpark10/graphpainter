import { create, type StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface TreeRoot {
  root: string;
  setTreeRoot: (value: string) => void;
}

const treeRoot: StateCreator<TreeRoot> = (set) => ({
  root: '',
  setTreeRoot: (value: string) => set(() => ({ root: value })),
});

export const useTreeRoot = create<TreeRoot>()(devtools(treeRoot));
