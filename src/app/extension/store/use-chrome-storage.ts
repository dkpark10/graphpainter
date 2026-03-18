import { useEffect, useRef } from 'react';
import { useGraphStore, useTreeRoot } from '@/shared/lib';
import { extensionStorage, type StorageData } from './extension-storage';

export const useChromeStorage = () => {
  const isFirstRender = useRef(true);

  const mode = useGraphStore((state) => state.mode);
  const graphRawInput = useGraphStore((state) => state.graph.rawInputData);
  const treeRawInput = useGraphStore((state) => state.tree.rawInputData);
  const treeRoot = useTreeRoot((state) => state.root);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      return;
    }
    // 깜빡임 제거 위한
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const data: StorageData = {
      mode,
      graphRawInput,
      treeRawInput,
      treeRoot,
    };

    extensionStorage.set(data).catch(() => {});
  }, [mode, graphRawInput, treeRawInput, treeRoot]);
};
