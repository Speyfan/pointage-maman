// src/hooks/useChildren.ts
import { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { Child } from "../type";

export interface NewChildInput {
  firstName: string;
  lastName?: string;
  birthDate?: string;
  notes?: string;
  color?: string;
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useChildren() {
  const [children, setChildren] = useLocalStorage<Child[]>("children", []);

  const activeChildren = useMemo(
    () => children.filter((c) => c.active),
    [children]
  );
  const archivedChildren = useMemo(
    () => children.filter((c) => !c.active),
    [children]
  );

  function addChild(input: NewChildInput) {
    const newChild: Child = {
      id: generateId(),
      firstName: input.firstName.trim(),
      lastName: input.lastName?.trim() || undefined,
      birthDate: input.birthDate || undefined,
      notes: input.notes?.trim() || undefined,
      color: input.color,
      active: true,
    };
    setChildren((prev) => [...prev, newChild]);
  }

  function updateChild(id: string, updates: Partial<Omit<Child, "id">>) {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === id ? { ...child, ...updates } : child
      )
    );
  }

  function toggleArchive(id: string) {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === id ? { ...child, active: !child.active } : child
      )
    );
  }

  function deleteChild(id: string) {
    // Optionnel : suppression définitive (à utiliser avec prudence)
    setChildren((prev) => prev.filter((child) => child.id !== id));
  }

  return {
    children,
    activeChildren,
    archivedChildren,
    addChild,
    updateChild,
    toggleArchive,
    deleteChild,
  };
}
