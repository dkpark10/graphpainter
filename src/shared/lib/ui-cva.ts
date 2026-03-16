import { cva } from 'class-variance-authority';

const defaultStyle = 'h-46 resize-none text-white bg-foreground';
const defaultEx = 'text-base leading-tight';

export const graphTextAreaStyle = cva(defaultStyle, {
  variants: {
    env: {
      web: 'h-full',
      extension: defaultEx,
    },
  },
});

export const treeTextAreaStyle = cva(defaultStyle, {
  variants: {
    env: {
      web: '',
      extension: defaultEx,
    },
  },
});
