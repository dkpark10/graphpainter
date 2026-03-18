import { useEffect, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useArrowStore, useShortestPathStore, useGraphStore, useRunForce } from '@/shared/lib';
import { Switch, Label, Card, CardContent, Input, Button, Separator } from '@/shared/ui';
import { DijkstraBuilder } from '../model';

export default function Config() {
  const inputFromRef = useRef<HTMLInputElement | null>(null);
  const inputToRef = useRef<HTMLInputElement | null>(null);

  const { isArrow, setArrowDirect } = useArrowStore((state) => ({
    setArrowDirect: state.setArrowDirect,
    isArrow: state.isArrow,
  }));

  const { runForce, setRunForce } = useRunForce((state) => ({
    runForce: state.runForce,
    setRunForce: state.setRunForce,
  }));

  const setShortestPath = useShortestPathStore((state) => state.setShortestPath);

  const [invalidInputNodes, setInvalidInputNodes] = useState(false);

  const { nodes, rawInputData } = useGraphStore((state) => state.graph, shallow);

  const isExistNodes = () =>
    nodes.some((node) => node.value === inputFromRef.current?.value) &&
    nodes.some((node) => node.value === inputToRef.current?.value);

  const findShortestPath = () => {
    if (!inputFromRef.current || !inputToRef.current || !isExistNodes()) {
      setInvalidInputNodes(true);
      return;
    }

    setInvalidInputNodes(false);

    const dijkstra = new DijkstraBuilder()
      .setGraphRawData(rawInputData)
      .setFromVertex(inputFromRef.current?.value)
      .setToVertex(inputToRef.current?.value)
      .build();

    setShortestPath({
      from: inputFromRef.current?.value,
      to: inputToRef.current?.value,
      shortestPath: dijkstra.run(),
    });
  };

  useEffect(() => {
    setShortestPath({
      from: '',
      to: '',
      shortestPath: [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawInputData]);

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Arrow Marker Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="arrow-mode" className="text-sm font-medium cursor-pointer">
            Arrow Marker
          </Label>
          <Switch id="arrow-mode" className="cursor-pointer" checked={isArrow} onCheckedChange={setArrowDirect} />
        </div>

        {/* Simulation Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="simulation-mode" className="text-sm font-medium cursor-pointer">
            Force Simulation
          </Label>
          <Switch id="simulation-mode" className="cursor-pointer" checked={runForce} onCheckedChange={setRunForce} />
        </div>

        <Separator />

        {/* Shortest Path Finder */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="from" className="text-xs text-muted-foreground">
                From
              </Label>
              <Input id="from" name="path-from" className="h-8" ref={inputFromRef} />
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor="to" className="text-xs text-muted-foreground">
                To
              </Label>
              <Input id="to" name="path-to" className="h-8" ref={inputToRef} />
            </div>
          </div>
          {invalidInputNodes && <p className="text-xs text-destructive">Invalid node input</p>}
          <Button className="w-full cursor-pointer" size="sm" onClick={findShortestPath}>
            Find Shortest Path
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
