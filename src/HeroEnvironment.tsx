import { lazy, Suspense, useEffect, useState } from "react";
const Scene = lazy(() => import("./scene"));
export default function HeroEnvironment() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setEnabled(
        !mq.matches &&
          !(
            "connection" in navigator &&
            (navigator.connection as { saveData?: boolean }).saveData
          ),
      );
    const timer = setTimeout(update, 500);
    mq.addEventListener("change", update);
    return () => {
      clearTimeout(timer);
      mq.removeEventListener("change", update);
    };
  }, []);
  return (
    <div className="hero-environment">
      <div className="hero-visual">
        <div className="static-sculpture" aria-hidden="true">
          <img
            src="/artwork/hero.webp"
            width="1600"
            height="1200"
            alt=""
            fetchPriority="high"
          />
        </div>
        {enabled && (
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        )}
      </div>
      <p className="art-caption">
        Illustrative equipment concept. Explore each service below.
      </p>
    </div>
  );
}
