import { useCallback, useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import clsx from 'clsx';
import { useGraphStore, useTreeRoot, GraphData } from '@/shared';
import { useDebounce } from '@/shared/hooks';
import { Textarea } from '@/shared/ui';
import { treeTextAreaStyle, createGraphData } from '@/shared/lib';

export default function GraphTextArea(): JSX.Element {
  const rawInputData = useGraphStore((state) => state[state.mode].rawInputData);

  const setRawInputData = useGraphStore((state) => state.setRawInputData);

  const setGraph = useGraphStore((state) => state.setGraph, shallow);

  const { root, setTreeRoot } = useTreeRoot();

  const rootRef = useRef(root);
  rootRef.current = root;

  const debouncedInputValue = useDebounce(rawInputData, 250);

  const initializeDefaultRoot = useCallback(
    (data: GraphData) => {
      const firstNode = data.nodes[0]?.value;
      const currentRoot = rootRef.current;
      const isRootEmpty = !currentRoot;
      const isRootInvalid = !data.nodes.some((node) => node.value === currentRoot);

      if (firstNode && (isRootEmpty || isRootInvalid)) {
        setTreeRoot(firstNode);
      }
    },
    [setTreeRoot],
  );

  useEffect(() => {
    const data = createGraphData(debouncedInputValue);
    setGraph(data, debouncedInputValue);
    initializeDefaultRoot(data);
  }, [debouncedInputValue, setGraph, initializeDefaultRoot]);

  return (
    <Textarea
      id="textarea"
      className={clsx(treeTextAreaStyle({ env: process.env.BUILD_TARGET }))}
      value={rawInputData}
      onChange={(e) => {
        setRawInputData(e.target.value);
      }}
    />
  );
}
