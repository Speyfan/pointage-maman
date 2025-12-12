import { useEffect, useMemo, useState } from "react";
import { useChildren } from "../hooks/useChildren";
import { useAttendance } from "../hooks/useAttendance";
import type { Attendance } from "../types";

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

interface EditTimes {
  checkIn: string;
  checkOut: string;
}

export default function TodayPage() {
  const { activeChildren } = useChildren();
  const {
    loading,
    error,
    loadRangeForChild,
    getDayForChild,
    checkIn,
    checkOut,
    updateAttendance,
  } = useAttendance();

  const [date, setDate] = useState<string>(getToday());
  const [editTimes, setEditTimes] = useState<Record<string, EditTimes>>({}); // clé = attendance.id

  // Charger les présences du jour pour tous les enfants actifs
  useEffect(() => {
    activeChildren.forEach((child) => {
      loadRangeForChild(child.id, date, date).catch((err) =>
        console.error("Erreur loadRangeForChild today:", err)
      );
    });
  }, [activeChildren, date, loadRangeForChild]);

  const hasChildren = useMemo(
    () => activeChildren && activeChildren.length > 0,
    [activeChildren]
  );

  const handleCheckIn = async (childId: string) => {
    try {
      await checkIn(childId, { date });
      // 🔁 On recharge la journée pour cet enfant
      await loadRangeForChild(childId, date, date);
    } catch (err) {
      console.error("Erreur lors du check-in (TodayPage):", err);
    }
  };

  const handleCheckOut = async (childId: string) => {
    try {
      await checkOut(childId, { date });
      // 🔁 On recharge la journée pour cet enfant
      await loadRangeForChild(childId, date, date);
    } catch (err) {
      console.error("Erreur lors du check-out (TodayPage):", err);
    }
  };

  const handleEditChange = (
    attendance: Attendance,
    field: keyof EditTimes,
    value: string
  ) => {
    setEditTimes((prev) => {
      const existing = prev[attendance.id] ?? {
        checkIn: attendance.checkIn ?? "",
        checkOut: attendance.checkOut ?? "",
      };
      return {
        ...prev,
        [attendance.id]: {
          ...existing,
          [field]: value,
        },
      };
    });
  };

  const handleSaveEdit = async (attendance: Attendance) => {
    const edit = editTimes[attendance.id] ?? {
      checkIn: attendance.checkIn,
      checkOut: attendance.checkOut ?? "",
    };

    try {
      await updateAttendance(attendance.id, {
        checkIn: edit.checkIn,
        checkOut: edit.checkOut ? edit.checkOut : null,
      });
      // Optionnel : recharger cette journée
      await loadRangeForChild(attendance.childId, attendance.date, attendance.date);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde des heures (TodayPage):", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-slate-900">
          Pointage du jour
        </h2>
        <p className="text-slate-600 text-sm">
          Enregistre les arrivées et départs des enfants pour la journée.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          Date du pointage
          <input
            type="date"
            className="border rounded-md px-2 py-1 text-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        {loading && (
          <span className="text-sm text-slate-500">Chargement…</span>
        )}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      {!hasChildren && (
        <p className="text-slate-500 text-sm">
          Aucun enfant actif. Ajoute des enfants dans l&apos;onglet dédié.
        </p>
      )}

      {hasChildren && (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Enfant
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Arrivée
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Départ
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {activeChildren.map((child) => {
                const records = getDayForChild(child.id, date);
                const attendance = records[0] as Attendance | undefined;

                const edit = attendance
                  ? editTimes[attendance.id] ?? {
                      checkIn: attendance.checkIn,
                      checkOut: attendance.checkOut ?? "",
                    }
                  : { checkIn: "", checkOut: "" };

                return (
                  <tr
                    key={child.id}
                    className="border-t border-slate-100 hover:bg-slate-50/50"
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        {child.color && (
                          <span
                            className="inline-block h-3 w-3 rounded-full border"
                            style={{ backgroundColor: child.color }}
                          />
                        )}
                        <span className="font-medium text-slate-800">
                          {child.firstName}
                          {child.lastName ? ` ${child.lastName}` : ""}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-2">
                      <input
                        type="time"
                        className="border rounded-md px-2 py-1 text-xs"
                        value={edit.checkIn}
                        onChange={(e) =>
                          attendance &&
                          handleEditChange(
                            attendance,
                            "checkIn",
                            e.target.value
                          )
                        }
                        disabled={!attendance}
                      />
                    </td>

                    <td className="px-3 py-2">
                      <input
                        type="time"
                        className="border rounded-md px-2 py-1 text-xs"
                        value={edit.checkOut}
                        onChange={(e) =>
                          attendance &&
                          handleEditChange(
                            attendance,
                            "checkOut",
                            e.target.value
                          )
                        }
                        disabled={!attendance}
                      />
                    </td>

                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="px-2 py-1 rounded-md bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:bg-emerald-300"
                          onClick={() => handleCheckIn(child.id)}
                        >
                          Arrivé
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 rounded-md bg-amber-600 text-white text-xs font-medium hover:bg-amber-700 disabled:bg-amber-300"
                          onClick={() => handleCheckOut(child.id)}
                          disabled={!attendance}
                        >
                          Parti
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 rounded-md border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-100 disabled:text-slate-300 disabled:border-slate-200"
                          onClick={() =>
                            attendance && handleSaveEdit(attendance)
                          }
                          disabled={!attendance}
                        >
                          Enregistrer les heures
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
