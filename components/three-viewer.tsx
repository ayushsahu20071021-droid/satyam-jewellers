"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";

type ThreeViewProps = { image: string; alt: string };

export default function ThreeViewer({ image, alt }: ThreeViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const groupRef = useRef<{ rotationY: number; rotationX: number; zoom: number; rotating: boolean } | null>(null);
  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState(true);
  const [rotating, setRotating] = useState(true);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const lowPower = window.matchMedia("(max-width: 760px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency < 4);
    if (lowPower) {
      setSupported(false);
      return;
    }

    let renderer: import("three").WebGLRenderer | undefined;
    let animation = 0;
    let resizeObserver: ResizeObserver | undefined;
    let dragStart: { x: number; y: number; rotationY: number; rotationX: number } | null = null;
    let jewellery: import("three").Group | undefined;
    let dispose: (() => void) | undefined;

    const setup = async () => {
      try {
        const THREE = await import("three");
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.08;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
        camera.position.set(0, 0, 7.6);
        scene.add(new THREE.AmbientLight(0xffdfab, 1.25));
        const key = new THREE.DirectionalLight(0xffdfab, 3.4);
        key.position.set(-4, 5, 6);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0xf6b54d, 3.8);
        rim.position.set(4, 0, -3);
        scene.add(rim);
        const fill = new THREE.PointLight(0xfff4dd, 2.2, 18);
        fill.position.set(0, -3, 5);
        scene.add(fill);

        const environmentCanvas = document.createElement("canvas");
        environmentCanvas.width = 512;
        environmentCanvas.height = 256;
        const context = environmentCanvas.getContext("2d");
        if (context) {
          const gradient = context.createLinearGradient(0, 0, 0, 256);
          gradient.addColorStop(0, "#30251a");
          gradient.addColorStop(0.5, "#100d0a");
          gradient.addColorStop(1, "#51412a");
          context.fillStyle = gradient;
          context.fillRect(0, 0, 512, 256);
          const stripe = (x: number, width: number, color: string) => {
            const band = context.createLinearGradient(x - width, 0, x + width, 0);
            band.addColorStop(0, "rgba(255,220,155,0)");
            band.addColorStop(0.5, color);
            band.addColorStop(1, "rgba(255,220,155,0)");
            context.fillStyle = band;
            context.fillRect(x - width, 0, width * 2, 256);
          };
          stripe(76, 27, "rgba(255,238,198,.92)");
          stripe(255, 10, "rgba(255,255,255,.9)");
          stripe(430, 31, "rgba(255,184,78,.7)");
        }
        const environment = new THREE.CanvasTexture(environmentCanvas);
        environment.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = environment;

        jewellery = new THREE.Group();
        scene.add(jewellery);
        const gold = new THREE.MeshPhysicalMaterial({ color: 0xc88f32, metalness: 0.86, roughness: 0.2, clearcoat: 0.8, clearcoatRoughness: 0.12, envMapIntensity: 1.45 });
        const paleGold = new THREE.MeshPhysicalMaterial({ color: 0xf0c879, metalness: 0.9, roughness: 0.16, clearcoat: 1, envMapIntensity: 1.7 });
        const darkGold = new THREE.MeshPhysicalMaterial({ color: 0x875315, metalness: 0.88, roughness: 0.25, envMapIntensity: 1.25 });
        const gem = new THREE.MeshPhysicalMaterial({ color: 0xffe7a8, metalness: 0.08, roughness: 0.09, transmission: 0.32, thickness: 0.6, clearcoat: 1, envMapIntensity: 1.8 });

        // A small procedural necklace study: an articulated gold chain, a medallion and hanging details.
        const arcPoints = [
          new THREE.Vector3(-2.18, 0.67, 0), new THREE.Vector3(-1.92, 0.12, 0.03),
          new THREE.Vector3(-1.45, -0.5, 0.08), new THREE.Vector3(-0.86, -0.91, 0.13),
          new THREE.Vector3(0, -1.09, 0.16), new THREE.Vector3(0.86, -0.91, 0.13),
          new THREE.Vector3(1.45, -0.5, 0.08), new THREE.Vector3(1.92, 0.12, 0.03),
          new THREE.Vector3(2.18, 0.67, 0),
        ];
        const chainCurve = new THREE.CatmullRomCurve3(arcPoints);
        const chain = new THREE.Mesh(new THREE.TubeGeometry(chainCurve, 160, 0.035, 8, false), paleGold);
        jewellery.add(chain);

        const fineCurve = new THREE.CatmullRomCurve3(arcPoints.map((point) => new THREE.Vector3(point.x, point.y - 0.09, point.z + 0.015)));
        jewellery.add(new THREE.Mesh(new THREE.TubeGeometry(fineCurve, 160, 0.014, 6, false), darkGold));

        const beadGeometry = new THREE.SphereGeometry(0.047, 16, 12);
        for (let i = 0; i <= 48; i += 1) {
          const point = chainCurve.getPoint(i / 48);
          const bead = new THREE.Mesh(beadGeometry, i % 3 === 0 ? paleGold : gold);
          bead.position.copy(point);
          bead.scale.set(1, 1.2, 0.72);
          jewellery.add(bead);
        }

        const medallion = new THREE.Group();
        medallion.position.set(0, -1.07, 0.19);
        jewellery.add(medallion);
        const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.47, 0.47, 0.11, 64, 1), gold);
        disc.rotation.x = Math.PI / 2;
        medallion.add(disc);
        const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.41, 0.035, 10, 64), paleGold);
        medallion.add(outerRing);
        const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.018, 8, 64), paleGold);
        medallion.add(innerRing);
        const gemStone = new THREE.Mesh(new THREE.IcosahedronGeometry(0.19, 1), gem);
        gemStone.position.z = 0.06;
        medallion.add(gemStone);
        for (let i = 0; i < 20; i += 1) {
          const angle = (i / 20) * Math.PI * 2;
          const bead = new THREE.Mesh(new THREE.SphereGeometry(i % 2 ? 0.025 : 0.035, 12, 10), paleGold);
          bead.position.set(Math.cos(angle) * 0.35, Math.sin(angle) * 0.35, 0.06);
          medallion.add(bead);
        }

        const makeDrop = (x: number, y: number, scale: number) => {
          const drop = new THREE.Group();
          drop.position.set(x, y, 0.1);
          drop.scale.setScalar(scale);
          const link = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.018, 8, 24), paleGold);
          link.position.y = 0.08;
          drop.add(link);
          const bead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 18), gold);
          bead.position.y = -0.1;
          bead.scale.set(0.84, 1.25, 0.78);
          drop.add(bead);
          const glint = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 12), gem);
          glint.position.set(0, -0.11, 0.09);
          drop.add(glint);
          jewellery?.add(drop);
        };
        makeDrop(0, -1.62, 1.2);
        makeDrop(-0.31, -1.52, 0.72);
        makeDrop(0.31, -1.52, 0.72);

        groupRef.current = { rotationY: 0, rotationX: -0.04, zoom: 1, rotating: true };
        const resize = () => {
          if (!renderer || !canvas.parentElement) return;
          const { width, height } = canvas.parentElement.getBoundingClientRect();
          renderer.setSize(Math.max(1, width), Math.max(1, height), false);
          camera.aspect = Math.max(1, width) / Math.max(1, height);
          camera.updateProjectionMatrix();
        };
        resizeObserver = new ResizeObserver(resize);
        if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);
        resize();

        const onPointerDown = (event: PointerEvent) => {
          if (!jewellery) return;
          canvas.setPointerCapture(event.pointerId);
          dragStart = { x: event.clientX, y: event.clientY, rotationY: jewellery.rotation.y, rotationX: jewellery.rotation.x };
        };
        const onPointerMove = (event: PointerEvent) => {
          if (!dragStart || !jewellery) return;
          jewellery.rotation.y = dragStart.rotationY + (event.clientX - dragStart.x) * 0.007;
          jewellery.rotation.x = Math.max(-0.3, Math.min(0.3, dragStart.rotationX + (event.clientY - dragStart.y) * 0.004));
          if (groupRef.current) {
            groupRef.current.rotationY = jewellery.rotation.y;
            groupRef.current.rotationX = jewellery.rotation.x;
          }
        };
        const onPointerUp = () => { dragStart = null; };
        canvas.addEventListener("pointerdown", onPointerDown);
        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerup", onPointerUp);
        canvas.addEventListener("pointercancel", onPointerUp);

        let previous = 0;
        const render = (time: number) => {
          animation = requestAnimationFrame(render);
          const delta = Math.min(0.05, (time - previous) / 1000 || 0);
          previous = time;
          const controls = groupRef.current;
          if (jewellery && controls) {
            if (controls.rotating && !dragStart) jewellery.rotation.y += delta * 0.12;
            jewellery.rotation.x += (controls.rotationX - jewellery.rotation.x) * 0.035;
            camera.position.z += (7.6 / controls.zoom - camera.position.z) * 0.08;
          }
          renderer?.render(scene, camera);
        };
        animation = requestAnimationFrame(render);
        setReady(true);

        dispose = () => {
          cancelAnimationFrame(animation);
          resizeObserver?.disconnect();
          canvas.removeEventListener("pointerdown", onPointerDown);
          canvas.removeEventListener("pointermove", onPointerMove);
          canvas.removeEventListener("pointerup", onPointerUp);
          canvas.removeEventListener("pointercancel", onPointerUp);
          scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.geometry.dispose();
              const material = object.material;
              if (Array.isArray(material)) material.forEach((item) => item.dispose());
              else material.dispose();
            }
          });
          environment.dispose();
          renderer?.dispose();
        };
      } catch {
        setSupported(false);
      }
    };

    void setup();
    return () => {
      cancelAnimationFrame(animation);
      resizeObserver?.disconnect();
      dispose?.();
      renderer?.dispose();
    };
  }, []);

  useEffect(() => {
    if (groupRef.current) groupRef.current.rotating = rotating;
  }, [rotating]);
  useEffect(() => {
    if (groupRef.current) groupRef.current.zoom = zoom;
  }, [zoom]);

  const reset = () => {
    setZoom(1);
    setRotating(true);
    if (groupRef.current) {
      groupRef.current.rotationX = -0.04;
      groupRef.current.rotationY = 0;
    }
  };

  return (
    <div className={`three-viewer${ready ? " viewer-ready" : ""}${!supported ? " viewer-fallback-only" : ""}`}>
      <img className="viewer-fallback-image" src={image} alt={alt} />
      <canvas ref={canvasRef} className="viewer-canvas" aria-label="Interactive procedural gold necklace model. Drag to rotate." />
      <div className="viewer-loading" aria-live="polite">{supported && !ready ? "Preparing the view…" : !supported ? "A closer look, at your own pace." : ""}</div>
      <div className="viewer-controls" aria-label="3D jewellery controls">
        <button onClick={() => setRotating((value) => !value)} aria-pressed={rotating} aria-label={rotating ? "Pause rotation" : "Start rotation"}><span>{rotating ? "PAUSE" : "ROTATE"}</span></button>
        <span className="viewer-controls-label">ZOOM</span>
        <button onClick={() => setZoom((value) => Math.max(0.82, Number((value - 0.12).toFixed(2))))} aria-label="Zoom out"><Minus size={14} /></button>
        <button onClick={() => setZoom((value) => Math.min(1.24, Number((value + 0.12).toFixed(2))))} aria-label="Zoom in"><Plus size={14} /></button>
        <button onClick={reset} aria-label="Reset jewellery view"><RotateCcw size={14} /><span>RESET</span></button>
      </div>
    </div>
  );
}
