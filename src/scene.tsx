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
      pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 0.055;
      pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 0.025;
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
      time += last ? Math.min(now - last, 50) / 1000 : 0;
      last = now;
      world.root.rotation.y += (pointer.x - world.root.rotation.y) * 0.04;
      world.root.rotation.x += (pointer.y - world.root.rotation.x) * 0.04;
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
