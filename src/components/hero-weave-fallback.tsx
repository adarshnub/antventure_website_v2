import { brainPoint, brainNormal } from "@/lib/brain-shape";

/** The same anatomical surface projected for no-JavaScript / no-WebGL visitors. */
export function HeroWeaveFallback() {
  const paths = Array.from({ length: 8 }, () => "");
  for (let i = 0; i < 6000; i++) {
    const [x,y,z] = brainPoint(i,6000);
    const normal = brainNormal(i,6000);
    if(normal[2]<0) continue;
    const light = Math.max(0,Math.min(7,Math.floor((normal[2]+normal[1]*.5)*5)));
    paths[light] += `M${(300+x*112-z*12).toFixed(1)} ${(320-y*112+z*9).toFixed(1)}h.5 `;
  }
  return <svg className="hero-weave-fallback" viewBox="0 0 600 700" aria-hidden="true">
    {paths.map((d,i)=><path key={i} d={d} fill="none" stroke="#67e9ed" strokeWidth="1.4" strokeLinecap="round" opacity={.2+i*.1}/>)}
  </svg>;
}
