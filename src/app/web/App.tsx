import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { GraphCanvas, GraphTextArea, GraphConfigPanel } from '@/features/graph';
import { TreeConfigPanel, TreeCanvas, TreeTextArea } from '@/features/tree';
import { useGraphStore, type Mode } from '@/shared/lib';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui';

export default function App() {
  const mode = useGraphStore((state) => state.mode);

  const setMode = useGraphStore((state) => state.setMode);

  return (
    <div className="w-full">
      <span className="hidden sr-only" data-version={process.env.APP_VERSION} />
      <header className="flex items-center justify-center py-4 gap-1">
        <img className="w-8 h-8" alt="main-img" src="graphpaintericon.png" />
        <h1 className="text-3xl">Graph Painter</h1>
      </header>
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
                <section className="w-full space-x-7 flex justify-center m-auto">
                  <aside className="w-52 flex flex-col content-between justify-between gap-6">
                    <GraphTextArea />
                    <GraphConfigPanel />
                  </aside>
                  <main className="w-[542px] h-[100%] border border-main-color rounded-xl">
                    <GraphCanvas />
                  </main>
                </section>
              ) : (
                <section className="w-full space-x-7 flex justify-center m-auto">
                  <aside className="w-52 flex flex-col content-between gap-6">
                    <TreeTextArea />
                    <TreeConfigPanel />
                  </aside>
                  <main className="w-[542px] h-[100%] border border-main-color rounded-xl">
                    <TreeCanvas />
                  </main>
                </section>
              )}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </Tabs>
    </div>
  );
}
