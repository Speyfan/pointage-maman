// src/types.ts
export type ChildId = string;
export type AttendanceId = string;

export interface Child {
  id: ChildId;
  firstName: string;
  lastName?: string;
  birthDate?: string; // "YYYY-MM-DD"
  active: boolean;    // false = archivé
  notes?: string;
  color?: string;     // pour distinguer visuellement (optionnel)
}

export interface Attendance {
  id: AttendanceId;
  childId: ChildId;
  date: string;       // "YYYY-MM-DD"
  checkIn: string;    // ISO string ou "HH:mm"
  checkOut?: string | null; // null = encore présent
}
