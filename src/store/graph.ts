import { createWithEqualityFn } from 'zustand/traditional';
import { type StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { GraphData } from '@/types/graph';
import { chromeStorage } from '@/shared/lib';

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
const DEFAULT_TREE_INPUT = '1 2\n1 3\n2 4\n2 5\n3 6\n3 7';

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

const graphStore: StateCreator<GraphStore, [], [['zustand/persist', unknown], ['zustand/devtools', never]]> = (
  set,
  get,
) => ({
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

export const useGraphStore = createWithEqualityFn<GraphStore>()(
  devtools(
    persist(graphStore, {
      name: 'graph-storage',

      storage: chromeStorage,

      partialize: (state) => ({
        mode: state.mode,
        graph: { rawInputData: state.graph.rawInputData },
        tree: { rawInputData: state.tree.rawInputData },
      }),

      merge: (persisted, current) => {
        const persistedState = persisted as Partial<GraphStoreState>;

        return {
          ...current,
          mode: persistedState.mode ?? current.mode,
          graph: {
            ...current.graph,
            rawInputData: persistedState.graph?.rawInputData ?? current.graph.rawInputData,
          },
          tree: {
            ...current.tree,
            rawInputData: persistedState.tree?.rawInputData ?? current.tree.rawInputData,
          },
        };
      },
    }),
  ),
);
