import { useEffect, useState } from 'react';
import { APODData, getTodayAPOD } from '../services/apodService';
import { addToHistory, APODHistoryItem, getHistory } from '../services/historyService';

export function useAPOD() {
  const [apod, setAPOD] = useState<APODData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<APODHistoryItem[]>([]);

  const loadAPOD = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTodayAPOD();
      setAPOD(data);
      await addToHistory(data);
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setAPOD(null);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const hist = await getHistory();
      setHistory(hist);
    } catch (err) {
      console.error('Error loading history:', err);
    }
  };

  const selectFromHistory = (item: APODHistoryItem) => {
    setAPOD(item);
  };

  useEffect(() => {
    loadAPOD();
  }, []);

  return {
    apod,
    loading,
    error,
    history,
    selectFromHistory,
    loadHistory,
  };
}
