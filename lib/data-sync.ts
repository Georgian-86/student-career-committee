// This file bridges the gap between local state and backend data sources

export interface SyncOptions {
  key: string
  debounceMs?: number
}

/**
 * Loads data from localStorage with optional default values
 */
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Failed to load from storage: ${key}`, error)
    return defaultValue
  }
}

/**
 * Saves data to localStorage
 */
export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to save to storage: ${key}`, error)
  }
}

/**
 * Syncs data between multiple components
 */
export function useSyncedData<T>(key: string, initialValue: T, syncFn?: () => Promise<T>) {
  return {
    load: () => loadFromStorage(key, initialValue),
    save: (value: T) => saveToStorage(key, value),
    syncFromServer: syncFn,
  }
}
