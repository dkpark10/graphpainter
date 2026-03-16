import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export { graphTextAreaStyle, treeTextAreaStyle } from './ui-cva';
export { createGraphData } from './create-graph';

export const isObject = (data: unknown): boolean => {
  return (typeof data === 'object' && data !== null) || Array.isArray(data);
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
