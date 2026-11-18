import { useEffect, useRef, useState } from "react";
import type { HeroKey } from "./data";

const HERO_BASE = "/enterprise/heroes";
const VIDEO_BASE = "/enterprise/videos";

const heroDescriptions: Record<HeroKey, string> = {
  home: "Contemporary commercial headquarters illuminated at blue hour",
  about: "Modern glass business headquarters at dusk",
  services: "Enterprise technology campus with security monitoring",
  "access-control": "Biometric access readers and turnstiles in a corporate lobby",
  "cctv-surveillance": "Security operations centre with a live camera wall",
  "fibre-networking": "Network engineer terminating structured fibre cabling",
  "it-connectivity": "Server room with a connected laptop and network equipment",
  "data-backup": "Illuminated server racks in a secure data environment",
  "alarm-electric-fence": "Secured commercial perimeter with electric fencing and gates",
  "electrical-installations": "Commercial electrical distribution board and cabling",
  "solar-energy": "Rooftop solar array on a corporate building at dusk",
  "web-graphic-design": "Design studio with website and brand layouts on screen",
  contact: "Accessible corporate lobby with biometric entry points",
  "enterprise-security": "Integrated security control room with surveillance monitors",
};

const checks = new Map<string, Promise<boolean>>();

function checkVideo(url: string) {
  const cached = checks.get(url);
  if (cached) return cached;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 2200);
  const promise = fetch(url, {
    method: "HEAD",
    signal: controller.signal,
    cache: "no-store",
  })
    .then((response) => {
      const type = response.headers.get("content-type") || "";
      return response.ok && type.startsWith("video/");
    })
    .catch(() => false)
    .finally(() => window.clearTimeout(timeout));
  checks.set(url, promise);
  return promise;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export default function HeroMedia({
  hero,
  priority = true,
  className = "",
}: {
  hero: HeroKey;
  priority?: boolean;
  className?: string;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [videoAvailable, setVideoAvailable] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const device = isDesktop ? "desktop" : "mobile";
  const poster =
    device === "desktop"
      ? `${HERO_BASE}/hero-${hero}-desktop-1440.webp`
      : `${HERO_BASE}/hero-${hero}-mobile-720.webp`;
  const videoSource = `${VIDEO_BASE}/hero-${hero}-${device}.mp4`;
  const description = heroDescriptions[hero];

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const connection =
      "connection" in navigator
        ? (navigator.connection as { saveData?: boolean })
        : undefined;
    const update = () =>
      setMotionAllowed(!media.matches && !connection?.saveData);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    setVideoAvailable(false);
    setVideoReady(false);
    setVideoFailed(false);
    if (!motionAllowed) return;
    let active = true;
    checkVideo(videoSource).then((available) => {
      if (active) setVideoAvailable(available);
    });
    return () => {
      active = false;
    };
  }, [videoSource, motionAllowed]);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    element.muted = true;
    element.defaultMuted = true;
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden) element.play().catch(() => {});
      else element.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [videoAvailable, videoSource]);

  const showVideo = videoAvailable && !videoFailed && motionAllowed;

  return (
    <div className={`gc-hero-media ${className}`.trim()}>
      <picture>
        <source
          media="(max-width: 767px)"
          type="image/webp"
          srcSet={`${HERO_BASE}/hero-${hero}-mobile-540.webp 540w, ${HERO_BASE}/hero-${hero}-mobile-720.webp 720w, ${HERO_BASE}/hero-${hero}-mobile-1080.webp 1080w`}
          sizes="100vw"
        />
        <source
          media="(max-width: 767px)"
          type="image/jpeg"
          srcSet={`${HERO_BASE}/hero-${hero}-mobile.jpg`}
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet={`${HERO_BASE}/hero-${hero}-desktop-960.webp 960w, ${HERO_BASE}/hero-${hero}-desktop-1440.webp 1440w, ${HERO_BASE}/hero-${hero}-desktop-1920.webp 1920w`}
          sizes="100vw"
        />
        <source
          type="image/jpeg"
          srcSet={`${HERO_BASE}/hero-${hero}-desktop.jpg`}
          sizes="100vw"
        />
        <img
          src={`${HERO_BASE}/hero-${hero}-desktop-1920.webp`}
          alt={description}
          width={1920}
          height={1080}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      </picture>
      {showVideo && (
        <video
          ref={videoRef}
          key={videoSource}
          className={videoReady ? "is-ready" : ""}
          src={videoSource}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoFailed(true)}
        />
      )}
    </div>
  );
}

export { heroDescriptions };
