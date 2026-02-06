import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { cva } from 'class-variance-authority';
import { parseGraph } from '@/services/parse-graph';
import { useGraphStore } from '@/store/graph';
import { useDebounce } from '@/hooks/use-debounce';
import Textarea from '@/components/ui/textarea';
import { BUILD_TARGET } from '@/utils';

const textAreaStyle = cva('resize-none text-white bg-foreground', {
  variants: {
    env: {
      web: 'h-full',
      extension: 'h-46 text-base leading-tight',
    },
  },
});

export default function TextArea(): JSX.Element {
  const rawInputData = useGraphStore((state) => state[state.mode].rawInputData);

  const setRawInputData = useGraphStore((state) => state.setRawInputData);

  const setGraph = useGraphStore((state) => state.setGraph, shallow);

  const debouncedInputValue = useDebounce({ value: rawInputData, delay: 250 });

  useEffect(() => {
    const pg = parseGraph(debouncedInputValue);
    setGraph(pg, debouncedInputValue);
  }, [debouncedInputValue, setGraph]);

  return (
    <Textarea
      id="textarea"
      className={textAreaStyle({ env: BUILD_TARGET })}
      value={rawInputData}
      onChange={(e) => {
        setRawInputData(e.target.value);
      }}
    />
  );
}
