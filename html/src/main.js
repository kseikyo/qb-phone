// Vite entry point: bundle @coinbase/cdp-core and expose it as a global for legacy non-module scripts
import * as CDP from '@coinbase/cdp-core';

// Module namespace objects are non-extensible; create a plain-clone so we can add runtime fields
function cloneModuleNamespaceToPlainObject(mod) {
  const obj = {};
  try {
    // copy string-keyed properties
    for (const key of Object.getOwnPropertyNames(mod)) {
      const desc = Object.getOwnPropertyDescriptor(mod, key);
      if (desc) Object.defineProperty(obj, key, desc);
    }
    // copy symbol-keyed properties
    for (const sym of Object.getOwnPropertySymbols(mod)) {
      const desc = Object.getOwnPropertyDescriptor(mod, sym);
      if (desc) Object.defineProperty(obj, sym, desc);
    }
  } catch (e) {
    // Fallback: shallow copy
    Object.assign(obj, mod);
  }
  // Keep original module reference available
  Object.defineProperty(obj, '__module', {
    value: mod,
    enumerable: false,
    writable: false,
    configurable: false,
  });
  return obj;
}

// Attach a plain clone to window so existing non-module scripts can mutate and add diagnostics
window.CDP = cloneModuleNamespaceToPlainObject(CDP);
window.CDP.__loadedBy = 'vite-bundle';
console.info('CDP bundled by Vite and attached to window.CDP', window.CDP);

// Notify other scripts that CDP is available
try {
  window.dispatchEvent(new Event('CDP:loaded'));
} catch (e) {
  console.warn('Could not dispatch CDP:loaded event', e);
}

// Optional: export for module consumers
export default CDP;
