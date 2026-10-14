import { useEffect, useRef, useState } from "react";
import { useTheme } from "./Theme";
export default function Sculpture() {
  const host = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"fallback" | "webgl">("fallback");
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const motionControl = useRef<(() => void) | null>(null);
  const toggleMotion = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    motionControl.current?.();
  };
  const { resolved } = useTheme();
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let gone = false;
    let cleanup = () => {};
    setMode("fallback");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const timer = window.setTimeout(async () => {
      try {
        const THREE = await import("./scene/runtime");
        if (gone) return;
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "low-power",
        });
        renderer.setPixelRatio(
          Math.min(devicePixelRatio, innerWidth < 640 ? 1.25 : 1.75),
        );
        renderer.setClearColor(0, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.4;
        const canvas = renderer.domElement;
        canvas.setAttribute("aria-hidden", "true");
        el.appendChild(canvas);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 30);
        camera.position.z = 8.7;
        const geometry = new THREE.TorusKnotGeometry(
          1.33,
          0.43,
          innerWidth < 640 ? 160 : 240,
          32,
          2,
          3,
        );
        const material = new THREE.MeshPhysicalMaterial({
          color: resolved === "dark" ? 0xff782c : 0xf46a23,
          metalness: 0.32,
          roughness: 0.25,
          clearcoat: 0.9,
          clearcoatRoughness: 0.24,
        });
        const sculpture = new THREE.Mesh(geometry, material);
        sculpture.rotation.set(0.45, -0.4, -0.45);
        scene.add(sculpture);
        scene.add(
          new THREE.HemisphereLight(
            resolved === "dark" ? 0xffead2 : 0xffffff,
            0x6b2912,
            3,
          ),
        );
        const key = new THREE.DirectionalLight(0xfff5e5, 6);
        key.position.set(-4, 5, 4);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0xffffff, 4);
        rim.position.set(4, -2, -1);
        scene.add(rim);
        let visible = true;
        let frame = 0;
        let phase = 0;
        let previous = 0;
        const target = { x: 0, y: 0 };
        const render = (time: number) => {
          frame = 0;
          if (
            gone ||
            !visible ||
            document.hidden ||
            reduced.matches ||
            pausedRef.current
          )
            return;
          const delta = previous ? Math.min((time - previous) / 1000, 0.04) : 0;
          previous = time;
          phase += delta * 0.2;
          sculpture.rotation.y +=
            (phase + target.x * 0.22 - sculpture.rotation.y) * 0.03;
          sculpture.rotation.x +=
            (0.45 + target.y * 0.16 - sculpture.rotation.x) * 0.035;
          sculpture.position.y = Math.sin(phase * 1.8) * 0.08;
          renderer.render(scene, camera);
          frame = requestAnimationFrame(render);
        };
        const start = () => {
          if (
            !frame &&
            !gone &&
            visible &&
            !document.hidden &&
            !reduced.matches &&
            !pausedRef.current
          ) {
            previous = 0;
            el.dataset.running = "true";
            frame = requestAnimationFrame(render);
          }
        };
        const stop = () => {
          cancelAnimationFrame(frame);
          frame = 0;
          el.dataset.running = "false";
        };
        motionControl.current = () => {
          if (pausedRef.current) stop();
          else start();
        };
        const resize = () => {
          const { width, height } = el.getBoundingClientRect();
          if (!width || !height) return;
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.render(scene, camera);
        };
        const pointer = (e: PointerEvent) => {
          if (e.pointerType === "touch") return;
          const r = el.getBoundingClientRect();
          target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
          target.y = ((e.clientY - r.top) / r.height) * 2 - 1;
        };
        const leave = () => {
          target.x = 0;
          target.y = 0;
        };
        const visibility = () => {
          if (document.hidden) stop();
          else start();
        };
        const preference = () => {
          if (reduced.matches) {
            stop();
            setMode("fallback");
          } else {
            setMode("webgl");
            start();
          }
        };
        const loss = (e: Event) => {
          e.preventDefault();
          stop();
          setMode("fallback");
        };
        const restored = () => {
          resize();
          setMode("webgl");
          start();
        };
        const observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible) start();
          else stop();
        });
        observer.observe(el);
        const sizeObserver = new ResizeObserver(resize);
        sizeObserver.observe(el);
        el.addEventListener("pointermove", pointer);
        el.addEventListener("pointerleave", leave);
        document.addEventListener("visibilitychange", visibility);
        reduced.addEventListener("change", preference);
        canvas.addEventListener("webglcontextlost", loss);
        canvas.addEventListener("webglcontextrestored", restored);
        resize();
        setMode("webgl");
        start();
        cleanup = () => {
          motionControl.current = null;
          stop();
          observer.disconnect();
          sizeObserver.disconnect();
          el.removeEventListener("pointermove", pointer);
          el.removeEventListener("pointerleave", leave);
          document.removeEventListener("visibilitychange", visibility);
          reduced.removeEventListener("change", preference);
          canvas.removeEventListener("webglcontextlost", loss);
          canvas.removeEventListener("webglcontextrestored", restored);
          geometry.dispose();
          material.dispose();
          renderer.dispose();
          canvas.remove();
        };
      } catch {
        if (!gone) setMode("fallback");
      }
    }, 350);
    return () => {
      gone = true;
      clearTimeout(timer);
      cleanup();
    };
  }, [resolved]);
  return (
    <div className="sculpture-wrap">
      <div ref={host} className="sculpture" data-mode={mode} aria-hidden="true">
        <svg className="sculpture-still" viewBox="0 0 500 500">
          <defs>
            <linearGradient id="ember" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#ffb36a" />
              <stop offset=".45" stopColor="#f46a23" />
              <stop offset="1" stopColor="#a73b13" />
            </linearGradient>
          </defs>
          <g
            transform="translate(250 250) rotate(-25)"
            fill="none"
            stroke="url(#ember)"
            strokeWidth="60"
          >
            <ellipse rx="150" ry="85" transform="rotate(30)" />
            <ellipse rx="150" ry="85" transform="rotate(90)" />
            <ellipse rx="150" ry="85" transform="rotate(150)" />
          </g>
        </svg>
      </div>
      <div className="sculpture-caption">
        <span>
          <i />
          EXPLORATION / 001
        </span>
        {mode === "webgl" && (
          <button onClick={toggleMotion} aria-pressed={paused}>
            {paused ? "Play motion" : "Pause motion"}
          </button>
        )}
      </div>
    </div>
  );
}
