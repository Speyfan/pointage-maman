// src/components/children/ChildForm.tsx
import { useState, type FormEvent } from "react";
import type { NewChildInput } from "../../hooks/useChildren";

interface ChildFormProps {
  onSubmit: (data: NewChildInput) => void;
}

export default function ChildForm({ onSubmit }: ChildFormProps) {
  const [form, setForm] = useState<NewChildInput>({
    firstName: "",
    lastName: "",
    birthDate: "",
    notes: "",
    color: "#38bdf8", // bleu clair par défaut
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev: NewChildInput) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.firstName.trim()) return;
    onSubmit(form);
    setForm((prev: NewChildInput) => ({
      ...prev,
      firstName: "",
      lastName: "",
      birthDate: "",
      notes: "",
    }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm p-4 space-y-3 border border-slate-200"
    >
      <h3 className="text-sm font-semibold text-slate-800">
        Ajouter un enfant
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            name="firstName"
            value={form.firstName ?? "" as string}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="Ex : Emma"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Nom</label>
          <input
            name="lastName"
            value={form.lastName ?? "" as string}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="(optionnel)"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            Date de naissance
          </label>
          <input
            type="date"
            name="birthDate"
            value={form.birthDate ?? "" as string}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            Couleur (pour l&apos;affichage)
          </label>
          <input
            type="color"
            name="color"
            value={form.color ?? "" as string}
            onChange={handleChange}
            className="h-9 w-full rounded-lg border border-slate-300 px-2 py-1"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Notes</label>
        <textarea
          name="notes"
          value={form.notes ?? "" as string}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[60px]"
          placeholder="Infos importantes, allergies, sieste, etc."
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center rounded-lg bg-slate-900 text-white text-sm px-3 py-1.5 font-medium hover:bg-slate-800 active:scale-[0.99] transition"
        >
          Ajouter
        </button>
      </div>
    </form>
  );
}
