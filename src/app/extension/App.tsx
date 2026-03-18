import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { GraphCanvas, GraphTextArea, GraphConfigPanel } from '@/features/graph';
import { TreeConfigPanel, TreeCanvas, TreeTextArea } from '@/features/tree';
import { cn } from '@/shared/lib';
import { useGraphStore, type Mode } from '@/shared/lib';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui';
import { useChromeStorage } from './store';

export default function App() {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const mode = useGraphStore((state) => state.mode);

  const setMode = useGraphStore((state) => state.setMode);

  useChromeStorage();

  return (
    <div className="w-sm px-2 py-1">
      <Tabs value={mode} className="flex items-center justify-center" onValueChange={(value) => setMode(value as Mode)}>
        <TabsList variant="line">
          <TabsTrigger value="graph" className="cursor-pointer">
            graph
          </TabsTrigger>
          <TabsTrigger value="tree" className="cursor-pointer">
            tree
          </TabsTrigger>
        </TabsList>
        <SwitchTransition mode="out-in">
          <CSSTransition key={mode} classNames="tab-fade" timeout={200}>
            <div className="flex-1 outline-none">
              {mode === 'graph' ? (
                <section className="flex flex-col gap-2">
                  <GraphTextArea />
                  <main className="w-full h-[100%] border border-main-color rounded-xl">
                    <GraphCanvas />
                  </main>
                  <button
                    type="button"
                    aria-label="open-config-button"
                    onClick={() => setIsConfigOpen(!isConfigOpen)}
                    className="flex cursor-pointer items-center justify-center w-full hover:bg-accent rounded-md transition-colors"
                  >
                    <ChevronDown
                      className={cn('w-5 h-5 transition-transform duration-200', isConfigOpen && 'rotate-180')}
                    />
                  </button>
                  {isConfigOpen && <GraphConfigPanel />}
                </section>
              ) : (
                <section className="flex flex-col gap-2">
                  <TreeTextArea />
                  <main className="w-full h-[100%] border border-main-color rounded-xl">
                    <TreeCanvas />
                  </main>
                  <TreeConfigPanel />
                </section>
              )}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </Tabs>
    </div>
  );
}
