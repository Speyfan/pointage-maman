// src/hooks/useAttendance.ts
import { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { Attendance } from "../type";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getCurrentTimeHHMM() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export function useAttendance() {
  const [attendances, setAttendances] = useLocalStorage<Attendance[]>(
    "attendances",
    []
  );

  const sortedAttendances = useMemo(
    () =>
      [...attendances].sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.checkIn.localeCompare(b.checkIn);
      }),
    [attendances]
  );

  function getAttendancesByDate(date: string) {
    return sortedAttendances.filter((a) => a.date === date);
  }

  function getChildAttendancesForDate(childId: string, date: string) {
    return sortedAttendances.filter(
      (a) => a.childId === childId && a.date === date
    );
  }

  function getOpenAttendance(childId: string, date: string) {
    return sortedAttendances.find(
      (a) => a.childId === childId && a.date === date && !a.checkOut
    );
  }

  function getChildStatusForDate(
    childId: string,
    date: string
  ): "not-arrived" | "here" | "left" {
    const list = getChildAttendancesForDate(childId, date);
    if (list.length === 0) return "not-arrived";
    const hasOpen = list.some((a) => !a.checkOut);
    return hasOpen ? "here" : "left";
  }

  function checkIn(childId: string, date: string) {
    // Si déjà une présence ouverte pour cet enfant à cette date, on ne recrée pas
    const existing = getOpenAttendance(childId, date);
    if (existing) return;

    const newAttendance: Attendance = {
      id: generateId(),
      childId,
      date,
      checkIn: getCurrentTimeHHMM(),
      checkOut: null,
    };

    setAttendances((prev) => [...prev, newAttendance]);
  }

  function checkOut(childId: string, date: string) {
    const open = getOpenAttendance(childId, date);
    if (!open) return;

    const time = getCurrentTimeHHMM();
    setAttendances((prev) =>
      prev.map((a) =>
        a.id === open.id
          ? {
              ...a,
              checkOut: time,
            }
          : a
      )
    );
  }

  // Utile plus tard pour les récap, mais déjà prêt
  function getAttendancesBetween(start: string, end: string) {
    return sortedAttendances.filter(
      (a) => a.date >= start && a.date <= end
    );
  }

  return {
    attendances: sortedAttendances,
    getAttendancesByDate,
    getChildAttendancesForDate,
    getChildStatusForDate,
    checkIn,
    checkOut,
    getAttendancesBetween,
  };
}
