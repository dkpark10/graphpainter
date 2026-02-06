import { useEffect, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';
import Label from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useGraphStore } from '@/store/graph';
import { useTreeRoot } from '@/store/tree-root';

export default function Config() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [invalidInputNodes, setInvalidInputNodes] = useState(false);

  const nodes = useGraphStore((state) => state.tree.nodes);

  const { root, setTreeRoot } = useTreeRoot();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTreeRoot(e.target.value);
  };

  useEffect(() => {
    if (!root) return;

    if (!nodes.some((node) => node.value === root)) {
      setInvalidInputNodes(true);
      return;
    }

    setInvalidInputNodes(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root]);

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="tree-root" className="text-xs text-muted-foreground">
                root
              </Label>
              <Input id="tree-root" name="tree-root" className="h-8" ref={inputRef} onChange={onChange} />
            </div>
          </div>
          {invalidInputNodes && <p className="text-xs text-destructive">Invalid root input</p>}
        </div>
      </CardContent>
    </Card>
  );
}
