import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useGraphStore } from '@/shared/store';
import { useDebounce } from '@/shared/hooks';
import { Textarea } from '@/shared/ui';
import { graphTextAreaStyle, createGraphData } from '@/shared/lib';

export default function GraphTextArea(): JSX.Element {
  const rawInputData = useGraphStore((state) => state[state.mode].rawInputData);

  const setRawInputData = useGraphStore((state) => state.setRawInputData);

  const setGraph = useGraphStore((state) => state.setGraph, shallow);

  const debouncedInputValue = useDebounce(rawInputData, 250);

  useEffect(() => {
    const data = createGraphData(debouncedInputValue);
    setGraph(data, debouncedInputValue);
  }, [debouncedInputValue, setGraph]);

  return (
    <Textarea
      id="textarea"
      className={graphTextAreaStyle({ env: process.env.BUILD_TARGET })}
      value={rawInputData}
      onChange={(e) => {
        setRawInputData(e.target.value);
      }}
    />
  );
}
