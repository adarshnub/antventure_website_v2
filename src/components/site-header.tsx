"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { track } from "@vercel/analytics";
import { navItems } from "@/lib/content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header">
      <a className="skip-link" href="#main">Skip to main content</a>
      <div className="shell nav-shell">
        <Link className="brand-link" href="/" aria-label="Ant Venture home">
          <Image src="/brand/antventure-logo.png" alt="Ant Venture" width={200} height={75} priority />
        </Link>
        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <span className="menu-glyph" aria-hidden="true">{open ? "×" : "≡"}</span>
        </button>
        <nav id="primary-navigation" className={open ? "nav-links is-open" : "nav-links"} aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}</Link>
          ))}
          <a href="https://role-x.surge.sh/" target="_blank" rel="noreferrer" onClick={() => { setOpen(false); track("role_x_outbound", { placement: "navigation" }); }}>ROLE:X <span aria-hidden="true">↗</span></a>
          <Link className="nav-cta" href="/contact-sales" onClick={() => { setOpen(false); track("request_demo_clicked", { placement: "navigation" }); }}>Contact sales</Link>
        </nav>
      </div>
    </header>
  );
}
