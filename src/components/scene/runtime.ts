// Export only the primitives used by the hero so the lazy chunk can be tree-shaken.
export {
  WebGLRenderer,
  SRGBColorSpace,
  ACESFilmicToneMapping,
  Scene,
  PerspectiveCamera,
  TorusKnotGeometry,
  MeshPhysicalMaterial,
  Mesh,
  HemisphereLight,
  DirectionalLight,
} from "three";
