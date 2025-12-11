import { useState, useCallback } from "react";

interface UseContentHistoryReturn {
  content: string;
  setContent: (newContent: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetHistory: (initialContent: string) => void;
}

export function useContentHistory(initialContent: string = ""): UseContentHistoryReturn {
  const [history, setHistory] = useState<string[]>([initialContent]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const content = history[currentIndex] || "";

  const setContent = useCallback((newContent: string) => {
    // Don't add to history if content is the same
    if (newContent === history[currentIndex]) return;

    // Remove any "future" history if we're not at the end
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newContent);
    
    // Keep history reasonable (max 50 entries)
    if (newHistory.length > 50) {
      newHistory.shift();
      setHistory(newHistory);
    } else {
      setHistory(newHistory);
      setCurrentIndex(newHistory.length - 1);
    }
  }, [history, currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

  const resetHistory = useCallback((initialContent: string) => {
    setHistory([initialContent]);
    setCurrentIndex(0);
  }, []);

  return {
    content,
    setContent,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    resetHistory,
  };
}
