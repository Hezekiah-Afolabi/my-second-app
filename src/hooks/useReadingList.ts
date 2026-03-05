import { useState, useEffect } from 'react';
import type { ReadingListEntry, ReadingStatus } from '../types';

const STORAGE_KEY = 'readright-reading-list';

export function useReadingList() {
  const [list, setList] = useState<ReadingListEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }, [list]);

  const addBook = (entry: Omit<ReadingListEntry, 'addedDate'>) => {
    setList(prev => {
      const existing = prev.find(e => e.bookId === entry.bookId);
      if (existing) {
        return prev.map(e =>
          e.bookId === entry.bookId ? { ...e, status: entry.status } : e
        );
      }
      return [...prev, { ...entry, addedDate: new Date().toISOString() }];
    });
  };

  const removeBook = (bookId: string) => {
    setList(prev => prev.filter(e => e.bookId !== bookId));
  };

  const updateStatus = (bookId: string, status: ReadingStatus) => {
    setList(prev =>
      prev.map(e => {
        if (e.bookId !== bookId) return e;
        return {
          ...e,
          status,
          startedDate:
            status === 'reading' && !e.startedDate
              ? new Date().toISOString()
              : e.startedDate,
          finishedDate:
            status === 'finished' ? new Date().toISOString() : e.finishedDate,
        };
      })
    );
  };

  const getStatus = (bookId: string): ReadingStatus | null => {
    return list.find(e => e.bookId === bookId)?.status ?? null;
  };

  const getByStatus = (status: ReadingStatus) =>
    list.filter(e => e.status === status);

  const isInList = (bookId: string) => list.some(e => e.bookId === bookId);

  return { list, addBook, removeBook, updateStatus, getStatus, getByStatus, isInList };
}
