import SceneCanvas from "./SceneCanvas";

export default function Scene() {
  return (
    <SceneCanvas
      index={5}
      mode="default"
      label="Interactive 3D equipment model"
      hint="Drag sideways or use arrow keys to rotate"
      controls
    />
  );
}
