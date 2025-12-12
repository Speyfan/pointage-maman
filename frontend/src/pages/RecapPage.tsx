import { useMemo, useState } from "react";
import { useChildren } from "../hooks/useChildren";
import { useAttendance } from "../hooks/useAttendance";
import type { Attendance } from "../types";

interface EditTimes {
  checkIn: string;
  checkOut: string;
}

function getMonthStart(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-01`;
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function diffMinutes(start: string, end: string): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const diff = endMin - startMin;
  return diff > 0 ? diff : 0;
}

function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}h${String(m).padStart(2, "0")}`;
}

export default function RecapPage() {
  const { activeChildren } = useChildren();
  const {
    loading,
    error,
    loadRangeForChild,
    getCachedForChild,
    updateAttendance,
  } = useAttendance();

  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(getMonthStart());
  const [endDate, setEndDate] = useState<string>(getToday());
  const [editTimes, setEditTimes] = useState<Record<string, EditTimes>>({});

  const selectedChild = useMemo(
    () => activeChildren.find((c) => c.id === selectedChildId),
    [activeChildren, selectedChildId]
  );

  const records = useMemo(
    () =>
      selectedChildId
        ? getCachedForChild(selectedChildId).filter(
            (r) => r.date >= startDate && r.date <= endDate
          )
        : [],
    [selectedChildId, startDate, endDate, getCachedForChild]
  );

  const groupedByDate = useMemo(() => {
    const map = new Map<string, Attendance[]>();
    for (const r of records) {
      if (!map.has(r.date)) {
        map.set(r.date, []);
      }
      map.get(r.date)!.push(r);
    }
    return Array.from(map.entries()).sort(([d1], [d2]) =>
      d1.localeCompare(d2)
    );
  }, [records]);

  const totalMinutes = useMemo(
    () =>
      records.reduce(
        (sum, r) => sum + diffMinutes(r.checkIn, r.checkOut ?? ""),
        0
      ),
    [records]
  );

  const handleLoad = async () => {
    if (!selectedChildId) return;
    try {
      await loadRangeForChild(selectedChildId, startDate, endDate);
    } catch (err) {
      console.error("Erreur lors du chargement du récap :", err);
    }
  };

  const handleEditChange = (
    att: Attendance,
    field: keyof EditTimes,
    value: string
  ) => {
    setEditTimes((prev) => {
      const existing = prev[att.id] ?? {
        checkIn: att.checkIn,
        checkOut: att.checkOut ?? "",
      };
      return {
        ...prev,
        [att.id]: {
          ...existing,
          [field]: value,
        },
      };
    });
  };

  const handleSaveEdit = async (att: Attendance) => {
    const edit = editTimes[att.id] ?? {
      checkIn: att.checkIn,
      checkOut: att.checkOut ?? "",
    };

    try {
      await updateAttendance(att.id, {
        checkIn: edit.checkIn,
        checkOut: edit.checkOut ? edit.checkOut : null,
      });
    } catch (err) {
      console.error("Erreur lors de la sauvegarde des heures (RecapPage):", err);
    }
  };

  return (
    <div className="space-y-4 print:bg-white">
      <div className="flex flex-col gap-1 print:hidden">
        <h2 className="text-xl font-semibold text-slate-900">
          Récapitulatif des heures
        </h2>
        <p className="text-slate-600 text-sm">
          Sélectionne un enfant et une période pour obtenir un récapitulatif
          imprimable.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3 print:hidden">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">
            Enfant
          </label>
          <select
            className="border rounded-md px-2 py-1 text-sm min-w-[180px]"
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
          >
            <option value="">Sélectionner…</option>
            {activeChildren.map((child) => (
              <option key={child.id} value={child.id}>
                {child.firstName}
                {child.lastName ? ` ${child.lastName}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">
            Du
          </label>
          <input
            type="date"
            className="border rounded-md px-2 py-1 text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">
            Au
          </label>
          <input
            type="date"
            className="border rounded-md px-2 py-1 text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="h-9 px-3 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:bg-slate-300"
          onClick={handleLoad}
          disabled={!selectedChildId}
        >
          Charger le récap
        </button>

        {loading && (
          <span className="text-sm text-slate-500">Chargement…</span>
        )}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      {selectedChild && (
        <div className="space-y-2">
          <div className="flex items-center justify-between print:flex-col print:items-start print:gap-1">
            <div>
              <p className="font-semibold text-slate-900">
                {selectedChild.firstName}
                {selectedChild.lastName ? ` ${selectedChild.lastName}` : ""}
              </p>
              <p className="text-slate-600 text-xs">
                Période du {startDate} au {endDate}
              </p>
            </div>
            <div className="flex items-center gap-3 print:hidden">
              <p className="text-sm font-medium text-slate-800">
                Total : {formatMinutes(totalMinutes)}
              </p>
              <button
                type="button"
                className="px-3 py-1 rounded-md border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-100"
                onClick={() => window.print()}
              >
                Imprimer
              </button>
            </div>
          </div>

          {groupedByDate.length === 0 && (
            <p className="text-sm text-slate-500">
              Aucun pointage trouvé pour cette période.
            </p>
          )}

          {groupedByDate.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">
                      Date
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">
                      Arrivée
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">
                      Départ
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">
                      Durée
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700 print:hidden">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupedByDate.map(([date, list]) => {
                    // on suppose 1 enregistrement par jour pour simplifier
                    const att = list[0];
                    const edit = editTimes[att.id] ?? {
                      checkIn: att.checkIn,
                      checkOut: att.checkOut ?? "",
                    };
                    const minutes = diffMinutes(
                      att.checkIn,
                      att.checkOut ?? ""
                    );

                    return (
                      <tr
                        key={att.id}
                        className="border-t border-slate-100 hover:bg-slate-50/50"
                      >
                        <td className="px-3 py-2">{date}</td>
                        <td className="px-3 py-2">
                          <input
                            type="time"
                            className="border rounded-md px-2 py-1 text-xs"
                            value={edit.checkIn}
                            onChange={(e) =>
                              handleEditChange(att, "checkIn", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="time"
                            className="border rounded-md px-2 py-1 text-xs"
                            value={edit.checkOut}
                            onChange={(e) =>
                              handleEditChange(att, "checkOut", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-3 py-2">
                          {minutes > 0 ? formatMinutes(minutes) : "-"}
                        </td>
                        <td className="px-3 py-2 print:hidden">
                          <button
                            type="button"
                            className="px-2 py-1 rounded-md border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-100"
                            onClick={() => handleSaveEdit(att)}
                          >
                            Enregistrer
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  <tr className="border-t border-slate-200 bg-slate-50">
                    <td className="px-3 py-2 font-semibold">Total</td>
                    <td />
                    <td />
                    <td className="px-3 py-2 font-semibold">
                      {formatMinutes(totalMinutes)}
                    </td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
