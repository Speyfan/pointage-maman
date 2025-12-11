// src/App.tsx
import { useState } from "react";
import ChildrenPage from "./pages/ChildrenPage";
import TodayPage from "./pages/TodayPage";
import RecapPage from "./pages/RecapPage";

type Tab = "children" | "today" | "recap";

export default function App() {
  const [tab, setTab] = useState<Tab>("today");

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white shadow-sm print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Pointage Assistante Maternelle</h1>
          <nav className="flex gap-2">
            <button
              onClick={() => setTab("today")}
              className={`px-3 py-1 rounded-full text-sm border ${
                tab === "today"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              Pointage du jour
            </button>
            <button
              onClick={() => setTab("children")}
              className={`px-3 py-1 rounded-full text-sm border ${
                tab === "children"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              Enfants
            </button>
            <button
              onClick={() => setTab("recap")}
              className={`px-3 py-1 rounded-full text-sm border ${
                tab === "recap"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              Récaps
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-4">
        {tab === "today" && <TodayPage />}
        {tab === "children" && <ChildrenPage />}
        {tab === "recap" && <RecapPage />}
      </main>
    </div>
  );
}
