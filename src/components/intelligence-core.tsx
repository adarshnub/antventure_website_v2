"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useEffect, useRef } from "react";
import type { Group, Mesh } from "three";

function Core() {
  const group = useRef<Group>(null);
  const inner = useRef<Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => { scroll.current = Math.min(1, window.scrollY / Math.max(1, window.innerHeight)); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame(({ clock }, delta) => {
    if (!group.current || !inner.current) return;
    group.current.rotation.y += (pointer.current.x * .46 - group.current.rotation.y) * Math.min(1, delta * 2.6);
    group.current.rotation.x += (-pointer.current.y * .25 - group.current.rotation.x) * Math.min(1, delta * 2.6);
    group.current.rotation.z = clock.getElapsedTime() * .055;
    group.current.position.x = scroll.current * .42;
    group.current.position.z = -scroll.current * .85;
    group.current.scale.setScalar(1 - scroll.current * .18);
    inner.current.rotation.y -= delta * .18;
    inner.current.rotation.x += delta * .1;
  });

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={.15} floatIntensity={.25}>
        <mesh ref={inner}>
          <icosahedronGeometry args={[1.42, 5]} />
          <meshPhysicalMaterial color="#8ff5df" emissive="#0b6f75" emissiveIntensity={.28} roughness={.13} metalness={.08} transmission={.64} thickness={1.25} transparent opacity={.88} />
        </mesh>
        <mesh rotation={[Math.PI / 2.5, 0, .35]}>
          <torusGeometry args={[1.88, .018, 8, 180]} />
          <meshBasicMaterial color="#f4a261" transparent opacity={.8} />
        </mesh>
        <mesh rotation={[.2, Math.PI / 2.2, -.35]}>
          <torusGeometry args={[2.2, .012, 8, 180]} />
          <meshBasicMaterial color="#5b8cff" transparent opacity={.56} />
        </mesh>
        <mesh rotation={[-.9, .2, .7]}>
          <torusGeometry args={[1.68, .01, 8, 180]} />
          <meshBasicMaterial color="#ff6b5f" transparent opacity={.7} />
        </mesh>
      </Float>
    </group>
  );
}

export default function IntelligenceCore() {
  return (
    <div className="intelligence-core" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5.8], fov: 45, near: .1, far: 20 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={1.2} />
        <pointLight position={[3, 3, 4]} intensity={22} color="#31d3b0" />
        <pointLight position={[-3, -2, 2]} intensity={14} color="#ff6b5f" />
        <Core />
      </Canvas>
    </div>
  );
}
