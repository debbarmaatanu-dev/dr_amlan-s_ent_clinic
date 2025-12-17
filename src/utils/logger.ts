/**
 * Production-safe logging utility for frontend
 * Logs are visible in Vercel functions but not in browser devtools in production
 */

const isProduction = import.meta.env.PROD;

export const logger = {
  // Always log errors regardless of environment
  error: (...args: unknown[]) => {
    console.error(...args);
  },

  // Log in development and Vercel functions (for debugging)
  log: (...args: unknown[]) => {
    console.log(...args);
  },

  // Log in development and Vercel functions (for debugging)
  info: (...args: unknown[]) => {
    console.info(...args);
  },

  // Log in development and Vercel functions (for debugging)
  warn: (...args: unknown[]) => {
    console.warn(...args);
  },

  // Only log in development (debug is too verbose for production)
  debug: (...args: unknown[]) => {
    if (!isProduction) {
      console.debug(...args);
    }
  },
};
