import Link from "next/link";

export default function NotFound() { return <main id="main" className="not-found"><div><p className="eyebrow light">404 · Signal not found</p><h1>One dot<br /><em>out of place.</em></h1><p>The page you requested is not part of this system.</p><Link className="button light" href="/">Return home</Link></div></main>; }
