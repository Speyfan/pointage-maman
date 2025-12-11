// src/pages/RecapPage.tsx
import { useMemo, useState } from "react";
import { useChildren } from "../hooks/useChildren";
import { useAttendance } from "../hooks/useAttendance";
import RecapTable from "../components/recap/RecapTable";
import { durationBetween } from "../utils/time";

interface DayRecap {
  date: string; // YYYY-MM-DD
  intervals: { checkIn: string; checkOut: string | null }[];
  totalMinutes: number;
}

function getTodayDateISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function getFirstDayOfCurrentMonthISO() {
  const d = new Date();
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  return first.toISOString().slice(0, 10);
}

export default function RecapPage() {
  const { children } = useChildren();
  const { getAttendancesBetween } = useAttendance();

  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(
    getFirstDayOfCurrentMonthISO
  );
  const [endDate, setEndDate] = useState<string>(getTodayDateISO);

  const selectedChild = useMemo(
    () => children.find((c) => c.id === selectedChildId),
    [children, selectedChildId]
  );

  const { days, totalMinutes } = useMemo(() => {
    if (!selectedChildId || !startDate || !endDate) {
      return { days: [] as DayRecap[], totalMinutes: 0 };
    }

    const all = getAttendancesBetween(startDate, endDate).filter(
      (a) => a.childId === selectedChildId
    );

    // Regroupement par date
    const map = new Map<string, DayRecap>();

    for (const a of all) {
      if (!map.has(a.date)) {
        map.set(a.date, {
          date: a.date,
          intervals: [],
          totalMinutes: 0,
        });
      }
      const day = map.get(a.date)!;
      day.intervals.push({ checkIn: a.checkIn, checkOut: a.checkOut ?? null });

      if (a.checkOut) {
        day.totalMinutes += durationBetween(a.checkIn, a.checkOut);
      }
    }

    const daysArray = Array.from(map.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    const total = daysArray.reduce((sum, d) => sum + d.totalMinutes, 0);

    return { days: daysArray, totalMinutes: total };
  }, [selectedChildId, startDate, endDate, getAttendancesBetween]);

  return (
    <div className="space-y-4 print:bg-white">
      <div className="flex flex-col gap-1 print:hidden">
        <h2 className="text-xl font-semibold text-slate-900">
          Récapitulatif des heures
        </h2>
        <p className="text-sm text-slate-600">
          Choisis un enfant et une période. Tu pourras ensuite imprimer la
          page.
        </p>
      </div>

      {/* Filtres (cachés à l'impression) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Enfant */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Enfant
            </label>
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="">— Sélectionner un enfant —</option>
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName}
                  {c.lastName ? ` ${c.lastName}` : ""}{" "}
                  {!c.active ? "(archivé)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Date début */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Date de début
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Date fin */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Date de fin
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          Astuce : tu peux faire un récap par mois (ex : 01 → fin du mois), ou
          pour une période de facturation précise.
        </p>
      </div>

      {/* Zone imprimable */}
      {selectedChild ? (
        <RecapTable
          childName={`${selectedChild.firstName}${
            selectedChild.lastName ? " " + selectedChild.lastName : ""
          }`}
          periodStart={startDate}
          periodEnd={endDate}
          days={days}
          totalMinutes={totalMinutes}
        />
      ) : (
        <p className="text-sm text-slate-500 print:hidden">
          Sélectionne un enfant pour afficher le récapitulatif.
        </p>
      )}
    </div>
  );
}
