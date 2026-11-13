import { useEffect, useId, useRef, useState } from "react";
import { services } from "./data";
import paths from "./artwork-paths.json";
const options = [
  ["Network", "Data backup"],
  ["CCTV coverage", "Access control"],
  ["Day", "Night"],
  ["Websites", "Branding"],
  ["Devices", "Cloud access"],
];
const descriptions = [
  [
    "Trace the connection between devices and the network equipment.",
    "A backup copy travels from the device to separate storage.",
  ],
  [
    "The shaded area illustrates a camera’s coverage near an entrance.",
    "Try the access reader to see a short confirmation. This is a demonstration.",
  ],
  [
    "Daytime concept: panels supply energy through an inverter towards storage.",
    "Night-time concept: stored energy supplies the property. This is not a performance simulation.",
  ],
  [
    "An original website concept shown on desktop and mobile.",
    "An original branding concept with matching screen layouts and colour samples.",
  ],
  [
    "Identify the devices and people who need to use your cloud tools.",
    "The path illustrates access to cloud tools. Your platform and service scope will be discussed before quoting.",
  ],
];
export function useSceneActivity() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    let visible = false;
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setActive(visible && !document.hidden && !mq.matches);
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        update();
      },
      { threshold: 0.12 },
    );
    if (ref.current) io.observe(ref.current);
    document.addEventListener("visibilitychange", update);
    mq.addEventListener("change", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
      mq.removeEventListener("change", update);
    };
  }, []);
  return { ref, active };
}
export function BoardThumbnail({ index }: { index: number }) {
  return (
    <div className={`board-thumbnail thumbnail-${index}`}>
      <img
        src={`/artwork/${services[index].art}.webp`}
        alt=""
        width="1600"
        height="1200"
        loading="lazy"
      />
    </div>
  );
}
export default function VisualBoard({ index }: { index: number }) {
  const [selected, setSelected] = useState(0),
    [confirmed, setConfirmed] = useState(false);
  const { ref, active } = useSceneActivity();
  const id = useId();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const image =
    index === 1 && confirmed
      ? "security-confirmed"
      : index === 2 && selected === 1
        ? "solar-night"
        : index === 3 && selected === 1
          ? "branding"
          : services[index].art;
  const routes = (paths as Record<string, string[]>)[image] || [];
  const path =
    routes[
      (index === 0 && selected === 1) || (index === 2 && selected === 1) ? 1 : 0
    ];
  return (
    <div
      className={`visual-board board-${index} ${selected ? "alternate-state" : ""} ${image === "solar-night" ? "night-state" : ""} ${active ? "motion-active" : ""} ${confirmed ? "access-confirmed" : ""}`}
      data-board={services[index].slug}
      ref={ref}
    >
      <div className="board-art" aria-hidden="true">
        <img
          key={image}
          src={`/artwork/${image}.webp`}
          alt=""
          width="1600"
          height="1200"
        />
        {path && (
          <svg viewBox="0 0 640 480" className="motion-overlay">
            <path d={path} className="connection-pulse" />
          </svg>
        )}
        {index === 1 && selected === 0 && (
          <svg viewBox="0 0 640 480" className="motion-overlay">
            <path
              className="coverage-scan"
              d="M250 222L162 325Q238 385 334 341Z"
            />
          </svg>
        )}
        {confirmed && (
          <span className="reader-confirmation">Access confirmed</span>
        )}
      </div>
      <div
        className="board-controls"
        role="group"
        aria-label={`${services[index].name} illustration controls`}
      >
        {options[index].map((label, i) => (
          <button
            key={label}
            type="button"
            aria-pressed={selected === i}
            aria-controls={`${id}-description`}
            onClick={() => {
              setSelected(i);
              setConfirmed(false);
              clearTimeout(timer.current);
            }}
          >
            {label}
          </button>
        ))}
        <span className="concept-label">3D concept</span>
      </div>
      <div
        className="board-description"
        id={`${id}-description`}
        aria-live="polite"
      >
        <p>{descriptions[index][selected]}</p>
        {index === 1 && selected === 1 && (
          <>
            <button
              className="access-demo"
              type="button"
              onClick={() => {
                setConfirmed(true);
                clearTimeout(timer.current);
                timer.current = setTimeout(() => setConfirmed(false), 2200);
              }}
            >
              Try access reader <span aria-hidden="true">↗</span>
            </button>
            <span role="status">
              {confirmed ? "Demo: access confirmed." : ""}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
