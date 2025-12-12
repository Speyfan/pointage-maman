import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api";
import type { Child } from "../types";

// type brut renvoyé par l'API (colonne Postgres)
interface ChildRow {
  id: string;
  first_name: string;
  last_name: string | null;
  birth_date: string | null;
  active: boolean;
  notes: string | null;
  color: string | null;
}

function mapChildFromRow(row: ChildRow): Child {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    birthDate: row.birth_date ? row.birth_date.slice(0, 10) : null,
    active: row.active,
    notes: row.notes,
    color: row.color,
  };
}

function buildChildPayload(input: {
  firstName: string;
  lastName?: string | null;
  birthDate?: string | null;
  notes?: string | null;
  color?: string | null;
}) {
  return {
    firstName: input.firstName,
    lastName: input.lastName ?? null,
    birthDate: input.birthDate ?? null,
    notes: input.notes ?? null,
    color: input.color ?? null,
  };
}

export function useChildren() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadChildren = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rows = await api.get<ChildRow[]>("/children");
      setChildren(rows.map(mapChildFromRow));
    } catch (err: any) {
      console.error("Erreur chargement enfants:", err);
      setError(err.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChildren();
  }, [loadChildren]);

  const activeChildren = useMemo(
    () => children.filter((c) => c.active),
    [children]
  );

  const archivedChildren = useMemo(
    () => children.filter((c) => !c.active),
    [children]
  );

  async function addChild(data: {
    firstName: string;
    lastName?: string | null;
    birthDate?: string | null;
    notes?: string | null;
    color?: string | null;
  }) {
    const payload = buildChildPayload(data);
    const row = await api.post<ChildRow>("/children", payload);
    const child = mapChildFromRow(row);
    setChildren((prev) => [...prev, child]);
    return child;
  }

  async function updateChild(
    id: string,
    data: Partial<{
      firstName: string;
      lastName: string | null;
      birthDate: string | null;
      notes: string | null;
      color: string | null;
      active: boolean;
    }>
  ) {
    const payload: any = {};
    if (data.firstName !== undefined) payload.firstName = data.firstName;
    if (data.lastName !== undefined) payload.lastName = data.lastName;
    if (data.birthDate !== undefined) payload.birthDate = data.birthDate;
    if (data.notes !== undefined) payload.notes = data.notes;
    if (data.color !== undefined) payload.color = data.color;
    if (data.active !== undefined) payload.active = data.active;

    const row = await api.patch<ChildRow>(`/children/${id}`, payload);
    const updated = mapChildFromRow(row);
    setChildren((prev) =>
      prev.map((c) => (c.id === id ? updated : c))
    );
    return updated;
  }

  async function archiveChild(id: string) {
    return updateChild(id, { active: false });
  }

  async function unarchiveChild(id: string) {
    return updateChild(id, { active: true });
  }

  return {
    children,
    activeChildren,
    archivedChildren,
    loading,
    error,
    reload: loadChildren,
    addChild,
    updateChild,
    archiveChild,
    unarchiveChild,
  };
}
