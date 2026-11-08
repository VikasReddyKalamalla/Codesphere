import { lazy } from 'react';

/**
 * Resilient lazy-load wrapper that handles network hiccups, Vite HMR dev-server reloads,
 * chunk caching issues, and automatically resolves named or default exports to prevent blank screens.
 */
export const lazyWithRetry = (componentImport, retries = 2, interval = 400) =>
  lazy(async () => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const module = await componentImport();
        // Guarantee that React receives a valid default component export
        if (module && !module.default) {
          const component = Object.values(module).find(
            (v) => typeof v === 'function' || (typeof v === 'object' && v !== null && v.$$typeof)
          );
          if (component) {
            return { default: component };
          }
        }
        return module;
      } catch (error) {
        const errorMsg = error?.message || String(error);
        const isDynamicImportError =
          errorMsg.includes('Failed to fetch dynamically imported module') ||
          errorMsg.includes('Importing a module script failed') ||
          errorMsg.includes('error loading dynamically imported module') ||
          (error?.name === 'TypeError' && (errorMsg.includes('Failed to fetch') || errorMsg.includes('import') || errorMsg.includes('dynamically')));

        if (attempt < retries && isDynamicImportError) {
          await new Promise((resolve) => setTimeout(resolve, interval * (attempt + 1)));
          continue;
        }

        if (typeof window !== 'undefined' && isDynamicImportError) {
          const lastReload = Number(sessionStorage.getItem('cs_lazy_retry_reload') || 0);
          if (Date.now() - lastReload > 5000) {
            sessionStorage.setItem('cs_lazy_retry_reload', String(Date.now()));
            window.location.reload();
            return { default: () => null };
          }
        }

        throw error;
      }
    }
  });

export default lazyWithRetry;
