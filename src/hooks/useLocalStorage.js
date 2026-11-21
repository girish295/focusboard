import { useState, useEffect } from 'react'

/**
 * useLocalStorage Custom Hook
 * 
 * Safely persists state to window.localStorage with defensive error handling.
 * 
 * Key Features:
 * 1. Lazy state initialization: Reads from localStorage ONLY on initial mount, avoiding costly disk reads on subsequent renders.
 * 2. Corrupt data resilience: If localStorage contains invalid JSON or non-array data, it falls back to initialValue without crashing.
 * 3. Automatic synchronization: Syncs changes to localStorage via useEffect whenever the storedValue changes.
 * 4. Quota exceeded safety: Wraps setItem in try/catch to gracefully handle private-browsing or storage quota limits.
 * 
 * @param {string} key - The localStorage key under which data is saved.
 * @param {any} initialValue - Fallback value if storage is empty or invalid.
 * @returns {[any, Function]} - [storedValue, setStoredValue] state tuple.
 */
export function useLocalStorage(key, initialValue) {
  // Lazy initializer: executes exactly once on component mount
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item === null) {
        return initialValue
      }
      
      const parsed = JSON.parse(item)

      // Type safety validation: if initialValue is an array, ensure parsed is also an array
      if (Array.isArray(initialValue) && !Array.isArray(parsed)) {
        console.warn(`[useLocalStorage] Key "${key}" contained invalid non-array data. Falling back to default.`)
        return initialValue
      }

      return parsed
    } catch (error) {
      console.error(`[useLocalStorage] Error reading key "${key}" from localStorage:`, error)
      return initialValue
    }
  })

  // Synchronize state changes to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error(`[useLocalStorage] Error saving key "${key}" to localStorage:`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
