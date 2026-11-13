# GIGI visual asset system

## Audit and checklist

The original Three.js hero used an abstract circuit tile and three similar nodes. The homepage capability panels used oversized shield/network icons and a single solar panel. The four service-page heroes repeated one icon treatment, while the service cards contained no substantial artwork. These were the main opportunities to explain the services through recognisable scenes and reduce repetitive empty panels.

- [x] Connected GIGI hero: accurate supplied shield, four recognisable service objects and accessible selection controls.
- [x] IT board: server cabinet, switch, laptop/phone, fibre connections and backup storage.
- [x] Security board: camera, viewing arc, doorway, access reader, alarm panel and perimeter.
- [x] Energy board: property, panel array, inverter, battery and electrical point, with day/night states.
- [x] Design board: original responsive website and FIELD / FORM branding concept.
- [x] Static production SVGs and a cropped shield texture generated from editable sources.

## Files and production

- `assets/boards.mjs`: editable procedural SVG masters; common 640 × 440 artboard and shared primitives.
- `src/scene.tsx`: editable procedural Three.js hero source.
- `src/VisualBoard.tsx`: accessible board controls and visibility-aware animation lifecycle.
- `src/visuals.css`: materials, state changes, mobile compositions and reduced-motion rules.
- `scripts/assets.mjs`: generates compact standalone SVG fallbacks and the logo texture before development/build.
- `public/visuals/`: production SVGs, shield PNG and lossless resized WebP wordmark; copied to `dist/visuals/` by Vite.

All artwork is original procedural illustration. The shield comes from the approved supplied PNG, without recolouring or changing its aspect ratio. Website and brand mockups are explicitly original concepts. No live metrics, completed client projects or energy-performance claims are depicted.

The shared palette is cobalt, midnight navy, teal, pearl and satin metal. SVG is used for clear, lightweight interactive boards; WebGL is reserved for the spatial hero. HTML buttons provide the full interaction independently of the canvas. Reduced-motion users receive static states, and animation pauses offscreen and when the browser tab is hidden.
