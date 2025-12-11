// src/pages/TodayPage.tsx
import { useState, useMemo } from "react";
import { useChildren } from "../hooks/useChildren";
import { useAttendance } from "../hooks/useAttendance";

function getTodayDateISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export default function TodayPage() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateISO);
  const { activeChildren } = useChildren();
  const {
    getChildAttendancesForDate,
    getChildStatusForDate,
    checkIn,
    checkOut,
  } = useAttendance();

  const isToday = useMemo(
    () => selectedDate === getTodayDateISO(),
    [selectedDate]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-slate-900">
          Pointage du jour
        </h2>
        <p className="text-sm text-slate-600">
          Choisis une date puis marque l&apos;arrivée et le départ des enfants
          en un clic.
        </p>
      </div>

      {/* Sélection de date */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center gap-3 shadow-sm">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            Date du pointage
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        {isToday && (
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Aujourd&apos;hui
          </span>
        )}
        <div className="ml-auto text-[11px] text-slate-500">
          Tip : ta mère peut laisser cette page ouverte sur sa tablette / PC.
        </div>
      </div>

      {/* Légende simple */}
      <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
        <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
          ● Pas arrivé
        </span>
        <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
          ● Présent
        </span>
        <span className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200">
          ● Parti
        </span>
      </div>

      {/* Liste des enfants actifs */}
      {activeChildren.length === 0 ? (
        <p className="text-sm text-slate-500">
          Aucun enfant actif. Ajoute d&apos;abord des enfants dans l&apos;onglet
          &quot;Enfants&quot;.
        </p>
      ) : (
        <ul className="space-y-2">
          {activeChildren.map((child) => {
            const status = getChildStatusForDate(child.id, selectedDate);
            const dayAttendances = getChildAttendancesForDate(
              child.id,
              selectedDate
            );

            const statusLabel =
              status === "here"
                ? "Présent"
                : status === "left"
                ? "Parti"
                : "Pas arrivé";

            const statusClasses =
              status === "here"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : status === "left"
                ? "bg-slate-50 text-slate-600 border-slate-200"
                : "bg-amber-50 text-amber-700 border-amber-200";

            return (
              <li
                key={child.id}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {child.color && (
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: child.color }}
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">
                        {child.firstName}{" "}
                        {child.lastName && (
                          <span className="text-slate-500">
                            {child.lastName}
                          </span>
                        )}
                      </span>
                      {child.birthDate && (
                        <span className="text-[11px] text-slate-500">
                          Né(e) le {child.birthDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full border ${statusClasses}`}
                  >
                    {statusLabel}
                  </span>
                </div>

                {/* Historique du jour */}
                <div className="mt-2 text-[11px] text-slate-600 space-y-1">
                  {dayAttendances.length === 0 ? (
                    <p>Aucun pointage pour cette date.</p>
                  ) : (
                    <ul className="space-y-0.5">
                      {dayAttendances.map((a) => (
                        <li key={a.id}>
                          {a.checkIn} →{" "}
                          {a.checkOut ? (
                            a.checkOut
                          ) : (
                            <span className="text-emerald-700 font-medium">
                              en cours…
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Boutons d'action */}
                <div className="mt-2 flex justify-end gap-2">
                  {(status === "not-arrived" || status === "left") && (
                    <button
                      type="button"
                      onClick={() => checkIn(child.id, selectedDate)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 active:scale-[0.99] transition"
                    >
                      Arrivé
                    </button>
                  )}
                  {status === "here" && (
                    <button
                      type="button"
                      onClick={() => checkOut(child.id, selectedDate)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 active:scale-[0.99] transition"
                    >
                      Parti
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
