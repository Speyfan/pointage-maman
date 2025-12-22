import { useEffect, useState } from "react";
import cadeauMargaux from '../../img/cadeaux_margaux.jpg';
import cadeauParents from '../../img/cadeau_parents.jpg';

type Recipient = "parent" | "margaux";

interface GiftPageProps {
  recipient: Recipient;
}

type Step = "intro" | "warning" | "reveal";

export default function GiftPage({ recipient }: GiftPageProps) {
  const [step, setStep] = useState<Step>("intro");

  useEffect(() => {
    let timer: number | undefined;
    if (step === "warning") {
      timer = window.setTimeout(() => {
        setStep("reveal");
      }, 5000);
    }
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [step]);

  const recipientLabel =
    recipient === "parent" ? "les parents" : "Margaux";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-yellow-300 to-sky-400">
      {/* Styles locaux pour les clignotements bien kitsch */}
      <style>
        {`
        @keyframes blink-slow {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
        .blink-slow {
          animation: blink-slow 1.2s infinite;
        }

        @keyframes blink-fast {
          0%, 50%, 100% { opacity: 1; }
          20%, 60% { opacity: 0; }
        }
        .blink-fast {
          animation: blink-fast 0.35s infinite;
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .wiggle {
          animation: wiggle 0.4s infinite;
        }
      `}
      </style>

      <div className="relative h-full max-w-lg w-full mx-4">
        {/* Confettis / étoiles en fond */}
        <div className="pointer-events-none select-none absolute -inset-6 blur-[1px] opacity-70">
          <div className="w-full h-full bg-[radial-gradient(circle_at_10%_20%,_#fff_0,_transparent_40%),_radial-gradient(circle_at_80%_0,_#f0f_0,_transparent_40%),_radial-gradient(circle_at_0_80%,_#0ff_0,_transparent_40%),_radial-gradient(circle_at_90%_90%,_#ff0_0,_transparent_40%)] animate-pulse" />
        </div>

        <div className="relative rounded-3xl border-4 border-yellow-300 bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-700 text-white shadow-2xl shadow-fuchsia-700/70 px-6 py-8 text-center overflow-hidden">
          {/* Bandeau qui clignote */}
          {step === 'intro' &&  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 bg-yellow-300 text-fuchsia-800 text-xs font-extrabold px-6 py-1 rounded-full uppercase tracking-[0.3em] blink-fast">
            ★ Bonus spécial ★
          </div>}
          {step === 'warning' &&  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 bg-red-400 text-white text-xs font-extrabold px-6 py-1 rounded-full uppercase tracking-[0.3em] blink-fast">
            ⚠️ Appareil infecté ⚠️
          </div>}

          {step === "intro" && (
            <div className="space-y-6">
              <div className="text-4xl sm:text-5xl font-black leading-tight blink-slow">
                🎁 VOUS AVEZ GAGNÉ !!! 🎁
              </div>
              <div className="text-sm sm:text-base font-semibold">
                Félicitations {recipientLabel} ! <br />
                Vous avez débloqué un{" "}
                <span className="underline decoration-wavy decoration-yellow-300">
                  SUPER CADEAU SURPRISE
                </span>
                .
              </div>

              <div className="flex justify-center gap-3 text-3xl wiggle">
                <span>🎉</span>
                <span>✨</span>
                <span>🎊</span>
                <span>💥</span>
              </div>

              <button
                type="button"
                onClick={() => setStep("warning")}
                className="mt-4 inline-flex items-center justify-center px-6 py-3 rounded-full bg-yellow-300 text-fuchsia-900 font-bold text-sm sm:text-base shadow-lg shadow-yellow-500/70 hover:scale-105 transition-transform"
              >
                Découvrir le cadeau
                <span className="ml-2 animate-bounce">➡️</span>
              </button>

            </div>
          )}
          {step === "warning" && (
            <div className="space-y-5">
              <div className="text-3xl sm:text-4xl font-black text-red-400 blink-fast">
                ⚠️ DANGER ⚠️
              </div>
              <div className="text-2xl sm:text-3xl font-black text-yellow-300 wiggle">
                VIRUS DÉTECTÉ !!!
              </div>
              <div className="text-xs sm:text-sm font-semibold uppercase tracking-wide">
                Analyse en cours de votre appareil…
              </div>

              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <span className="px-3 py-1 rounded-full bg-red-600/80 text-[11px] sm:text-xs blink-fast">
                  ⚡ ALERTE CRITIQUE
                </span>
                <span className="px-3 py-1 rounded-full bg-yellow-400/80 text-[11px] sm:text-xs">
                  🔥 RISQUE MAXIMAL
                </span>
                <span className="px-3 py-1 rounded-full bg-lime-400/80 text-[11px] sm:text-xs blink-slow">
                  🦠 SCAN EN COURS…
                </span>
              </div>

            </div>
          )}

          {step === "reveal" && (
            <div className="space-y-5">
              <div className="text-3xl sm:text-4xl font-black leading-tight">
                🎁 Cadeau spécial{" "}
                <span className="text-yellow-300">
                  {recipient === "parent" ? "Parents" : "Margaux"}
                </span>
              </div>

              <p className="text-sm sm:text-base">
                Voilà le vrai cadeau (promis, aucun virus 😇).
              </p>

              
                {/* 👉 Ici tu mettras le texte / contenu réel du cadeau plus tard */}
                {recipient === "parent" && <p>
                  <img
                    src={cadeauParents}
                    alt="Votre super cadeau surprise"
                    className="mx-auto mt-4 mb-2 w-3 h-auto rounded-2xl shadow-xl"
                  />
                </p>}
                {recipient !== "parent" && <p>
                  <img
                    src={cadeauMargaux}
                    alt="Votre super cadeau surprise"
                    className="mx-auto mt-4 mb-2 w-52 h-auto rounded-2xl shadow-xl"
                  />
                </p>}

              <p className="text-[11px] sm:text-xs text-fuchsia-100/90 mt-2">
                (Joyeux Noël)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
