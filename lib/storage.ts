"use client"

export interface StorageData {
  [key: string]: any
}

/**
 * Convert file to base64 for storage
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })
}

/**
 * Load data from localStorage
 */
export function loadData<T>(key: string, defaultValue: T = [] as T): T {
  if (typeof window === "undefined") return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * Save data to localStorage
 */
export function saveData<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to save data: ${key}`, error)
  }
}
