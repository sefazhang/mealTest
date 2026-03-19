import type { Dish } from '../types/dish'

interface DailyRecord {
  date: string
  dishes: Dish[]
}

const DB_NAME = 'myMealDB'
const STORE_NAME = 'menuHistory'
const DB_VERSION = 1

let db: IDBDatabase | null = null

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'date' })
      }
    }
  })
}

export const saveRecord = async (record: DailyRecord): Promise<void> => {
  if (!db) await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(record)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export const getAllRecords = async (): Promise<DailyRecord[]> => {
  if (!db) await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const exportData = async (): Promise<string> => {
  const records = await getAllRecords()
  return JSON.stringify(records, null, 2)
}

export const importData = async (jsonData: string): Promise<void> => {
  const records: DailyRecord[] = JSON.parse(jsonData)
  for (const record of records) {
    await saveRecord(record)
  }
}

export const clearAllRecords = async (): Promise<void> => {
  if (!db) await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.clear()
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
