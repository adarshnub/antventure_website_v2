import Image from "next/image";
import { clientLogos } from "@/lib/content";

export function ClientStrip() {
  return (
    <section className="client-strip" aria-label="Organizations that have worked with Ant Venture">
      <div className="shell client-row">
        <p>Trusted by teams<br />doing real work</p>
        <div className="logo-track">
          {clientLogos.map((logo) => <div className="client-logo" key={logo.name}><Image src={logo.src} alt={logo.name} width={120} height={42} /></div>)}
        </div>
      </div>
    </section>
  );
}
