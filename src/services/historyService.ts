import AsyncStorage from '@react-native-async-storage/async-storage';
import { APODData } from './apodService';

const HISTORY_KEY = 'apod_history';
const MAX_HISTORY = 50;

export interface APODHistoryItem extends APODData {
  addedAt: string; // ISO timestamp
}

/**
 * Pridaj fotku do histórie
 */
export async function addToHistory(apod: APODData): Promise<void> {
  try {
    const history = await getHistory();

    // Ak fotka už existuje, presuň ju na začiatok
    const filtered = history.filter((item) => item.date !== apod.date);

    const newHistory: APODHistoryItem[] = [
      { ...apod, addedAt: new Date().toISOString() },
      ...filtered,
    ].slice(0, MAX_HISTORY);

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error adding to history:', error);
  }
}

/**
 * Načítaj históriu fotiek
 */
export async function getHistory(): Promise<APODHistoryItem[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
}

/**
 * Vymaž históriu
 */
export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
}
