// src/components/children/ChildList.tsx
import { useState } from "react";
import type { Child } from "../../types";

interface ChildListProps {
  activeChildren: Child[];
  archivedChildren: Child[];
  onToggleArchive: (id: string) => void;
  onDelete?: (id: string) => void; // optionnel
}

export default function ChildList({
  activeChildren,
  archivedChildren,
  onToggleArchive,
  onDelete,
}: ChildListProps) {
  const [showArchived, setShowArchived] = useState(false);

  return (
    <div className="space-y-4">
      {/* Enfants actifs */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">
            Enfants actifs ({activeChildren.length})
          </h3>
        </div>

        {activeChildren.length === 0 ? (
          <p className="text-xs text-slate-500">
            Aucun enfant actif pour le moment. Ajoute un enfant avec le
            formulaire ci-dessus.
          </p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {activeChildren.map((child) => (
              <li
                key={child.id}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex flex-col gap-1 text-sm shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {child.color && (
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: child.color }}
                      />
                    )}
                    <span className="font-medium">
                      {child.firstName}{" "}
                      {child.lastName && (
                        <span className="text-slate-500">{child.lastName}</span>
                      )}
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Actif
                  </span>
                </div>

                {child.birthDate && (
                  <p className="text-xs text-slate-500">
                    Né(e) le {child.birthDate}
                  </p>
                )}

                {child.notes && (
                  <p className="text-xs text-slate-600 line-clamp-3">
                    {child.notes}
                  </p>
                )}

                <div className="flex justify-end gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => onToggleArchive(child.id)}
                    className="text-xs px-2 py-1 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                  >
                    Archiver
                  </button>
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Supprimer définitivement ${child.firstName} ?`
                          )
                        ) {
                          onDelete(child.id);
                        }
                      }}
                      className="text-xs px-2 py-1 rounded-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Enfants archivés */}
      <section className="space-y-2">
        <button
          type="button"
          onClick={() => setShowArchived((v) => !v)}
          className="flex items-center justify-between w-full text-xs text-slate-700 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-200"
        >
          <span>
            Enfants archivés ({archivedChildren.length})
            {archivedChildren.length === 0 && " – aucun"}
          </span>
          <span className="text-slate-500">
            {showArchived ? "Masquer" : "Afficher"}
          </span>
        </button>

        {showArchived && archivedChildren.length > 0 && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {archivedChildren.map((child) => (
              <li
                key={child.id}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex flex-col gap-1 text-sm shadow-sm opacity-80"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {child.color && (
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: child.color }}
                      />
                    )}
                    <span className="font-medium">
                      {child.firstName}{" "}
                      {child.lastName && (
                        <span className="text-slate-500">{child.lastName}</span>
                      )}
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200">
                    Archivé
                  </span>
                </div>

                {child.birthDate && (
                  <p className="text-xs text-slate-500">
                    Né(e) le {child.birthDate}
                  </p>
                )}

                {child.notes && (
                  <p className="text-xs text-slate-600 line-clamp-3">
                    {child.notes}
                  </p>
                )}

                <div className="flex justify-end gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => onToggleArchive(child.id)}
                    className="text-xs px-2 py-1 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  >
                    Réactiver
                  </button>
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Supprimer définitivement ${child.firstName} ?`
                          )
                        ) {
                          onDelete(child.id);
                        }
                      }}
                      className="text-xs px-2 py-1 rounded-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
