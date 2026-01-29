import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const NASA_API_KEY = process.env.EXPO_PUBLIC_NASA_API_KEY || '';
const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod';

export interface APODData {
  date: string;
  title: string;
  explanation: string;
  url: string;
  media_type: 'image' | 'video';
  hdurl?: string;
  copyright?: string;
}

const STORAGE_KEY = 'apod_cache';
const TODAY_KEY = 'apod_today_date';

/**
 * Fetches the NASA APOD (Astronomy Picture of the Day) for a specific date or today
 */
export async function fetchAPOD(date?: string): Promise<APODData> {
  try {
    const params = {
      api_key: NASA_API_KEY,
      ...(date && { date }),
    };

    const response = await axios.get<APODData>(NASA_APOD_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching APOD:', error);
    throw new Error('Failed to fetch APOD data');
  }
}

/**
 * Fetches and caches today's APOD image
 */
export async function getTodayAPOD(): Promise<APODData> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const cachedDate = await AsyncStorage.getItem(TODAY_KEY);

    // If we have today's cache, return it
    if (cachedDate === today) {
      const cachedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    }

    // Otherwise fetch fresh data
    const apodData = await fetchAPOD();
    
    // Save to cache
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(apodData));
    await AsyncStorage.setItem(TODAY_KEY, today);

    return apodData;
  } catch (error) {
    // If API fails, try to load old cache
    console.warn('Error getting today APOD, trying cache:', error);
    const cachedData = await AsyncStorage.getItem(STORAGE_KEY);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    throw error;
  }
}

/**
 * Fetches APOD image for a specific date
 */
export async function getAPODForDate(date: string): Promise<APODData> {
  try {
    return await fetchAPOD(date);
  } catch (error) {
    console.error(`Error fetching APOD for ${date}:`, error);
    throw error;
  }
}

/**
 * Clears the cached APOD data
 */
export async function clearCache(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEY, TODAY_KEY]);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}
