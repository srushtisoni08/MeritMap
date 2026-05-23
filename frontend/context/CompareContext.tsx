"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { College } from "@/lib/types";

interface CompareContextValue {
  compareList: College[];
  addToCompare: (college: College) => void;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
  isInCompare: (id: number) => boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<College[]>([]);

  const addToCompare = useCallback((college: College) => {
    setCompareList((prev) => {
      if (prev.find((c) => c.id === college.id)) return prev;
      if (prev.length >= 3) return prev; // max 3
      return [...prev, college];
    });
  }, []);

  const removeFromCompare = useCallback((id: number) => {
    setCompareList((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearCompare = useCallback(() => setCompareList([]), []);

  const isInCompare = useCallback(
    (id: number) => compareList.some((c) => c.id === id),
    [compareList]
  );

  return (
    <CompareContext.Provider
      value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}