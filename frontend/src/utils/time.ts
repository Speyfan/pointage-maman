// src/utils/time.ts

// "HH:mm" -> minutes depuis 00:00
export function parseHHMMToMinutes(hhmm: string): number {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }
  
  // minutes -> "HhMM" (ex : 1h30, 0h45, 8h00)
  export function formatMinutesToHours(mins: number): string {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const mStr = String(m).padStart(2, "0");
    return `${h}h${mStr}`;
  }
  
  // durée en minutes entre deux "HH:mm"
  // (on suppose que ça ne passe pas minuit)
  export function durationBetween(start: string, end: string): number {
    const s = parseHHMMToMinutes(start);
    const e = parseHHMMToMinutes(end);
    if (e < s) return 0;
    return e - s;
  }
  