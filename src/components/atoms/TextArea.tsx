import { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { parseGraph } from '@/services/parse-graph';
import { useGraphStore } from '@/store/graph';
import { useDebounce } from '@/hooks/use-debounce';
import Textarea from '@/components/ui/textarea';

export default function TextArea(): JSX.Element {
  const initInputData = useGraphStore((state) => state.rawInputData);

  const setGraph = useGraphStore((state) => state.setGraph, shallow);

  const [textAreaValue, setTextAreaValue] = useState(initInputData);

  const debouncedInputValue = useDebounce({ value: textAreaValue, delay: 250 });

  useEffect(() => {
    const pg = parseGraph(debouncedInputValue);
    setGraph(pg, debouncedInputValue);
  }, [debouncedInputValue, setGraph]);

  return (
    <Textarea
      id="textarea"
      className="resize-none h-[100%] text-white bg-foreground"
      value={textAreaValue}
      onChange={(e) => {
        setTextAreaValue(e.target.value);
      }}
    />
  );
}
