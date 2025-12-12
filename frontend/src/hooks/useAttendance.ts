import { useCallback, useRef, useState } from "react";
import { api } from "../api";
import type { Attendance } from "../types";

// Format brut renvoyé par l'API (Postgres)
interface AttendanceRow {
  id: string;
  child_id: string;
  date: string;           // "YYYY-MM-DD"
  check_in: string;       // "HH:MM:SS" ou "HH:MM"
  check_out: string | null; // idem ou null
  created_at: string;
}

function mapAttendanceRow(row: AttendanceRow): Attendance {
  const formatTime = (t: string | null): string | null => {
    if (!t) return null;
    // on garde HH:MM
    return t.slice(0, 5);
  };

  return {
    id: row.id,
    childId: row.child_id,
    date: row.date,
    checkIn: formatTime(row.check_in) || "",
    checkOut: formatTime(row.check_out),
  };
}

export function useAttendance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // cache local des présences, clé = childId
  const [recordsByChild, setRecordsByChild] = useState<
    Record<string, Attendance[]>
  >({});

  // compteur de requêtes en cours pour gérer loading global
  const pendingRef = useRef(0);

  function beginLoading() {
    pendingRef.current += 1;
    setLoading(true);
  }

  function endLoading() {
    pendingRef.current -= 1;
    if (pendingRef.current <= 0) {
      pendingRef.current = 0;
      setLoading(false);
    }
  }

  function getCachedForChild(childId: string): Attendance[] {
    return recordsByChild[childId] ?? [];
  }

  function setChildRecords(childId: string, records: Attendance[]) {
    setRecordsByChild((prev) => ({
      ...prev,
      [childId]: records,
    }));
  }

  const loadRangeForChild = useCallback(
    async (
      childId: string,
      start: string, // "YYYY-MM-DD"
      end: string    // "YYYY-MM-DD"
    ): Promise<Attendance[]> => {
      beginLoading();
      setError(null);

      try {
        const rows = await api.get<AttendanceRow[]>(
          `/attendance?childId=${encodeURIComponent(
            childId
          )}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
        );
        const mapped = rows.map(mapAttendanceRow);

        // on remplace le cache pour cet enfant par ce qui vient de l'API
        setChildRecords(childId, mapped);
        return mapped;
      } catch (err: any) {
        console.error("Erreur loadRangeForChild:", err);
        setError(err.message || "Erreur de chargement des présences");
        throw err;
      } finally {
        endLoading();
      }
    },
    []
  );

  // 🔹 Récupérer les présences d'un jour précis depuis le cache
  function getDayForChild(childId: string, date: string): Attendance[] {
    return getCachedForChild(childId).filter((r) => r.date === date);
  }

  // 🔹 Pointage d'arrivée
  async function checkIn(
    childId: string,
    options?: { date?: string; time?: string }
  ): Promise<Attendance> {
    const body: any = { childId };
    if (options?.date) body.date = options.date;
    if (options?.time) body.time = options.time;

    beginLoading();
    setError(null);

    try {
      const row = await api.post<AttendanceRow>("/attendance/check-in", body);
      const att = mapAttendanceRow(row);

      console.log("checkIn réponse API :", att);

      // on met à jour le cache pour cet enfant (remplace l'entrée du même id si jamais)
      const existing = getCachedForChild(childId).filter(
        (r) => r.id !== att.id
      );
      setChildRecords(childId, [...existing, att]);

      return att;
    } catch (err: any) {
      console.error("Erreur checkIn:", err);
      setError(err.message || "Erreur lors du pointage d'arrivée");
      throw err;
    } finally {
      endLoading();
    }
  }

  // 🔹 Pointage de départ
  async function checkOut(
    childId: string,
    options?: { date?: string; time?: string }
  ): Promise<Attendance> {
    const body: any = { childId };
    if (options?.date) body.date = options.date;
    if (options?.time) body.time = options.time;

    beginLoading();
    setError(null);

    try {
      const row = await api.post<AttendanceRow>("/attendance/check-out", body);
      const att = mapAttendanceRow(row);

      console.log("checkOut réponse API :", att);

      const existing = getCachedForChild(childId).filter(
        (r) => r.id !== att.id
      );
      setChildRecords(childId, [...existing, att]);

      return att;
    } catch (err: any) {
      console.error("Erreur checkOut:", err);
      setError(err.message || "Erreur lors du pointage de départ");
      throw err;
    } finally {
      endLoading();
    }
  }

  // 🔹 Modifier les heures (ou la date) d'une présence
  async function updateAttendance(
    id: string,
    data: {
      date?: string;
      checkIn?: string;
      checkOut?: string | null;
    }
  ): Promise<Attendance> {
    const body: any = {};
    if (data.date !== undefined) body.date = data.date;
    if (data.checkIn !== undefined) body.checkIn = data.checkIn;
    if (data.checkOut !== undefined) body.checkOut = data.checkOut;

    beginLoading();
    setError(null);

    try {
      const row = await api.patch<AttendanceRow>(`/attendance/${id}`, body);
      const att = mapAttendanceRow(row);

      const childId = att.childId;
      const existing = getCachedForChild(childId).filter(
        (r) => r.id !== att.id
      );
      setChildRecords(childId, [...existing, att]);

      return att;
    } catch (err: any) {
      console.error("Erreur updateAttendance:", err);
      setError(err.message || "Erreur lors de la mise à jour des heures");
      throw err;
    } finally {
      endLoading();
    }
  }

  return {
    loading,
    error,
    recordsByChild,
    loadRangeForChild,
    getCachedForChild,
    getDayForChild,
    checkIn,
    checkOut,
    updateAttendance,
  };
}
