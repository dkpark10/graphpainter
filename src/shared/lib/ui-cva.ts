import { cva } from 'class-variance-authority';

export const textAreaStyle = cva('resize-none text-white bg-foreground', {
  variants: {
    env: {
      web: 'h-full',
      extension: 'h-46 text-base leading-tight',
    },
  },
});
