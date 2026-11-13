import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createProductWorld } from "./product-world";
export default function Scene() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(
      Math.min(devicePixelRatio, innerWidth < 768 ? 1 : 1.5),
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);
    const world = createProductWorld(renderer, 5);
    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width && height) {
        renderer.setSize(width, height);
        world.camera.aspect = width / height;
        world.camera.updateProjectionMatrix();
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    let visible = false,
      frame = 0,
      last = 0,
      time = 0,
      disposed = false;
    const pointer = { x: 0, y: 0 };
    const fine = matchMedia("(pointer:fine)").matches;
    const move = (e: PointerEvent) => {
      if (!fine) return;
      const r = el.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 0.16;
      pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 0.07;
    };
    const leave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    const render = (now: number) => {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      const delta = last ? Math.min(now - last, 250) / 1000 : 0;
      time += delta;
      last = now;
      // Idle movement also works on touchscreens, without intercepting scrolling.
      // Time-based easing keeps the motion consistent across refresh rates.
      const ease = 1 - Math.exp(-3 * delta);
      const turn = Math.sin(time * 0.42) * 0.14;
      const tilt = Math.sin(time * 0.55) * 0.025;
      world.root.rotation.y += (turn + pointer.x - world.root.rotation.y) * ease;
      world.root.rotation.x += (tilt + pointer.y - world.root.rotation.x) * ease;
      world.root.position.y = Math.sin(time * 0.8) * 0.045;
      world.update(time);
      renderer.render(world.scene, world.camera);
      if (time > 0.7) el.classList.add("scene-ready");
      frame = requestAnimationFrame(render);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const start = () => {
      if (visible && !document.hidden && !frame && !disposed) {
        last = 0;
        frame = requestAnimationFrame(render);
      }
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      visible ? start() : stop();
    });
    io.observe(el);
    const visibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", visibility);
    const lost = (e: Event) => {
      e.preventDefault();
      stop();
      visible = false;
      el.classList.remove("scene-ready");
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    return () => {
      disposed = true;
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      world.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      el.classList.remove("scene-ready");
    };
  }, []);
  return <div className="scene-canvas" ref={host} />;
}
