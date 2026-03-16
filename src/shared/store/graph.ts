import { createWithEqualityFn } from 'zustand/traditional';
import { type StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { GraphData } from '@/shared/types';

export type Mode = 'graph' | 'tree';

interface ModeData {
  rawInputData: string;
  nodes: GraphData['nodes'];
  links: GraphData['links'];
}

export interface GraphStoreState {
  mode: Mode;
  graph: ModeData;
  tree: ModeData;
}

export interface GraphStoreActions {
  setMode: (mode: Mode) => void;
  setGraph: (payload: GraphData, rawInputData: string) => void;
  setRawInputData: (rawInputData: string) => void;
}

export type GraphStore = GraphStoreState & GraphStoreActions;

const DEFAULT_GRAPH_INPUT = '1 2 2\n2 3 8\n3 4 1\n1 4 9\n4 5 7\n5 6 2\n4 6 6\n3 6 9';
const DEFAULT_TREE_INPUT = '1 2\n1 3\n2 4\n2 5\n3 6\n3 7\n4 8\n4 9';

const initialState: GraphStoreState = {
  mode: 'graph',
  graph: {
    rawInputData: DEFAULT_GRAPH_INPUT,
    nodes: [],
    links: [],
  },
  tree: {
    rawInputData: DEFAULT_TREE_INPUT,
    nodes: [],
    links: [],
  },
};

const graphStore: StateCreator<GraphStore> = (set, get) => ({
  ...initialState,

  setMode: (mode) => set({ mode }),

  setGraph: ({ nodes, links }, rawInputData) => {
    const { mode } = get();
    set((state) => ({
      [mode]: { ...state[mode], nodes, links, rawInputData },
    }));
  },

  setRawInputData: (rawInputData) => {
    const { mode } = get();
    set((state) => ({
      [mode]: { ...state[mode], rawInputData },
    }));
  },
});

export const useGraphStore = createWithEqualityFn<GraphStore>()(devtools(graphStore));
