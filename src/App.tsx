import { useState } from 'react';
import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import Svg from '@/components/molecules/Svg';
import Tree from '@/components/molecules/Tree';
import Textarea from '@/components/atoms/TextArea';
import Config from '@/components/molecules/Config';
import TreeConfig from '@/components/molecules/TreeConfig';
import { BUILD_TARGET, cn } from '@/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGraphStore, type Mode } from '@/store/graph';
// eslint-disable-next-line import/extensions
import packageInfo from '../package.json';

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
              <Textarea />
              <main className={mainLayoutStyle({ env: 'extension' })}>
                <Svg />
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
              {isConfigOpen && <Config />}
            </section>
          ) : (
            <section className="w-full space-x-7 flex justify-center m-auto">
              <aside className="w-52 flex flex-col content-between justify-between gap-6">
                <Textarea />
                <Config />
              </aside>
              <main className={mainLayoutStyle({ env: 'web' })}>
                <Svg />
              </main>
            </section>
          )}
        </TabsContent>
        <TabsContent value="tree">
          {BUILD_TARGET === 'extension' ? (
            <section className="flex flex-col gap-2">
              <Textarea />
              <main className={mainLayoutStyle({ env: 'extension' })}>
                <Tree />
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
              {isConfigOpen && <TreeConfig />}
            </section>
          ) : (
            <section className="w-full space-x-7 flex justify-center m-auto">
              <aside className="w-52 flex flex-col content-between justify-between gap-6">
                <Textarea />
                <TreeConfig />
              </aside>
              <main className={mainLayoutStyle({ env: 'web' })}>
                <Tree />
              </main>
            </section>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
