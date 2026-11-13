import { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { services } from "./data";
const Scene = lazy(() => import("./scene"));
export default function HeroEnvironment() {
  const [enabled, setEnabled] = useState(false);
  const [selected, setSelected] = useState(0);
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
    const timer = setTimeout(update, 350);
    mq.addEventListener("change", update);
    return () => {
      clearTimeout(timer);
      mq.removeEventListener("change", update);
    };
  }, []);
  return (
    <div className={`hero-environment hero-selected-${selected}`}>
      <div className="hero-visual" aria-hidden="true">
        <div className="visual-grid" />
        <div className="static-sculpture">
          <img
            src="/visuals/connected-gigi.svg"
            width="640"
            height="440"
            alt=""
          />
          <span className={`static-selection marker-${selected}`} />
        </div>
        {enabled && (
          <Suspense fallback={null}>
            <Scene selected={selected} onSelect={setSelected} />
          </Suspense>
        )}
        <span className="hero-scene-note">ONE CONNECTED GIGI ENVIRONMENT</span>
      </div>
      <div
        className="hero-service-controls"
        role="group"
        aria-label="Explore the connected GIGI environment"
      >
        {services.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            aria-pressed={selected === i}
            aria-controls="hero-service-description"
            onClick={() => setSelected(i)}
          >
            <span>0{i + 1}</span>
            {s.label}
          </button>
        ))}
      </div>
      <div
        id="hero-service-description"
        className="hero-service-description"
        aria-live="polite"
      >
        <strong>{services[selected].name}</strong>
        <p>{services[selected].description}</p>
        <Link to={`/services/${services[selected].slug}`}>
          Explore this service <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}
