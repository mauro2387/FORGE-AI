/**
 * logger.ts — Logger condicional (sin console.log en producción)
 * Dependencias: ninguna
 */

const isDev = __DEV__;

export const logger = {
  info: (...args: unknown[]): void => {
    if (isDev) console.info('[FORGE]', ...args);
  },
  warn: (...args: unknown[]): void => {
    if (isDev) console.warn('[FORGE]', ...args);
  },
  error: (...args: unknown[]): void => {
    if (isDev) console.error('[FORGE]', ...args);
  },
  debug: (...args: unknown[]): void => {
    if (isDev) console.debug('[FORGE]', ...args);
  },
};
