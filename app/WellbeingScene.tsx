"use client";

import { useEffect, useRef } from "react";
import {
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Group,
  GridHelper,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
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

    const camera = new PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(3.8, compact ? 2.5 : 3.1, compact ? 7.5 : 8.2);
    camera.lookAt(0, -0.25, 0);

    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearAlpha(0);
    hostElement.appendChild(renderer.domElement);

    const district = new Group();
    scene.add(district);

    const blue = new Color("#083d77");
    const red = new Color("#bb1d2b");
    const silver = new Color("#f6f8fb");

    const towerMaterial = new MeshPhysicalMaterial({
      color: blue,
      emissive: blue,
      emissiveIntensity: 0.04,
      metalness: 0.42,
      roughness: 0.38,
      clearcoat: 0.8,
      transparent: true,
      opacity: 0.9
    });
    const accentMaterial = new MeshPhysicalMaterial({
      color: red,
      emissive: red,
      emissiveIntensity: 0.08,
      metalness: 0.22,
      roughness: 0.34,
      clearcoat: 0.65,
      transparent: true,
      opacity: 0.78
    });
    const glassMaterial = new MeshPhysicalMaterial({
      color: silver,
      metalness: 0.12,
      roughness: 0.2,
      clearcoat: 0.9,
      transparent: true,
      opacity: 0.72
    });

    const grid = new GridHelper(7.2, 18, "#ffffff", "#6f8fc0");
    grid.position.y = -1.34;
    (grid.material as LineBasicMaterial).transparent = true;
    (grid.material as LineBasicMaterial).opacity = compact ? 0.16 : 0.22;
    district.add(grid);

    const blocks: Array<[number, number, number, number, number, number, MeshPhysicalMaterial]> = [
      [-1.8, -0.72, 0.2, 0.52, 1.22, 0.52, towerMaterial],
      [-1.08, -0.92, -0.54, 0.44, 0.82, 0.48, glassMaterial],
      [-0.38, -0.58, 0.1, 0.62, 1.55, 0.58, towerMaterial],
      [0.44, -0.98, -0.38, 0.5, 0.72, 0.5, glassMaterial],
      [1.16, -0.72, 0.32, 0.7, 1.08, 0.62, accentMaterial],
      [1.94, -0.86, -0.44, 0.42, 0.86, 0.46, towerMaterial]
    ];
    const blockMeshes: Mesh[] = [];
    const edgeLines: LineSegments[] = [];
    blocks.forEach(([x, y, z, width, height, depth, material]) => {
      const geometry = new BoxGeometry(width, height, depth);
      const block = new Mesh(geometry, material);
      block.position.set(x, y + height / 2, z);
      blockMeshes.push(block);
      district.add(block);

      const edge = new LineSegments(
        new EdgesGeometry(geometry),
        new LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.32 })
      );
      edge.position.copy(block.position);
      edgeLines.push(edge);
      district.add(edge);
    });

    const nodeGeometry = new BufferGeometry();
    const nodeCount = compact ? 42 : 68;
    const nodePositions = new Float32Array(nodeCount * 3);
    for (let index = 0; index < nodeCount; index += 1) {
      const lane = index % 6;
      const row = Math.floor(index / 6);
      nodePositions[index * 3] = -2.8 + lane * 1.08;
      nodePositions[index * 3 + 1] = -1.28 + (index % 2) * 0.04;
      nodePositions[index * 3 + 2] = -1.8 + row * 0.36;
    }
    nodeGeometry.setAttribute("position", new BufferAttribute(nodePositions, 3));

    const nodes = new Points(
      nodeGeometry,
      new PointsMaterial({
        color: silver,
        size: compact ? 0.018 : 0.024,
        transparent: true,
        opacity: 0.5,
        depthWrite: false
      })
    );
    district.add(nodes);

    const pathMaterial = new LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.32 });
    const pathGeometry = new BufferGeometry();
    const pathPositions = new Float32Array([
      -2.6, -1.18, 1.2,
      -1.42, -1.08, 0.52,
      -0.24, -1.12, 0.86,
      0.74, -1.04, 0.12,
      2.36, -1.14, 0.72
    ]);
    pathGeometry.setAttribute("position", new BufferAttribute(pathPositions, 3));
    district.add(new Line(pathGeometry, pathMaterial));

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
      district.rotation.y += ((-0.42 + pointerX * 0.08) - district.rotation.y) * 0.035;
      district.rotation.x += ((0.18 - pointerY * 0.04) - district.rotation.x) * 0.035;
      district.position.y = prefersReducedMotion ? 0 : Math.sin(t * 0.75) * 0.025;
      nodes.position.x = prefersReducedMotion ? 0 : Math.sin(t * 0.35) * 0.05;
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
      towerMaterial.dispose();
      accentMaterial.dispose();
      glassMaterial.dispose();
      pathMaterial.dispose();
      nodeGeometry.dispose();
      pathGeometry.dispose();
      blockMeshes.forEach((block) => block.geometry.dispose());
      edgeLines.forEach((edge) => {
        edge.geometry.dispose();
        (edge.material as LineBasicMaterial).dispose();
      });
      (grid.geometry as BufferGeometry).dispose();
      (grid.material as LineBasicMaterial).dispose();
      renderer.dispose();
    };
  }, [compact]);

  return <div className="wellbeing-scene" ref={hostRef} aria-hidden="true" />;
}
