import type { ContractData } from "../types/contract";

const STORAGE_KEY = "prenup-generator:v2";

export function saveToStorage(data: ContractData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // QuotaExceededError 等は無視
  }
}

export function loadFromStorage(): ContractData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ContractData;
    if (parsed.version !== 2) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasStoredData(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
