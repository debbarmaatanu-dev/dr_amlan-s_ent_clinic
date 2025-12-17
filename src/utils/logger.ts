/**
 * Production-safe logging utility for frontend
 * - Development: All logs visible in browser console
 * - Production: Logs blocked in browser devtools, but sent to Vercel logs
 */

const isProduction = import.meta.env.PROD;
const isBrowser = typeof window !== 'undefined';

export const logger = {
  // Always log errors (visible in Vercel logs, blocked in production browser devtools)
  error: (...args: unknown[]) => {
    if (!isProduction || !isBrowser) {
      console.error(...args);
    }
    // In production browser, errors are still important but hidden from devtools
  },

  // Log in development and Vercel functions (blocked in production browser devtools)
  log: (...args: unknown[]) => {
    if (!isProduction || !isBrowser) {
      console.log(...args);
    }
  },

  // Info logs (blocked in production browser devtools)
  info: (...args: unknown[]) => {
    if (!isProduction || !isBrowser) {
      console.info(...args);
    }
  },

  // Warnings (blocked in production browser devtools)
  warn: (...args: unknown[]) => {
    if (!isProduction || !isBrowser) {
      console.warn(...args);
    }
  },

  // Debug logs only in development
  debug: (...args: unknown[]) => {
    if (!isProduction) {
      console.debug(...args);
    }
  },
};
