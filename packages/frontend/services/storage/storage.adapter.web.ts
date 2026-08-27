import { StorageAdapter } from './storage-adapter.interface';

export const storageAdapter: StorageAdapter = {
    async getItem<T>(key: string): Promise<T | null> {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        try { return JSON.parse(raw) as T; } catch { return null; }
    },
    async setItem<T>(key: string, value: T): Promise<void> {
        localStorage.setItem(key, JSON.stringify(value));
    },
    async removeItem(key: string): Promise<void> {
        localStorage.removeItem(key);
    },
    async clear(): Promise<void> {
        localStorage.clear();
    },
};