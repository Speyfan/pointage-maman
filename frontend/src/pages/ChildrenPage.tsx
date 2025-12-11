// src/pages/ChildrenPage.tsx
import ChildForm from "../components/children/ChildForm";
import ChildList from "../components/children/ChildList";
import { useChildren } from "../hooks/useChildren";

export default function ChildrenPage() {
  const {
    activeChildren,
    archivedChildren,
    addChild,
    toggleArchive,
    deleteChild,
  } = useChildren();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-slate-900">
          Gestion des enfants
        </h2>
        <p className="text-sm text-slate-600">
          Ici, ta mère pourra ajouter les enfants qu&apos;elle garde, les
          archiver lorsqu&apos;ils ne viennent plus, tout en gardant
          l&apos;historique des heures.
        </p>
      </div>

      <ChildForm onSubmit={addChild} />

      <ChildList
        activeChildren={activeChildren}
        archivedChildren={archivedChildren}
        onToggleArchive={toggleArchive}
        onDelete={deleteChild}
      />
    </div>
  );
}
