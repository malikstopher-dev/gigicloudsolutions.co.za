import { useEffect, useId, useRef, useState } from "react";
import * as THREE from "three";
import { createProductWorld } from "./product-world";

export default function Scene() {
  const host = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const settings = useRef({ paused, expanded });
  settings.current = { paused, expanded };
  const controls = useRef({ wake: () => {}, reset: () => {} });
  const hint = useId();

  useEffect(() => controls.current.wake(), [paused, expanded]);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 768 ? 1 : 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);
    let world: ReturnType<typeof createProductWorld>;
    try {
      world = createProductWorld(renderer, 5, "default", true);
    } catch {
      renderer.dispose();
      renderer.domElement.remove();
      return;
    }
    let visible = false, frame = 0, last = 0, time = 0, settle = 0;
    let disposed = false, contextLost = false, angle = 0, drag: number | null = null;
    let previousX = 0;
    const pointer = { x: 0, y: 0 };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    };
    const start = () => {
      if (visible && !document.hidden && !frame && !disposed && !contextLost)
        frame = requestAnimationFrame(render);
    };
    const wake = () => {
      settle = 1.5;
      start();
    };
    const reset = () => {
      angle = 0;
      time = 0;
      pointer.x = pointer.y = 0;
      wake();
    };
    controls.current = { wake, reset };
    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width && height) {
        renderer.setSize(width, height);
        world.camera.aspect = width / height;
        world.camera.updateProjectionMatrix();
        wake();
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const down = (e: PointerEvent) => {
      if (e.button !== 0 || !e.isPrimary || (e.target as Element).closest("button")) return;
      drag = e.pointerId;
      previousX = e.clientX;
      el.setPointerCapture(e.pointerId);
      el.classList.add("scene-dragging");
      if (e.pointerType === "mouse") el.focus({ preventScroll: true });
      wake();
    };
    const move = (e: PointerEvent) => {
      if (drag === e.pointerId) {
        // A swipe across the model rotates it through a full turn at any screen size.
        angle += ((e.clientX - previousX) / el.clientWidth) * Math.PI * 2;
        previousX = e.clientX;
      } else if (e.pointerType === "mouse" && !(e.target as Element).closest("button")) {
        const r = el.getBoundingClientRect();
        pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 0.4;
        pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 0.14;
      } else return;
      wake();
    };
    const end = (e: PointerEvent) => {
      if (drag !== e.pointerId) return;
      drag = null;
      el.classList.remove("scene-dragging");
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      wake();
    };
    const leave = () => {
      pointer.x = pointer.y = 0;
      wake();
    };
    const key = (e: KeyboardEvent) => {
      if (e.target !== el || !["ArrowLeft", "ArrowRight", "Home"].includes(e.key)) return;
      e.preventDefault();
      if (e.key === "Home") reset();
      else angle += e.key === "ArrowLeft" ? -0.35 : 0.35;
      wake();
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener("lostpointercapture", end);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("keydown", key);

    function render(now: number) {
      frame = 0;
      if (disposed || contextLost || !visible || document.hidden) return;
      const delta = last ? Math.min((now - last) / 1000, 0.1) : 1 / 60;
      last = now;
      // Hold automatic movement while dragging, so the model follows the hand.
      if (!settings.current.paused && drag === null) time += delta;
      settle = Math.max(0, settle - delta);
      const ease = 1 - Math.exp(-9 * delta);
      const turn = Math.sin(time * 0.8) * 0.7;
      const tilt = Math.sin(time * 1.05) * 0.07;
      world.root.rotation.y += (angle + turn + pointer.x - world.root.rotation.y) * ease;
      world.root.rotation.x += (tilt + pointer.y - world.root.rotation.x) * ease;
      world.root.position.y = 0.15 + Math.sin(time * 1.5) * 0.15;
      world.update(time);
      world.animateHero(time, delta, settings.current.expanded);
      renderer.render(world.scene, world.camera);
      // Reveal the first complete frame; don't wait for accumulated animation time.
      el!.classList.add("scene-ready");
      if ((!settings.current.paused && drag === null) || settle > 0) start();
      else last = 0;
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      visible ? wake() : stop();
    });
    io.observe(el);
    const visibility = () => (document.hidden ? stop() : wake());
    document.addEventListener("visibilitychange", visibility);
    const lost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      stop();
      el.classList.remove("scene-ready");
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    return () => {
      disposed = true;
      stop();
      controls.current = { wake: () => {}, reset: () => {} };
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
      el.removeEventListener("lostpointercapture", end);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("keydown", key);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      world.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      el.classList.remove("scene-ready", "scene-dragging");
    };
  }, []);

  return (
    <div className="scene-canvas" ref={host} tabIndex={0} role="group"
      aria-label="Interactive 3D equipment model" aria-describedby={hint}>
      <span className="scene-interaction-hint" id={hint}>
        Drag sideways or use arrow keys to rotate
      </span>
      <div className="scene-controls" role="group" aria-label="3D animation controls">
        <button type="button" onClick={() => setPaused(!paused)}>
          {paused ? "Resume animation" : "Pause animation"}
        </button>
        <button type="button" aria-pressed={expanded} onClick={() => setExpanded(!expanded)}>
          {expanded ? "Assemble" : "Separate equipment"}
        </button>
        <button type="button" onClick={() => { setExpanded(false); controls.current.reset(); }}>
          Reset view
        </button>
      </div>
    </div>
  );
}
