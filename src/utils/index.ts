import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const isObject = (data: unknown): boolean => {
  return (typeof data === 'object' && data !== null) || Array.isArray(data);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BUILD_TARGET = process.env.BUILD_TARGET || 'web';
