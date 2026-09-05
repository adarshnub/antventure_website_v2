"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import { audiences, functions, getScenario } from "@/lib/content";
import type { Audience, BusinessFunction } from "@/lib/types";

const WorkflowScene = dynamic(() => import("./workflow-scene"), { ssr: false, loading: () => <div className="scene-loader">Organizing inputs…</div> });

const painOptions: Record<BusinessFunction, string[]> = {
  sales: ["Slow enquiry response", "Manual quote preparation", "Missed follow-ups"],
  operations: ["Manual task routing", "Approval bottlenecks", "Daily reporting"],
  finance: ["Invoice matching", "BOQ pricing", "Purchase orders"],
  people: ["Employee onboarding", "Policy questions", "Internal training"],
  service: ["Support triage", "Disconnected channels", "Citizen-service routing"],
};

export function TransformationExplorer({ immersive = false }: { immersive?: boolean }) {
  const [audience, setAudience] = useState<Audience | null>("business");
  const [fn, setFunction] = useState<BusinessFunction | null>("sales");
  const [pain, setPain] = useState<string | null>("Slow enquiry response");
  const scenario = useMemo(() => audience && fn ? getScenario(audience, fn) : null, [audience, fn]);
  const complete = Boolean(scenario && pain);

  const resetFrom = (step: 1 | 2) => {
    if (step <= 1) setFunction(null);
    setPain(null);
  };

  return (
    <section className="explorer section-pad" id="explore" data-galaxy-stop={immersive || undefined} aria-labelledby="explorer-title">
      <div className="shell">
        <div className="section-heading explorer-heading">
          <div><p className="eyebrow">Interactive demonstration · 01</p><h2 id="explorer-title">What could your<br /><em>workflow become?</em></h2></div>
          <p>Choose where you work. We’ll organize a familiar bottleneck into a practical human-and-AI system.</p>
        </div>

        <div className="explorer-frame">
          <div className="explorer-controls">
            <fieldset>
              <legend><span>01</span> Your organization</legend>
              <div className="choice-row">
                {audiences.map((item) => <button type="button" className={audience === item.id ? "choice active" : "choice"} aria-pressed={audience === item.id} key={item.id} onClick={() => { setAudience(item.id); resetFrom(1); track("explorer_started", { audience: item.id }); }}>{item.label}</button>)}
              </div>
            </fieldset>

            <fieldset disabled={!audience}>
              <legend><span>02</span> The function</legend>
              <div className="choice-row">
                {functions.map((item) => <button type="button" className={fn === item.id ? "choice active" : "choice"} aria-pressed={fn === item.id} key={item.id} onClick={() => { setFunction(item.id); setPain(null); }}>{item.label}</button>)}
              </div>
            </fieldset>

            <fieldset disabled={!fn}>
              <legend><span>03</span> The bottleneck</legend>
              <div className="choice-stack">
                {(fn ? painOptions[fn] : ["Select a function first"]).map((item) => <button type="button" className={pain === item ? "choice wide active" : "choice wide"} aria-pressed={pain === item} key={item} onClick={() => { setPain(item); if (audience && fn) track("explorer_completed", { audience, function: fn, pain: item }); }}>{item}</button>)}
              </div>
            </fieldset>
          </div>

          <div className="explorer-output" aria-live="polite">
            <div className="explorer-visual" aria-hidden="true">
              {immersive ? <div className="galaxy-workflow"><div className="galaxy-workflow-inputs"><span>Email</span><span>Documents</span><span>WhatsApp</span></div><i /><div className="galaxy-workflow-core">ROLE:X<small>Read · reason · act</small></div><i /><div className="galaxy-workflow-decision">You approve<small>Human decision</small></div></div> : <WorkflowScene />}
              <div className="visual-labels"><span>Inputs</span><strong>ROLE:X</strong><span>Actions</span></div>
            </div>
            {!complete || !scenario ? (
              <div className="empty-result"><span>→</span><p>Make three choices to generate your transformation map.</p></div>
            ) : (
              <div className="result-card">
                <p className="eyebrow">Your transformation map</p>
                <h3>{pain}</h3>
                <p className="result-summary">{scenario.summary}</p>
                <div className="result-columns">
                  <div><p className="result-label">AI handles</p><ol>{scenario.aiSteps.map((step) => <li key={step}>{step}</li>)}</ol></div>
                  <div><p className="result-label">Human decision</p><p>{scenario.humanDecision}</p><p className="result-label spaced">Systems updated</p><p>{scenario.systemsUpdated.join(" · ")}</p></div>
                </div>
                <div className="benefit-row">{scenario.benefits.map((benefit) => <span key={benefit}>{benefit}</span>)}</div>
                <Link className="button dark full" href={`/contact-sales?reason=workflow&scenario=${encodeURIComponent(`${audience} / ${fn} / ${pain}`)}`}>Run this on a real workflow <span aria-hidden="true">↗</span></Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
