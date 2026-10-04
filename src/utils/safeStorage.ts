/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Resilient, cross-browser SafeStorage utility.
 *
 * In Google Chrome (especially within iframes, sandboxes, incognito mode,
 * or when third-party cookies / partitioned storage are restricted),
 * direct access to `window.localStorage` or `window.sessionStorage`
 * throws a fatal DOMException (SecurityError):
 * "Failed to read the 'localStorage' property from 'Window': Access is denied for this document."
 *
 * In Firefox, partitioned storage returns an isolated storage or handles this
 * without throwing, which is why sites with unshielded storage calls crash
 * with a completely blank screen in Chrome but work in Firefox.
 *
 * This utility provides safe drop-in replacements that never throw.
 */

class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

function resolveStorage(type: 'localStorage' | 'sessionStorage'): Storage {
  try {
    if (typeof window === 'undefined') {
      return new MemoryStorage();
    }
    const storage = window[type];
    if (!storage) {
      return new MemoryStorage();
    }
    // Verify storage is actually readable and writable
    const testKey = `__dnm_storage_test_${type}__`;
    storage.setItem(testKey, '1');
    const readBack = storage.getItem(testKey);
    storage.removeItem(testKey);
    if (readBack === '1') {
      return storage;
    }
    return new MemoryStorage();
  } catch {
    // Chrome thrown SecurityError / DOMException -> graceful memory fallback
    return new MemoryStorage();
  }
}

export const safeLocalStorage: Storage = resolveStorage('localStorage');
export const safeSessionStorage: Storage = resolveStorage('sessionStorage');

/**
 * Safe JSON helpers with fallback
 */
export function safeStorageGetJson<T>(storage: Storage, key: string, fallback: T): T {
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function safeStorageSetJson<T>(storage: Storage, key: string, value: T): boolean {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
