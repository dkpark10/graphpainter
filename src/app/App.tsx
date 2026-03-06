import { useState } from 'react';
import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import { GraphCanvas, GraphTextArea, GraphConfigPanel } from '@/features/graph';
import { TreeConfigPanel, TreeCanvas, TreeTextArea } from '@/features/tree';
import { BUILD_TARGET, cn } from '@/shared/lib';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui';
import { useGraphStore, type Mode } from '@/store/graph';
// eslint-disable-next-line import/extensions
import packageInfo from '../../package.json';

const rootLayoutStyle = cva('', {
  variants: {
    env: {
      web: 'w-full',
      extension: 'w-sm px-2 py-1',
    },
  },
});

const headerStyle = cva('', {
  variants: {
    env: {
      web: 'flex items-center justify-center py-4 gap-1',
      extension: 'hidden',
    },
  },
});

const mainLayoutStyle = cva('h-[100%] border border-main-color rounded-xl', {
  variants: {
    env: {
      web: 'w-[542px] h-[100%]',
      extension: 'w-full',
    },
  },
});

export default function App() {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const setMode = useGraphStore((state) => state.setMode);

  return (
    <div className={cn(rootLayoutStyle({ env: BUILD_TARGET }))}>
      <span className="hidden sr-only" data-version={packageInfo.version} />
      <header className={headerStyle({ env: BUILD_TARGET })}>
        <img className="w-8 h-8" alt="main-img" src="graphpaintericon.png" />
        <h1 className="text-3xl">Graph Painter</h1>
      </header>
      <Tabs
        defaultValue="graph"
        className="flex items-center justify-center"
        onValueChange={(value) => setMode(value as Mode)}
      >
        <TabsList variant="line">
          <TabsTrigger value="graph" className="cursor-pointer">
            graph
          </TabsTrigger>
          <TabsTrigger value="tree" className="cursor-pointer">
            tree
          </TabsTrigger>
        </TabsList>
        <TabsContent value="graph">
          {BUILD_TARGET === 'extension' ? (
            <section className="flex flex-col gap-2">
              <GraphTextArea />
              <main className={mainLayoutStyle({ env: BUILD_TARGET })}>
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
            <section className="w-full space-x-7 flex justify-center m-auto">
              <aside className="w-52 flex flex-col content-between justify-between gap-6">
                <GraphTextArea />
                <GraphConfigPanel />
              </aside>
              <main className={mainLayoutStyle({ env: BUILD_TARGET })}>
                <GraphCanvas />
              </main>
            </section>
          )}
        </TabsContent>
        <TabsContent value="tree">
          {BUILD_TARGET === 'extension' ? (
            <section className="flex flex-col gap-2">
              <GraphTextArea />
              <main className={mainLayoutStyle({ env: BUILD_TARGET })}>
                <TreeCanvas />
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
              {isConfigOpen && <TreeConfigPanel />}
            </section>
          ) : (
            <section className="w-full space-x-7 flex justify-center m-auto">
              <aside className="w-52 flex flex-col content-between justify-between gap-6">
                <TreeTextArea />
                <TreeConfigPanel />
              </aside>
              <main className={mainLayoutStyle({ env: BUILD_TARGET })}>
                <TreeCanvas />
              </main>
            </section>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
