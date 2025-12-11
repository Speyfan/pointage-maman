// src/types.ts ou types.tsx

export interface Child {
  id: string;
  firstName: string;
  lastName?: string | null;
  birthDate?: string | null; // "YYYY-MM-DD"
  active: boolean;
  notes?: string | null;
  color?: string | null;
}

export interface Attendance {
  id: string;
  childId: string;
  date: string;         // "YYYY-MM-DD"
  checkIn: string;      // "HH:mm"
  checkOut: string | null; // "HH:mm" ou null si encore présent
}
