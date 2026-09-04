"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { Group, InstancedMesh } from "three";
import { Color, Object3D } from "three";

const PALETTE = ["#31d3b0", "#f4a261", "#ff6b5f", "#5b8cff"];
const FIELD_COLORS = PALETTE.map((color) => new Color(color));

function IntelligenceField({ cursor, scroll }: { cursor: React.RefObject<{ x: number; y: number }>; scroll: React.RefObject<number> }) {
  const group = useRef<Group>(null);
  const particles = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const points = useMemo(
    () => Array.from({ length: 70 }, (_, index) => ({
      x: Math.sin(index * 2.17) * (2.4 + (index % 7) * 0.16),
      y: Math.cos(index * 1.31) * (1.7 + (index % 5) * 0.13),
      z: ((index % 13) - 6) * 0.22,
      scale: 0.45 + (index % 4) * 0.14,
    })),
    [],
  );

  useEffect(() => {
    if (!particles.current) return;
    points.forEach((point, index) => {
      dummy.position.set(point.x, point.y, point.z);
      dummy.scale.setScalar(point.scale);
      dummy.updateMatrix();
      particles.current?.setMatrixAt(index, dummy.matrix);
      particles.current?.setColorAt(index, FIELD_COLORS[index % FIELD_COLORS.length]);
    });
    particles.current.instanceMatrix.needsUpdate = true;
    if (particles.current.instanceColor) particles.current.instanceColor.needsUpdate = true;
  }, [dummy, points]);

  useFrame(({ clock }, delta) => {
    const field = group.current;
    if (!field) return;
    const t = clock.getElapsedTime();
    field.rotation.y += (cursor.current.x * 0.28 + scroll.current * 1.5 - field.rotation.y) * Math.min(1, delta * 2.4);
    field.rotation.x += (-cursor.current.y * 0.16 + Math.sin(t * 0.15) * 0.08 - field.rotation.x) * Math.min(1, delta * 2.2);
    field.position.y += ((0.35 - scroll.current) * 1.25 - field.position.y) * Math.min(1, delta * 1.7);
  });

  return (
    <group ref={group} rotation={[0.08, -0.25, -0.08]}>
      <mesh position={[-2.25, 1.15, -1]} rotation={[0.3, 0.4, 0.2]}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshBasicMaterial color="#31d3b0" wireframe transparent opacity={0.18} />
      </mesh>
      <mesh position={[2.5, -0.8, -0.6]} rotation={[0.7, 0.1, 0.35]}>
        <torusKnotGeometry args={[0.75, 0.11, 80, 10, 2, 3]} />
        <meshBasicMaterial color="#ff6b5f" wireframe transparent opacity={0.17} />
      </mesh>
      <mesh position={[1.25, 1.8, -1.8]} rotation={[0.1, 0.8, 0.1]}>
        <octahedronGeometry args={[0.72, 0]} />
        <meshBasicMaterial color="#5b8cff" wireframe transparent opacity={0.18} />
      </mesh>
      <instancedMesh ref={particles} args={[undefined, undefined, points.length]}>
        <sphereGeometry args={[0.035, 7, 7]} />
        <meshBasicMaterial vertexColors transparent opacity={0.58} />
      </instancedMesh>
    </group>
  );
}

export default function AmbientField() {
  const cursor = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const enabled = typeof window !== "undefined"
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    && !(navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2);

  useEffect(() => {
    if (!enabled) return;
    const onPointerMove = (event: PointerEvent) => {
      cursor.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      cursor.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      const range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scroll.current = window.scrollY / range;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled]);

  if (!enabled) return <div className="ambient-field-fallback" aria-hidden="true" />;
  return (
    <div className="ambient-field" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 7], fov: 45, near: 0.1, far: 25 }} gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}>
        <IntelligenceField cursor={cursor} scroll={scroll} />
      </Canvas>
    </div>
  );
}
