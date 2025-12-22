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
            <Link
              to="/children"
              className="text-slate-700 hover:text-slate-900"
            >
              Enfants
            </Link>
            {/* lien caché ou non vers la zone cadeau, comme tu veux */}
            {/* <Link to="/cadeau" className="text-pink-700 hover:text-pink-900">
              🎁 Cadeau
            </Link> */}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          {/* page par défaut */}
          <Route path="/" element={<Navigate to="/today" replace />} />

          {/* 👇 double route pour être sûr de matcher avec ou sans slash */}
          <Route path="/cadeau" element={<Cadeau />} />
          <Route path="/cadeau/" element={<Cadeau />} />

          {/* pages principales */}
          <Route path="/today" element={<TodayPage />} />
          <Route path="/recap" element={<RecapPage />} />
          <Route path="/children" element={<ChildrenPage />} />

          {/* routes cadeau finales */}
          <Route
            path="/parent"
            element={<GiftPage recipient="parent" />}
          />
          <Route
            path="/margaux"
            element={<GiftPage recipient="margaux" />}
          />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/today" replace />} />
        </Routes>
      </main>
    </div>
  );
}
