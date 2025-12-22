import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TodayPage from "./pages/TodayPage";
import RecapPage from "./pages/RecapPage";
import ChildrenPage from "./pages/ChildrenPage"; // si tu l'as
import GiftPage from "./pages/GiftPage";
import Cadeau from "./pages/Cadeau";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold">
              Pointage maman
            </h1>
            <nav className="flex gap-3 text-sm">
              <a href="/today" className="text-slate-700 hover:text-slate-900">
                Aujourd&apos;hui
              </a>
              <a href="/recap" className="text-slate-700 hover:text-slate-900">
                Récap
              </a>
              <a
                href="/children"
                className="text-slate-700 hover:text-slate-900"
              >
                Enfants
              </a>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/today" replace />} />
            <Route path="/cadeau" element={<Cadeau />} /> 
            <Route path="/today" element={<TodayPage />} />
            <Route path="/recap" element={<RecapPage />} />
            <Route path="/children" element={<ChildrenPage />} />

            {/* Routes cadeau */}
            <Route
              path="/cadeau/parent"
              element={<GiftPage recipient="parent" />}
            />
            <Route
              path="/cadeau/margaux"
              element={<GiftPage recipient="margaux" />}
            />

            {/* fallback */}
            <Route path="*" element={<Navigate to="/today" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
