import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export default function Scene({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (index: number) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const selection = useRef(selected);
  selection.current = selected;
  const select = useRef(onSelect);
  select.current = onSelect;
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(
      Math.min(devicePixelRatio, innerWidth < 768 ? 1.25 : 1.75),
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
    camera.position.set(0, 1.6, 9.8);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x496b94, 3));
    const key = new THREE.DirectionalLight(0xffffff, 4);
    key.position.set(-4, 6, 7);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8efce8, 2);
    rim.position.set(4, 2, -3);
    scene.add(rim);
    const materials = {
      blue: new THREE.MeshPhysicalMaterial({
        color: 0x0755ed,
        roughness: 0.28,
        metalness: 0.25,
        clearcoat: 0.5,
      }),
      navy: new THREE.MeshStandardMaterial({
        color: 0x092954,
        roughness: 0.35,
        metalness: 0.35,
      }),
      teal: new THREE.MeshStandardMaterial({
        color: 0x16c6a5,
        emissive: 0x16c6a5,
        emissiveIntensity: 0.18,
        roughness: 0.3,
      }),
      pearl: new THREE.MeshPhysicalMaterial({
        color: 0xeaf2fa,
        roughness: 0.28,
        metalness: 0.3,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0xcde8ef,
        transparent: true,
        opacity: 0.4,
        roughness: 0.65,
        metalness: 0.1,
      }),
      screen: new THREE.MeshStandardMaterial({
        color: 0xe7f9f5,
        roughness: 0.4,
      }),
    };
    const boxGeometry = new RoundedBoxGeometry(1, 1, 1, 3, 0.1);
    const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
    const root = new THREE.Group();
    scene.add(root);
    root.rotation.set(0.07, -0.12, 0);
    const box = (
      parent: THREE.Object3D,
      position: [number, number, number],
      size: [number, number, number],
      material: THREE.Material,
    ) => {
      const m = new THREE.Mesh(boxGeometry, material);
      m.position.set(...position);
      m.scale.set(...size);
      parent.add(m);
      return m;
    };
    const ball = (
      parent: THREE.Object3D,
      p: [number, number, number],
      s: number,
      mat: THREE.Material,
    ) => {
      const m = new THREE.Mesh(sphereGeometry, mat);
      m.position.set(...p);
      m.scale.setScalar(s);
      parent.add(m);
      return m;
    };
    box(root, [0, 0, 0], [1.8, 2.05, 0.38], materials.pearl);
    box(root, [0.08, -0.04, -0.25], [1.95, 2.2, 0.12], materials.glass);
    let disposed = false;
    let logoReady = false;
    const texture = new THREE.TextureLoader().load(
      "/visuals/gigi-shield.png",
      () => {
        if (disposed) {
          texture.dispose();
          return;
        }
        logoReady = true;
      },
      undefined,
      () => {
        logoReady = false;
      },
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    // A front-facing plane preserves the supplied shield's proportions and colour.
    const logoMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      toneMapped: false,
    });
    const logoGeometry = new THREE.PlaneGeometry(1.22, (1.22 * 700) / 590);
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(0, 0.02, 0.52);
    root.add(logo);
    const positions: [number, number, number][] = [
      [-2.15, 1.12, 0.1],
      [2.1, 1.14, -0.05],
      [-2.1, -1.28, 0.2],
      [2.1, -1.3, 0.2],
    ];
    const nodes = positions.map((p, i) => {
      const g = new THREE.Group();
      g.position.set(...p);
      g.userData.service = i;
      root.add(g);
      box(g, [0, -0.55, -0.15], [1.5, 0.12, 1], materials.glass);
      return g;
    });
    // IT: cabinet and three visible rack units, with a compact switch.
    box(nodes[0], [0, 0, 0], [0.82, 1.2, 0.55], materials.blue);
    for (let i = 0; i < 3; i++) {
      box(
        nodes[0],
        [0, 0.33 - i * 0.32, 0.3],
        [0.64, 0.23, 0.06],
        materials.navy,
      );
      box(
        nodes[0],
        [-0.12, 0.33 - i * 0.32, 0.34],
        [0.26, 0.025, 0.02],
        materials.pearl,
      );
      ball(nodes[0], [0.21, 0.33 - i * 0.32, 0.35], 0.035, materials.teal);
    }
    box(nodes[0], [0.53, -0.38, 0.28], [0.55, 0.22, 0.38], materials.pearl);
    // Security: protected door, reader, and a lens-bearing camera.
    box(nodes[1], [0.16, -0.03, -0.03], [0.72, 1.24, 0.18], materials.pearl);
    box(nodes[1], [0.16, -0.03, 0.08], [0.56, 1.08, 0.07], materials.navy);
    box(nodes[1], [0.32, -0.04, 0.14], [0.04, 0.2, 0.04], materials.teal);
    box(nodes[1], [0.69, 0.02, 0.1], [0.15, 0.27, 0.1], materials.blue);
    ball(nodes[1], [0.69, 0.08, 0.16], 0.025, materials.teal);
    const cam = new THREE.Group();
    cam.position.set(-0.45, 0.45, 0.15);
    cam.rotation.set(0.08, -0.3, -0.1);
    nodes[1].add(cam);
    box(cam, [0, 0, 0], [0.7, 0.28, 0.34], materials.pearl);
    box(cam, [-0.28, 0, 0.05], [0.07, 0.23, 0.3], materials.navy);
    ball(cam, [-0.33, 0, 0.08], 0.09, materials.blue);
    box(nodes[1], [-0.23, 0.21, -0.02], [0.09, 0.33, 0.12], materials.pearl);
    // Energy: a tilted panel array, inverter and battery.
    const panel = new THREE.Group();
    panel.rotation.x = -0.35;
    panel.rotation.z = -0.1;
    nodes[2].add(panel);
    box(panel, [0, 0, 0], [1.3, 0.86, 0.1], materials.pearl);
    for (let i = 0; i < 6; i++)
      box(
        panel,
        [-0.4 + (i % 3) * 0.4, 0.21 - Math.floor(i / 3) * 0.42, 0.07],
        [0.35, 0.35, 0.035],
        materials.blue,
      );
    box(nodes[2], [0.8, -0.22, 0.13], [0.25, 0.48, 0.25], materials.navy);
    box(nodes[2], [0.8, -0.22, 0.28], [0.13, 0.25, 0.03], materials.teal);
    box(nodes[2], [-0.75, -0.3, 0.05], [0.24, 0.35, 0.16], materials.pearl);
    // Design: desktop, mobile preview and a small colour-swatch strip.
    box(nodes[3], [0, 0.07, 0], [1.25, 0.83, 0.14], materials.navy);
    box(nodes[3], [0, 0.09, 0.09], [1.1, 0.65, 0.025], materials.screen);
    box(nodes[3], [-0.27, 0.24, 0.12], [0.43, 0.055, 0.02], materials.blue);
    box(nodes[3], [-0.27, 0.1, 0.12], [0.43, 0.035, 0.02], materials.navy);
    box(nodes[3], [-0.33, -0.08, 0.12], [0.3, 0.12, 0.02], materials.blue);
    ball(nodes[3], [0.28, 0.08, 0.14], 0.19, materials.teal);
    box(nodes[3], [0, -0.45, 0], [0.13, 0.25, 0.12], materials.pearl);
    box(nodes[3], [0, -0.57, 0], [0.55, 0.08, 0.36], materials.pearl);
    box(nodes[3], [0.78, -0.17, 0.2], [0.28, 0.55, 0.08], materials.navy);
    box(nodes[3], [0.78, -0.15, 0.25], [0.21, 0.43, 0.025], materials.screen);
    const paths: THREE.CatmullRomCurve3[] = [];
    const geometries: THREE.BufferGeometry[] = [];
    const pulses: THREE.Mesh[] = [];
    nodes.forEach((node, i) => {
      const p = node.position;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(p.x, p.y, -0.2),
        new THREE.Vector3(p.x * 0.65, p.y * 0.75, -0.4),
        new THREE.Vector3(0, 0, -0.3),
      ]);
      paths.push(curve);
      const geo = new THREE.TubeGeometry(curve, 24, 0.014, 5, false);
      geometries.push(geo);
      root.add(new THREE.Mesh(geo, materials.pearl));
      pulses.push(ball(root, [0, 0, 0], 0.045, materials.teal));
    });
    const halos = nodes.map((node) => {
      const geo = new THREE.TorusGeometry(0.82, 0.018, 6, 48);
      geometries.push(geo);
      const m = new THREE.Mesh(geo, materials.teal);
      m.position.z = -0.28;
      node.add(m);
      return m;
    });
    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.position.z = width / height < 1.3 ? 11.5 : 9.8;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    let visible = false,
      frame = 0,
      last = 0,
      time = 0;
    const pointer = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const fine = matchMedia("(pointer:fine)").matches;
    const move = (e: PointerEvent) => {
      if (!fine) return;
      const r = el.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 0.12;
      pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 0.08;
    };
    const leave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };
    const click = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      raycaster.setFromCamera(
        new THREE.Vector2(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          (-(e.clientY - r.top) / r.height) * 2 + 1,
        ),
        camera,
      );
      const hits = raycaster.intersectObjects(nodes, true);
      if (hits[0]) {
        let obj: THREE.Object3D | null = hits[0].object;
        while (obj && obj.userData.service === undefined) obj = obj.parent;
        if (obj) select.current(obj.userData.service);
      }
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerup", click);
    const render = (now: number) => {
      frame = 0;
      if (!visible || document.hidden || disposed) return;
      time += last ? Math.min(now - last, 50) / 1000 : 0;
      last = now;
      root.rotation.y += (-0.12 + pointer.x - root.rotation.y) * 0.04;
      root.rotation.x += (0.07 + pointer.y - root.rotation.x) * 0.04;
      nodes.forEach((node, i) => {
        const scale = i === selection.current ? 1.08 : 1;
        node.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.07);
        halos[i].visible = i === selection.current;
        pulses[i].visible = i === selection.current;
        pulses[i].position.copy(paths[i].getPoint((time * 0.15) % 1));
      });
      logo.quaternion.copy(root.quaternion).invert().multiply(camera.quaternion);
      renderer.render(scene, camera);
      if (logoReady) el.classList.add("scene-ready");
      frame = requestAnimationFrame(render);
    };
    const start = () => {
      if (visible && !document.hidden && !frame && !disposed) {
        last = 0;
        frame = requestAnimationFrame(render);
      }
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
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
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerup", click);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      boxGeometry.dispose();
      sphereGeometry.dispose();
      logoGeometry.dispose();
      geometries.forEach((g) => g.dispose());
      Object.values(materials).forEach((m) => m.dispose());
      logoMaterial.dispose();
      texture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      el.classList.remove("scene-ready");
    };
  }, []);
  return <div className="scene-canvas" ref={host} />;
}
