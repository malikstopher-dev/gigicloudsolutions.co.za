import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Editable product-scene source, shared by the live hero and offline artwork renderer.
// All objects are original models. They depict concepts, not completed installations.
export function createProductWorld(
  renderer: THREE.WebGLRenderer,
  index: number,
  mode = "default",
  live = false,
) {
  const scene = new THREE.Scene();
  const night = mode === "night";
  scene.background = new THREE.Color(night ? "#101e35" : "#edf1f5");
  const camera = new THREE.PerspectiveCamera(34, 4 / 3, 0.1, 100);
  camera.position.set(8.8, 7.1, 11.8);
  camera.lookAt(0, 0.8, 0);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = night ? 0.25 : 0.85;
  room.dispose();
  pmrem.dispose();
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures: THREE.Texture[] = [];
  const instances: THREE.InstancedMesh[] = [];
  const mat = (color: string, metalness = 0.1, roughness = 0.4) => {
    const m = new THREE.MeshStandardMaterial({ color, metalness, roughness });
    materials.add(m);
    return m;
  };
  const m = {
    navy: mat("#092342", 0.55, 0.3),
    blue: mat("#0755ed", 0.35, 0.28),
    teal: mat("#16c6a5", 0.35, 0.3),
    white: mat("#f3f5f7", 0.12, 0.32),
    silver: mat("#a9b7c6", 0.8, 0.23),
    black: mat("#111d2a", 0.35, 0.3),
    floor: mat(night ? "#142a42" : "#e1e8ef", 0.18, 0.55),
    window: mat(night ? "#ffc979" : "#698aa7", 0.4, 0.12),
  };
  const glass = new THREE.MeshPhysicalMaterial({
    color: "#a9cedc",
    metalness: 0.05,
    roughness: 0.18,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
  });
  materials.add(glass);
  const lightMat = new THREE.MeshStandardMaterial({
    color: "#16c6a5",
    emissive: "#16c6a5",
    emissiveIntensity: night ? 3 : 1.2,
  });
  materials.add(lightMat);
  if (night) {
    m.window.emissive.set("#ffc979");
    m.window.emissiveIntensity = 0.9;
  }
  const cube = new RoundedBoxGeometry(1, 1, 1, live ? 1 : 3, 0.06);
  geometries.add(cube);
  const mesh = (
    g: THREE.BufferGeometry,
    material: THREE.Material,
    parent: THREE.Object3D,
  ) => {
    geometries.add(g);
    const o = new THREE.Mesh(g, material);
    o.castShadow = true;
    o.receiveShadow = true;
    parent.add(o);
    return o;
  };
  const box = (
    p: THREE.Object3D,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    material: THREE.Material,
  ) => {
    const o = mesh(cube, material, p);
    o.position.set(x, y, z);
    o.scale.set(w, h, d);
    return o;
  };
  const cylinder = (
    p: THREE.Object3D,
    x: number,
    y: number,
    z: number,
    r: number,
    h: number,
    material: THREE.Material,
  ) => {
    const o = mesh(new THREE.CylinderGeometry(r, r, h, 40), material, p);
    o.position.set(x, y, z);
    return o;
  };
  const root = new THREE.Group();
  scene.add(root);
  const base = box(root, 0, -0.12, 0, 8.4, 0.3, 5.9, m.floor);
  base.receiveShadow = true;
  const floor = mesh(
    new THREE.PlaneGeometry(200, 200),
    mat(night ? "#101e35" : "#edf1f5", 0, 0.85),
    scene,
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.29;
  const key = new THREE.DirectionalLight(
    night ? "#96bcff" : "#fff7ec",
    night ? 2 : 4.6,
  );
  key.position.set(-4, 9, 6);
  key.castShadow = true;
  const shadowSize = live ? (innerWidth < 768 ? 512 : 1024) : 2048;
  key.shadow.mapSize.set(shadowSize, shadowSize);
  key.shadow.camera.left = -8;
  key.shadow.camera.right = 8;
  key.shadow.camera.top = 8;
  key.shadow.camera.bottom = -8;
  key.shadow.normalBias = 0.035;
  key.shadow.bias = -0.00015;
  key.shadow.radius = 4;
  scene.add(key);
  scene.add(
    new THREE.HemisphereLight("#e7f3ff", "#57697c", night ? 0.45 : 1.3),
  );
  const edge = new THREE.DirectionalLight("#a4e7df", night ? 1.5 : 2);
  edge.position.set(7, 5, -5);
  scene.add(edge);
  const groups: THREE.Group[] = [];
  const makeGroup = (x: number, y: number, z: number) => {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    root.add(g);
    return g;
  };
  const route = (
    points: number[][],
    material: THREE.Material = lightMat,
    r = 0.025,
  ) => {
    const curve = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(...(p as [number, number, number]))),
    );
    mesh(new THREE.TubeGeometry(curve, 60, r, 8, false), material, root);
    return curve;
  };
  const screenTexture = (branding = false) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 680;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fafcfb";
    ctx.fillRect(0, 0, 1000, 680);
    ctx.fillStyle = "#061b43";
    ctx.font = "bold 25px Arial";
    ctx.fillText("FIELD / FORM", 52, 60);
    ctx.font = "18px Arial";
    ctx.fillText("A GIGI design concept", 690, 60);
    ctx.fillStyle = "#e0ece8";
    ctx.fillRect(34, 95, 932, 540);
    ctx.fillStyle = "#061b43";
    ctx.font = "bold 74px Arial";
    ctx.fillText(branding ? "Room to grow." : "Make space", 76, 240);
    if (!branding) ctx.fillText("for your ideas.", 76, 325);
    ctx.font = "25px Arial";
    ctx.fillText(
      "Original website and brand concept",
      76,
      branding ? 310 : 390,
    );
    ctx.fillStyle = "#0755ed";
    ctx.fillRect(76, branding ? 370 : 450, 190, 52);
    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";
    ctx.fillText("Explore the concept", 88, branding ? 403 : 483);
    ctx.fillStyle = "#16c6a5";
    ctx.beginPath();
    ctx.arc(780, branding ? 390 : 480, 125, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0755ed";
    ctx.beginPath();
    ctx.moveTo(720, 560);
    ctx.lineTo(815, 310);
    ctx.lineTo(910, 560);
    ctx.fill();
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    textures.push(t);
    return t;
  };
  const picture = (
    p: THREE.Object3D,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    texture: THREE.Texture,
  ) => {
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      toneMapped: false,
      transparent: true,
    });
    materials.add(material);
    const o = mesh(new THREE.PlaneGeometry(w, h), material, p);
    o.position.set(x, y, z);
    return o;
  };
  const server = (x: number, z: number, scale = 1) => {
    const g = makeGroup(x, 0, z);
    g.scale.setScalar(scale);
    box(g, 0, 1.2, 0, 1.2, 2.4, 0.95, m.navy);
    box(g, 0, 1.2, 0.5, 1.05, 2.25, 0.035, m.black);
    for (let i = 0; i < 5; i++) {
      const y = 0.35 + i * 0.41;
      box(g, 0, y, 0.54, 0.96, 0.32, 0.08, m.silver);
      box(g, -0.04, y, 0.59, 0.72, 0.23, 0.035, m.navy);
      for (let k = 0; k < 11; k++)
        box(g, -0.34 + k * 0.052, y, 0.615, 0.017, 0.13, 0.015, m.black);
      cylinder(g, 0.4, y + 0.045, 0.615, 0.025, 0.02, lightMat).rotation.x =
        Math.PI / 2;
      box(g, 0.38, y - 0.06, 0.62, 0.05, 0.025, 0.01, m.blue);
    }
    box(g, -0.52, 1.2, 0.62, 0.035, 2.2, 0.03, m.silver);
    box(g, 0.52, 1.2, 0.62, 0.035, 2.2, 0.03, m.silver);
    box(g, 0, 2.34, 0.61, 1.05, 0.04, 0.03, m.silver);
    return g;
  };
  const networkSwitch = (x: number, z: number) => {
    const g = makeGroup(x, 0, z);
    box(g, 0, 0.2, 0, 1.65, 0.34, 0.7, m.silver);
    box(g, 0, 0.2, 0.36, 1.55, 0.25, 0.03, m.navy);
    for (let i = 0; i < 8; i++) {
      box(g, -0.65 + i * 0.18, 0.22, 0.385, 0.12, 0.1, 0.03, m.black);
      box(g, -0.65 + i * 0.18, 0.12, 0.4, 0.025, 0.025, 0.01, lightMat);
    }
    return g;
  };
  const laptop = (x: number, z: number) => {
    const g = makeGroup(x, 0, z);
    box(g, 0, 0.1, 0, 1.7, 0.12, 1.15, m.silver);
    const lid = box(g, 0, 0.72, -0.48, 1.7, 1.16, 0.07, m.navy);
    lid.rotation.x = -0.12;
    const display = picture(g, 0, 0.72, -0.425, 1.52, 0.98, screenTexture());
    display.rotation.x = -0.12;
    for (let row = 0; row < 4; row++)
      for (let c = 0; c < 10; c++)
        box(
          g,
          -0.65 + c * 0.14,
          0.17,
          -0.25 + row * 0.14,
          0.11,
          0.014,
          0.1,
          m.black,
        );
    box(g, 0, 0.17, 0.37, 0.5, 0.01, 0.22, m.floor);
    return g;
  };
  const battery = (x: number, z: number) => {
    const g = makeGroup(x, 0, z);
    box(g, 0, 0.75, 0, 0.65, 1.5, 0.48, m.white);
    box(g, 0, 1.05, 0.25, 0.42, 0.45, 0.025, m.navy);
    for (let i = 0; i < 4; i++)
      box(g, 0, 0.94 + i * 0.07, 0.272, 0.23, 0.04, 0.01, lightMat);
    for (let i = 0; i < 7; i++)
      box(g, 0, 0.2 + i * 0.05, 0.25, 0.39, 0.012, 0.02, m.silver);
    return g;
  };
  const panels = (p: THREE.Object3D, x: number, y: number, z: number) => {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.x = -Math.PI / 2 + 0.16;
    p.add(g);
    box(g, 0, 0, 0, 2.75, 1.6, 0.07, m.silver);
    for (let i = 0; i < 24; i++) {
      const cx = -1.22 + (i % 6) * 0.49,
        cy = -0.59 + Math.floor(i / 6) * 0.39;
      box(g, cx, cy, 0.045, 0.45, 0.35, 0.018, m.blue);
      for (let k = 0; k < 3; k++)
        box(g, cx - 0.14 + k * 0.14, cy, 0.058, 0.005, 0.34, 0.003, m.silver);
    }
    return g;
  };
  const property = (x: number, z: number) => {
    const g = makeGroup(x, 0, z);
    box(g, 0, 1, 0, 3.2, 2, 2.25, m.white);
    box(g, 0, 2.05, 0, 3.4, 0.18, 2.45, m.silver);
    box(g, -0.65, 1.05, 1.14, 1.2, 1.22, 0.06, m.navy);
    box(g, -0.65, 1.05, 1.19, 1.05, 1.08, 0.025, m.window);
    box(g, -0.65, 1.05, 1.21, 0.035, 1.08, 0.02, m.silver);
    box(g, -0.65, 1.05, 1.21, 1.05, 0.035, 0.02, m.silver);
    box(g, 0.78, 0.83, 1.15, 0.7, 1.6, 0.07, m.navy);
    box(g, 0.97, 0.82, 1.21, 0.035, 0.22, 0.04, m.silver);
    box(g, -1.63, 1.1, 0, 0.03, 1.05, 1.3, m.window);
    box(g, 0.8, 0.08, 1.5, 1.2, 0.14, 0.6, m.silver);
    return g;
  };
  const cameraUnit = (p: THREE.Object3D, x: number, y: number, z: number) => {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    p.add(g);
    box(g, 0, -0.35, -0.26, 0.1, 0.65, 0.1, m.silver);
    box(g, 0, -0.55, -0.4, 0.4, 0.12, 0.3, m.silver);
    const body = cylinder(g, 0, 0, 0, 0.24, 0.75, m.white);
    body.rotation.x = Math.PI / 2;
    const ring = cylinder(g, 0, 0, 0.39, 0.215, 0.04, m.silver);
    ring.rotation.x = Math.PI / 2;
    const lens = cylinder(g, 0, 0, 0.42, 0.18, 0.05, m.black);
    lens.rotation.x = Math.PI / 2;
    const glassLens = cylinder(g, 0, 0, 0.453, 0.095, 0.012, m.blue);
    glassLens.rotation.x = Math.PI / 2;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const dot = cylinder(
        g,
        Math.sin(a) * 0.14,
        Math.cos(a) * 0.14,
        0.46,
        0.013,
        0.01,
        m.silver,
      );
      dot.rotation.x = Math.PI / 2;
    }
    box(g, 0, 0.21, 0, 0.55, 0.055, 0.9, m.white);
    return g;
  };
  const monitor = (x: number, z: number, branding = false) => {
    const g = makeGroup(x, 0, z);
    box(g, 0, 0.1, 0, 1.3, 0.12, 0.8, m.silver);
    box(g, 0, 0.65, -0.15, 0.16, 1.1, 0.13, m.silver);
    box(g, 0, 1.5, 0, 2.6, 1.7, 0.13, m.navy);
    picture(g, 0, 1.5, 0.076, 2.42, 1.51, screenTexture(branding));
    box(g, 1.65, 0.65, 0.2, 0.57, 1.2, 0.08, m.navy);
    picture(g, 1.65, 0.65, 0.25, 0.48, 1.05, screenTexture(branding));
    return g;
  };
  const paths: THREE.CatmullRomCurve3[] = [];
  let scanner: THREE.Mesh | undefined;
  if (index === 0) {
    groups.push(
      server(-2.4, -0.5),
      networkSwitch(0, 0.8),
      laptop(2, -0.4),
      battery(2.8, 1.7),
    );
    paths.push(
      route([
        [-2.4, 0.04, 0.1],
        [-1.5, 0.04, 1.1],
        [0, 0.04, 1.3],
        [1, 0.04, 0.5],
        [2, 0.04, 0.1],
      ]),
    );
    paths.push(
      route([
        [2, 0.05, 0.1],
        [1, 0.05, 0.5],
        [0, 0.05, 1.3],
        [1.5, 0.05, 2.2],
        [2.8, 0.05, 2],
      ]),
    );
  }
  if (index === 1) {
    const house = property(0.3, -0.6);
    const cam = cameraUnit(house, -1.3, 2.05, 1.35);
    groups.push(cam);
    box(house, 1.35, 1.15, 1.18, 0.18, 0.35, 0.08, m.navy);
    box(
      house,
      1.35,
      1.22,
      1.23,
      0.08,
      0.07,
      0.015,
      mode === "confirmed" ? lightMat : m.blue,
    );
    box(house, 0.23, 1.3, 1.18, 0.26, 0.38, 0.08, m.white);
    box(house, 0.23, 1.35, 1.23, 0.17, 0.1, 0.015, m.blue);
    for (let i = 0; i < 17; i++)
      box(root, -3.6 + i * 0.45, 0.5, 2.25, 0.035, 1, 0.035, m.silver);
    box(root, 0, 0.85, 2.25, 7.3, 0.035, 0.035, m.silver);
    box(root, 0, 0.25, 2.25, 7.3, 0.035, 0.035, m.silver);
    box(root, -3.6, 0.45, 0.6, 0.035, 0.9, 3.3, m.silver);
    const coverage = new THREE.Shape();
    coverage.moveTo(-1, 0);
    coverage.lineTo(-2.9, 3);
    coverage.quadraticCurveTo(-0.9, 3.8, 1, 3);
    coverage.closePath();
    const coverageMat = new THREE.MeshBasicMaterial({
      color: "#16c6a5",
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    });
    materials.add(coverageMat);
    scanner = mesh(new THREE.ShapeGeometry(coverage), coverageMat, root);
    scanner.rotation.x = -Math.PI / 2;
    scanner.position.set(-0.4, 0.025, -0.8);
    if (mode === "confirmed")
      box(house, 0.78, 0.83, 1.195, 0.65, 1.5, 0.03, mat("#168b79", 0.2, 0.3));
  }
  if (index === 2) {
    const house = property(-0.6, -0.55);
    panels(house, 0, 2.23, 0);
    groups.push(house, battery(2.1, 0.4));
    box(root, 1.7, 1, -1.1, 0.6, 0.95, 0.4, m.white);
    box(root, 1.7, 1.15, -0.89, 0.38, 0.24, 0.025, m.navy);
    box(root, 1.7, 1.15, -0.87, 0.2, 0.06, 0.01, lightMat);
    paths.push(
      route([
        [-0.6, 2.23, -0.55],
        [1, 2.1, -0.6],
        [1.7, 1, -0.85],
        [1.7, 0.04, -0.2],
        [2.1, 0.04, 0.7],
      ]),
    );
    paths.push(
      route([
        [2.1, 0.04, 0.7],
        [2.1, 0.04, 1.7],
        [0.8, 0.04, 1.8],
        [-0.6, 0.04, 1.2],
      ]),
    );
    if (night) {
      const bulb = new THREE.PointLight("#ffdb93", 12, 6);
      bulb.position.set(-1.2, 1.2, 1);
      scene.add(bulb);
    } else {
      const sun = cylinder(
        root,
        -2.9,
        3,
        -1.6,
        0.35,
        0.08,
        mat("#ecbd6c", 0.2, 0.25),
      );
      sun.rotation.x = Math.PI / 2;
    }
  }
  if (index === 3) {
    groups.push(monitor(-0.5, -0.45, mode === "branding"));
    box(root, -1.1, 0.1, 1.25, 2, 0.15, 0.7, m.white);
    for (let i = 0; i < 3; i++)
      box(
        root,
        1.5 + i * 0.48,
        0.12,
        1.6,
        0.39,
        0.12,
        0.85,
        [m.navy, m.blue, m.teal][i],
      );
    if (mode === "branding") {
      const card = box(root, -2.4, 0.65, 0.6, 1.2, 1.5, 0.07, m.white);
      card.rotation.z = 0.12;
      const art = picture(
        root,
        -2.4,
        0.65,
        0.65,
        1.08,
        1.35,
        screenTexture(true),
      );
      art.rotation.z = 0.12;
    } else {
      box(root, -2.5, 0.14, 1.8, 0.7, 0.25, 1.15, m.navy);
      for (let i = 0; i < 3; i++)
        box(root, -2.5, 0.28, 1.5 + i * 0.22, 0.4, 0.015, 0.04, m.teal);
    }
  }
  if (index === 4) {
    const cloud = makeGroup(0, 2.1, -0.5);
    for (const [x, y, r] of [
      [-1, 0, 0.6],
      [-0.35, 0.35, 0.85],
      [0.55, 0.15, 0.72],
      [1.1, -0.1, 0.45],
    ]) {
      const sphere = mesh(new THREE.SphereGeometry(r, 48, 32), m.white, cloud);
      sphere.position.set(x, y, 0);
      sphere.scale.z = 0.65;
    }
    box(cloud, 0, -0.3, 0, 2.6, 0.5, 0.65, m.white);
    groups.push(cloud, laptop(-2, 1), laptop(2, 1));
    route(
      [
        [-2, 0.04, 1.5],
        [-1, 0.04, 2],
        [1, 0.04, 2],
        [2, 0.04, 1.5],
      ],
      m.silver,
    );
    paths.push(
      route([
        [-2, 0.05, 1.5],
        [0, 0.05, 1.6],
        [0, 1.2, 0.1],
        [0, 2, -0.5],
      ]),
    );
  }
  let heroCamera: THREE.Group | undefined;
  if (index === 5) {
    const house = property(-0.35, -0.65);
    panels(house, 0, 2.24, 0);
    heroCamera = cameraUnit(house, -1.3, 2.03, 1.3);
    groups.push(server(2.6, -0.55, 0.8));
    groups.push(house);
    groups.push(battery(2.6, 1.35));
    const desk = monitor(-2.25, 1.25);
    desk.scale.setScalar(0.56);
    groups.push(desk);
    paths.push(
      route([
        [-2.25, 0.04, 1.4],
        [-1, 0.04, 1.8],
        [1, 0.04, 1.7],
        [2.6, 0.04, 1.4],
        [2.6, 0.04, 0],
      ]),
    );
    const texture = new THREE.TextureLoader().load("/visuals/gigi-shield.png");
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.push(texture);
    picture(house, 0.2, 1.2, 1.2, 0.56, 0.66, texture);
    box(house, 0.2, 1.2, 1.17, 0.7, 0.8, 0.04, m.white);
  }
  // Repeated server vents, panel cells and keyboard keys share geometry/material.
  // Batch them inside their existing groups so equipment can still move separately.
  if (live) {
    const batch = (parent: THREE.Object3D) => {
      const buckets = new Map<string, THREE.Mesh[]>();
      for (const child of [...parent.children]) {
        if (child instanceof THREE.Group) batch(child);
        if (!(child instanceof THREE.Mesh) || Array.isArray(child.material)) continue;
        const id = `${child.geometry.uuid}/${child.material.uuid}`;
        const bucket = buckets.get(id) || [];
        bucket.push(child);
        buckets.set(id, bucket);
      }
      for (const meshes of buckets.values()) {
        if (meshes.length < 2) continue;
        const first = meshes[0];
        const combined = new THREE.InstancedMesh(first.geometry, first.material, meshes.length);
        combined.castShadow = first.castShadow;
        combined.receiveShadow = first.receiveShadow;
        meshes.forEach((part, i) => {
          part.updateMatrix();
          combined.setMatrixAt(i, part.matrix);
          parent.remove(part);
        });
        combined.instanceMatrix.needsUpdate = true;
        parent.add(combined);
        instances.push(combined);
      }
    };
    batch(root);
  }
  const pulseGeo = new THREE.SphereGeometry(0.06, 16, 16);
  geometries.add(pulseGeo);
  const pulse = mesh(pulseGeo, lightMat, root);
  const heroPulses = live && index === 5
    ? Array.from({ length: 3 }, () => mesh(pulseGeo, lightMat, root))
    : [];
  const restPositions = groups.map(group => group.position.clone());
  let spread = 0;
  const animateHero = (time: number, delta: number, expanded: boolean) => {
    if (!live || index !== 5) return;
    spread = THREE.MathUtils.damp(spread, expanded ? 1 : 0, 7, delta);
    groups.forEach((group, i) => {
      const rest = restPositions[i];
      group.position.x = rest.x * (1 + spread * 0.18);
      group.position.z = rest.z * (1 + spread * 0.18);
      group.position.y = rest.y + (0.5 + Math.sin(time * 1.8 + i * 1.4) * 0.5) * 0.2
        + spread * (i === 1 ? 0.35 : 0.8);
    });
    if (heroCamera) heroCamera.rotation.y = Math.sin(time * 1.4) * 0.5;
    lightMat.emissiveIntensity = 1.8 + Math.sin(time * 2.5) * 0.5;
    pulse.scale.setScalar(2);
    heroPulses.forEach((light, i) => {
      light.position.copy(paths[0].getPoint((time * 0.4 + (i + 1) / 4) % 1));
      light.scale.setScalar(1.8 + Math.sin(time * 3 + i) * 0.3);
    });
  };
  const project = (v: THREE.Vector3) => {
    const p = v.clone().project(camera);
    return [((p.x + 1) * 640) / 2, ((-p.y + 1) * 480) / 2];
  };
  const fit = () => {
    camera.aspect = 4 / 3;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  };
  fit();
  const overlayPaths = paths.map((curve) =>
    Array.from({ length: 40 }, (_, i) => {
      const [x, y] = project(curve.getPoint(i / 39));
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" "),
  );
  const update = (time: number, selection = 0) => {
    const path =
      paths[(index === 0 && selection === 3) || (index === 2 && night) ? 1 : 0];
    pulse.visible = !!path;
    if (path) pulse.position.copy(path.getPoint((time * 0.17) % 1));
    if (scanner) scanner.rotation.z = Math.sin(time * 0.45) * 0.06;
  };
  update(0);
  return {
    scene,
    camera,
    root,
    groups,
    overlayPaths,
    update,
    animateHero,
    dispose: () => {
      instances.forEach(instance => instance.dispose());
      geometries.forEach((g) => g.dispose());
      materials.forEach((v) => v.dispose());
      textures.forEach((t) => t.dispose());
      environment.dispose();
      key.shadow.dispose();
    },
  };
}
