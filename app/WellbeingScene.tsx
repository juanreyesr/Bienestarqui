"use client";

import { useEffect, useRef } from "react";
import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TorusGeometry,
  WebGLRenderer
} from "three";

type WellbeingSceneProps = {
  compact?: boolean;
};

export function WellbeingScene({ compact = false }: WellbeingSceneProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const hostElement = host;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new Scene();
    scene.background = null;

    const camera = new PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, compact ? 8 : 7);

    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearAlpha(0);
    hostElement.appendChild(renderer.domElement);

    const system = new Group();
    scene.add(system);

    const blue = new Color("#083d77");
    const red = new Color("#bb1d2b");
    const silver = new Color("#f6f8fb");

    const ringMaterial = new MeshPhysicalMaterial({
      color: blue,
      emissive: blue,
      emissiveIntensity: 0.12,
      metalness: 0.42,
      roughness: 0.22,
      clearcoat: 0.8,
      transparent: true,
      opacity: 0.88
    });
    const alertMaterial = new MeshPhysicalMaterial({
      color: red,
      emissive: red,
      emissiveIntensity: 0.2,
      metalness: 0.2,
      roughness: 0.28,
      clearcoat: 0.65,
      transparent: true,
      opacity: 0.84
    });

    const rings: Mesh[] = [];
    for (let index = 0; index < 4; index += 1) {
      const geometry = new TorusGeometry(1.15 + index * 0.34, 0.012 + index * 0.003, 16, 144);
      const mesh = new Mesh(geometry, index === 2 ? alertMaterial : ringMaterial);
      mesh.rotation.set(index * 0.46, index * 0.36, index * 0.22);
      mesh.position.z = -index * 0.12;
      rings.push(mesh);
      system.add(mesh);
    }

    const nodeGeometry = new BufferGeometry();
    const nodeCount = compact ? 72 : 116;
    const nodePositions = new Float32Array(nodeCount * 3);
    for (let index = 0; index < nodeCount; index += 1) {
      const angle = index * 2.399963;
      const radius = 0.75 + (index % 19) * 0.085;
      nodePositions[index * 3] = Math.cos(angle) * radius;
      nodePositions[index * 3 + 1] = Math.sin(angle) * radius * 0.68;
      nodePositions[index * 3 + 2] = ((index % 11) - 5) * 0.08;
    }
    nodeGeometry.setAttribute("position", new BufferAttribute(nodePositions, 3));

    const nodes = new Points(
      nodeGeometry,
      new PointsMaterial({
        color: silver,
        size: compact ? 0.028 : 0.036,
        transparent: true,
        opacity: 0.74,
        depthWrite: false
      })
    );
    system.add(nodes);

    const pathMaterial = new LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.16 });
    const pathGeometry = new BufferGeometry();
    const pathPositions = new Float32Array([
      -1.75, -0.48, 0.15,
      -0.82, 0.36, -0.02,
      0.02, -0.08, 0.16,
      0.92, 0.54, -0.08,
      1.72, -0.22, 0.1
    ]);
    pathGeometry.setAttribute("position", new BufferAttribute(pathPositions, 3));
    system.add(new Line(pathGeometry, pathMaterial));

    scene.add(new AmbientLight("#ffffff", 1.65));
    const keyLight = new DirectionalLight("#ffffff", 3.1);
    keyLight.position.set(2.5, 2.4, 4);
    scene.add(keyLight);
    const redLight = new DirectionalLight("#ff7580", 1.4);
    redLight.position.set(-3, -1.5, 2.4);
    scene.add(redLight);

    let frameId = 0;
    let pointerX = 0;
    let pointerY = 0;

    function resize() {
      const { width, height } = hostElement.getBoundingClientRect();
      renderer.setSize(Math.max(width, 1), Math.max(height, 1), false);
      camera.aspect = Math.max(width, 1) / Math.max(height, 1);
      camera.updateProjectionMatrix();
    }

    function onPointerMove(event: PointerEvent) {
      const bounds = hostElement.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    }

    function animate(time: number) {
      const t = time * 0.001;
      system.rotation.y += ((pointerX * 0.18) - system.rotation.y) * 0.035;
      system.rotation.x += ((-pointerY * 0.1) - system.rotation.x) * 0.035;
      rings.forEach((ring, index) => {
        ring.rotation.z = t * (0.08 + index * 0.012);
        ring.rotation.x += prefersReducedMotion ? 0 : 0.0015 + index * 0.0004;
      });
      nodes.rotation.z = prefersReducedMotion ? 0.18 : t * 0.035;
      renderer.render(scene, camera);
      hostElement.dataset.sceneReady = "true";
      if (!prefersReducedMotion) frameId = window.requestAnimationFrame(animate);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(hostElement);
    hostElement.addEventListener("pointermove", onPointerMove);
    resize();
    animate(0);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      hostElement.removeEventListener("pointermove", onPointerMove);
      hostElement.removeChild(renderer.domElement);
      ringMaterial.dispose();
      alertMaterial.dispose();
      pathMaterial.dispose();
      nodeGeometry.dispose();
      pathGeometry.dispose();
      rings.forEach((ring) => ring.geometry.dispose());
      renderer.dispose();
    };
  }, [compact]);

  return <div className="wellbeing-scene" ref={hostRef} aria-hidden="true" />;
}
