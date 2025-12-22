// src/App.tsx
import { Routes, Route, Navigate, Link } from "react-router-dom";
import TodayPage from "./pages/TodayPage";
import RecapPage from "./pages/RecapPage";
import ChildrenPage from "./pages/ChildrenPage";
import GiftPage from "./pages/GiftPage";
import Cadeau from "./pages/Cadeau";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Pointage maman</h1>
          <nav className="flex gap-3 text-sm">
            <Link to="/today" className="text-slate-700 hover:text-slate-900">
              Aujourd&apos;hui
            </Link>
            <Link to="/recap" className="text-slate-700 hover:text-slate-900">
              Récap
            </Link>
            <Link to="/children" className="text-slate-700 hover:text-slate-900">
              Enfants
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          {/* Redirection par défaut vers today */}
          <Route path="/" element={<Navigate to="/today" replace />} />

          {/* Pages principales */}
          <Route path="/today" element={<TodayPage />} />
          <Route path="/recap" element={<RecapPage />} />
          <Route path="/children" element={<ChildrenPage />} />

          {/* Page “cadeau” d’entrée (écran ultra kitsch) */}
          <Route path="/cadeau" element={<Cadeau />} />

          {/* Routes cadeau finales */}
          <Route
            path="/cadeau/parent"
            element={<GiftPage recipient="parent" />}
          />
          <Route
            path="/cadeau/margaux"
            element={<GiftPage recipient="margaux" />}
          />

          {/* fallback : toute URL inconnue renvoie vers /today */}
          <Route path="*" element={<Navigate to="/today" replace />} />
        </Routes>
      </main>
    </div>
  );
}
