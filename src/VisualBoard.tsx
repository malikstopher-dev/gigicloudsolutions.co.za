import { useEffect, useId, useMemo, useRef, useState } from "react";
import { boardSvg, boardNames } from "../assets/boards.mjs";
import "./visuals.css";

const options = [
  ["IT services", "Fibre", "Networking", "Data backup"],
  ["CCTV", "Alarms", "Perimeter", "Access control"],
  ["Day", "Night"],
  ["Websites", "Branding"],
];
const parts = [
  ["it", "fibre", "network", "backup"],
  ["cctv", "alarm", "perimeter", "access"],
  ["day", "night"],
  ["websites", "branding"],
];
const descriptions = [
  [
    "A compact server and everyday devices: a foundation for your IT needs.",
    "Fibre paths connect the network to the devices you use.",
    "The switch brings your connected devices into one network.",
    "Concept sequence: a copy travels from a device, through the network, to separate backup storage.",
  ],
  [
    "The camera’s viewing arc illustrates coverage around an entrance.",
    "An alarm panel is one part of a considered security setup.",
    "The boundary illustrates how perimeter protection relates to the entrance.",
    "Try the reader to see a brief access confirmation. This is an illustration, not a live security feed.",
  ],
  [
    "Day concept: sunlight reaches the panels and energy travels towards the inverter and battery.",
    "Night concept: stored energy travels from the battery towards the property. Not a performance simulation.",
  ],
  [
    "An original responsive website concept, shown on desktop and mobile.",
    "An original identity concept with typography, colour swatches and a brand mark. Not completed client work.",
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
      ([entry]) => {
        visible = entry.isIntersecting;
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
        src={`/visuals/${boardNames[index]}.svg`}
        alt=""
        loading="lazy"
        width="640"
        height="440"
      />
      <span>GIGI / {["CONNECT", "PROTECT", "POWER", "CREATE"][index]}</span>
    </div>
  );
}
export default function VisualBoard({ index }: { index: number }) {
  const [selection, setSelection] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { ref, active } = useSceneActivity();
  const id = useId();
  const svg = useMemo(() => boardSvg(index, id), [index, id]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const choose = (i: number) => {
    setSelection(i);
    setConfirmed(false);
    clearTimeout(timer.current);
  };
  const confirm = () => {
    setConfirmed(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setConfirmed(false), 2200);
  };
  return (
    <div
      ref={ref}
      className={`visual-board board-${index} selected-${parts[index][selection]} ${active ? "motion-active" : ""} ${confirmed ? "access-confirmed" : ""}`}
      data-board={boardNames[index]}
    >
      <div className="board-heading">
        <span>
          0{index + 1} /{" "}
          {
            [
              "CONNECTED SYSTEMS",
              "CONSIDERED PROTECTION",
              "EVERYDAY ENERGY",
              "DESIGNED TO CONNECT",
            ][index]
          }
        </span>
        <span className="concept-label">Concept illustration</span>
      </div>
      <div
        className="board-art"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <div
        className="board-controls"
        role="group"
        aria-label={`${["IT & Connectivity", "Security & Access", "Electrical & Solar", "Web & Graphic Design"][index]} illustration controls`}
      >
        {options[index].map((label, i) => (
          <button
            key={label}
            type="button"
            aria-pressed={selection === i}
            aria-controls={`${id}-description`}
            onClick={() => choose(i)}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        className="board-description"
        id={`${id}-description`}
        aria-live="polite"
      >
        <p>{descriptions[index][selection]}</p>
        {index === 1 && selection === 3 && (
          <>
            <button type="button" className="access-demo" onClick={confirm}>
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
