"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { track } from "@vercel/analytics";
import { TrackedLink } from "@/components/tracked-link";

const inputs = [
  { name: "Email", icon: "✉", color: "#3cddff" },
  { name: "WhatsApp", icon: "◉", color: "#50e4b0" },
  { name: "ERP", icon: "▤", color: "#b699ff" },
  { name: "Forms", icon: "▧", color: "#ffbe62" },
] as const;
const outputs = [
  { name: "Draft reply", icon: "↗", color: "#ffbe62" },
  { name: "Update system", icon: "▤", color: "#b699ff" },
  { name: "Notify", icon: "♧", color: "#ff76be" },
  { name: "Create task", icon: "✓", color: "#50e4b0" },
] as const;
const rules = [
  { name: "Your rules", icon: "⚖", color: "#ffcf69" },
  { name: "Your documents", icon: "▤", color: "#50e4b0" },
  { name: "Your templates", icon: "▧", color: "#3cddff" },
] as const;
const tint = (color: string): CSSProperties => ({ "--node-color": color } as CSSProperties);

function IntelligenceCore() {
  // Vector geometry stays sharp at any size, without a second WebGL context.
  const rings = Array.from({ length: 5 }, (_, row) => Array.from({ length: 10 }, (_, col) => {
    const latitude = (row + 1) / 6 * Math.PI;
    const angle = col / 10 * Math.PI * 2 + row * .26;
    return [100 + Math.cos(angle) * Math.sin(latitude) * 74, 100 + Math.cos(latitude) * 72 + Math.sin(angle) * Math.sin(latitude) * 22].map((n) => Number(n.toFixed(3)));
  }));
  return <svg viewBox="0 0 200 200" aria-hidden="true" className="role-intelligence-core">
    <defs><radialGradient id="role-core-glow"><stop stopColor="#e6dc82" stopOpacity=".55" /><stop offset=".42" stopColor="#4febbb" stopOpacity=".18" /><stop offset="1" stopColor="#4febbb" stopOpacity="0" /></radialGradient></defs>
    <circle className="role-core-energy" cx="100" cy="100" r="98" fill="url(#role-core-glow)" />
    <g className="role-core-mesh" fill="none" stroke="#6bf2be" strokeWidth=".7">
      {rings.map((ring, row) => <g key={row} opacity={.45 + row * .1}>
        <polygon points={ring.map((p) => p.join(",")).join(" ")} />
        {ring.map((p, col) => <path key={col} d={`M${p.join(",")} L${(rings[row + 1]?.[col] || [100, 28]).join(",")} M${p.join(",")} L${(rings[row + 1]?.[(col + 1) % 10] || [100, 172]).join(",")}`} />)}
      </g>)}
    </g>
    <g className="role-core-orbit" fill="#b2fbdc">{Array.from({ length: 14 }, (_, i) => <circle key={i} cx={(100 + Math.cos(i * 2.4) * 90).toFixed(3)} cy={(100 + Math.sin(i * 2.4) * 90).toFixed(3)} r={i % 3 ? .8 : 1.4} />)}</g>
    <circle cx="100" cy="100" r="3" fill="#fff4bb" />
  </svg>;
}

export function RoleXDemo() {
  const root = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => { element.dataset.visible = String(entry.isIntersecting); }, { rootMargin: "100px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <section ref={root} className="role-demo section-pad" id="explore" data-galaxy-stop aria-labelledby="role-demo-title">
    <div className="shell">
      <header className="role-demo-heading">
        <p className="eyebrow">ROLE:X / Flagship product</p>
        <h2 id="role-demo-title">ROLE:X</h2>
        <p className="role-demo-kicker">Plug-and-play workflow automation</p>
        <p className="role-demo-intro">Automate work inside email, WhatsApp, ERP and forms. ROLE:X applies your instructions to prepare replies, update systems and create tasks, with human approval where required.</p>
      </header>
      <div className="role-demo-map" id="role-demo-map" data-selected={selected}>
        <svg className="role-connections" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">
          {inputs.map((input, i) => <g key={input.name} style={tint(input.color)} className={selected === i ? "connection selected" : "connection"}>
            <path d={`M150 ${65 + i * 94} Q340 ${90 + i * 65} 500 205`} />
            <circle r="3" className="role-signal" style={{ offsetPath: `path('M150 ${65 + i * 94} Q340 ${90 + i * 65} 500 205')`, animationDelay: `${-i * .7}s` }} />
          </g>)}
          {outputs.map((output, i) => <g key={output.name} style={tint(output.color)} className="connection outgoing">
            <path d={`M500 205 Q665 ${90 + i * 65} 850 ${65 + i * 94}`} />
            <circle r="3" className="role-signal" style={{ offsetPath: `path('M500 205 Q665 ${90 + i * 65} 850 ${65 + i * 94}')`, animationDelay: `${-i * .8}s` }} />
          </g>)}
          {[380, 500, 620].map((x) => <path key={x} className="role-rule-line" d={`M${x} 450 L500 245`} />)}
        </svg>
        <div className="role-inputs" role="group" aria-label="Select an example input">
          <p className="role-column-label">Reads from</p>
          {inputs.map((input, i) => <button type="button" key={input.name} className="role-node" style={tint(input.color)} aria-pressed={selected === i} aria-controls="role-demo-map" onClick={() => { setSelected(i); track("explorer_started", { input: input.name }); }}><span className="role-node-icon" aria-hidden="true">{input.icon}</span>{input.name}</button>)}
        </div>
        <div className="role-core"><IntelligenceCore /><strong>ROLE:X</strong><span>Your instructions.</span><small>Connected intelligence.</small></div>
        <div className="role-outputs" aria-label="Possible outputs">
          <p className="role-column-label">Writes to</p>
          {outputs.map((output) => <div key={output.name} className="role-node" style={tint(output.color)}><span className="role-node-icon" aria-hidden="true">{output.icon}</span>{output.name}</div>)}
        </div>
        <div className="role-rules"><p>Follows your rules</p><div>{rules.map((rule) => <div className="role-node" key={rule.name} style={tint(rule.color)}><span className="role-node-icon" aria-hidden="true">{rule.icon}</span>{rule.name}</div>)}</div></div>
      </div>
      <div className="role-demo-actions"><TrackedLink className="button dark" href={`/contact-sales?reason=rolex&scenario=${encodeURIComponent(`ROLE:X plug-and-play / ${inputs[selected].name}`)}`} eventName="request_demo_clicked" eventData={{ placement: "role_demo" }}>Run this on your workflow <span aria-hidden="true">↗</span></TrackedLink><TrackedLink className="text-link light" href="https://role-x.surge.sh/" target="_blank" rel="noreferrer" eventName="role_x_outbound" eventData={{ placement: "role_demo" }}>Experience ROLE:X <span aria-hidden="true">↗</span></TrackedLink></div>
    </div>
  </section>;
}
