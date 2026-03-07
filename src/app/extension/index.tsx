import '../styles/globals.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { extensionStorage } from './lib';
import { useGraphStore, useTreeRoot } from '@/shared/store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

extensionStorage
  .get()
  .then((data) => {
    if (data) {
      useGraphStore.setState((state) => ({
        mode: data.mode || state.mode,
        graph: {
          ...state.graph,
          rawInputData: data.graphRawInput || state.graph.rawInputData,
        },
        tree: {
          ...state.tree,
          rawInputData: data.treeRawInput || state.tree.rawInputData,
        },
      }));

      if (data.treeRoot) {
        useTreeRoot.setState({ root: data.treeRoot });
      }
    }
  })
  .catch(() => {})
  .finally(() => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  });
