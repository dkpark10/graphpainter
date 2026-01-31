import { useState } from 'react';
import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import Svg from '@/components/molecules/Main3';
import Textarea from '@/components/atoms/TextArea';
import Config from '@/components/molecules/Config';
import { BUILD_TARGET, cn } from '@/utils';
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
      web: 'flex items-center justify-center py-4',
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

  return (
    <div className={cn(rootLayoutStyle({ env: BUILD_TARGET }))}>
      <span className="hidden" data-version={packageInfo.version} />
      <header className={headerStyle({ env: BUILD_TARGET })}>
        <h1 className="text-3xl flex items-center">
          <img className="w-8 h-8" alt="main-img" src="graphpaintericon.png" />
          Graph Painter
        </h1>
      </header>
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
            <ChevronDown className={cn('w-5 h-5 transition-transform duration-200', isConfigOpen && 'rotate-180')} />
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
    </div>
  );
}
