// src/components/recap/RecapTable.tsx
import { formatMinutesToHours } from "../../utils/time";

export interface DayRecap {
  date: string; // YYYY-MM-DD
  intervals: { checkIn: string; checkOut: string | null }[];
  totalMinutes: number;
}

interface RecapTableProps {
  childName: string;
  periodStart: string;
  periodEnd: string;
  days: DayRecap[];
  totalMinutes: number;
}

export default function RecapTable({
  childName,
  periodStart,
  periodEnd,
  days,
  totalMinutes,
}: RecapTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 print:border-0 print:shadow-none">
      {/* En-tête (imprimable) */}
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="text-lg font-semibold text-slate-900 print:text-center">
          Récapitulatif des heures
        </h3>
        <p className="text-sm text-slate-700 print:text-center">
          Enfant : <span className="font-medium">{childName}</span>
        </p>
        <p className="text-xs text-slate-600 print:text-center">
          Période du <span className="font-medium">{periodStart}</span> au{" "}
          <span className="font-medium">{periodEnd}</span>
        </p>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto print:overflow-visible">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-200 px-2 py-1 text-left text-xs font-semibold text-slate-700">
                Date
              </th>
              <th className="border border-slate-200 px-2 py-1 text-left text-xs font-semibold text-slate-700">
                Intervalles
              </th>
              <th className="border border-slate-200 px-2 py-1 text-right text-xs font-semibold text-slate-700">
                Total (jour)
              </th>
            </tr>
          </thead>
          <tbody>
            {days.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="border border-slate-200 px-2 py-4 text-center text-xs text-slate-500"
                >
                  Aucune présence sur cette période.
                </td>
              </tr>
            ) : (
              days.map((day) => (
                <tr key={day.date}>
                  <td className="border border-slate-200 px-2 py-1 text-xs text-slate-800">
                    {day.date}
                  </td>
                  <td className="border border-slate-200 px-2 py-1 text-xs text-slate-700">
                    {day.intervals.map((i, idx) => (
                      <div key={idx}>
                        {i.checkIn} →{" "}
                        {i.checkOut ? i.checkOut : "— (en cours)"}
                      </div>
                    ))}
                  </td>
                  <td className="border border-slate-200 px-2 py-1 text-xs text-right text-slate-800">
                    {formatMinutesToHours(day.totalMinutes)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {/* Total périodique */}
          <tfoot>
            <tr className="bg-slate-50">
              <td className="border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-800">
                Total période
              </td>
              <td className="border border-slate-200 px-2 py-2" />
              <td className="border border-slate-200 px-2 py-2 text-xs font-semibold text-right text-slate-900">
                {formatMinutesToHours(totalMinutes)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-6 flex justify-end print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 active:scale-[0.99] transition"
        >
          Imprimer la page
        </button>
      </div>
    </div>
  );
}
