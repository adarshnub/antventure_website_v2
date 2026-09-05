# Ant Venture — Collective Intelligence

Premium Next.js website for Ant Venture, centered on the “Collective Intelligence” brand concept and the ROLE:X flagship product.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Contact delivery

Copy `.env.example` to `.env.local` and set `CONTACT_WEBHOOK_URL` to the existing Ant Venture lead endpoint. The public `/api/contact` payload remains `{ name, email, mobile, website, message }`.

When the webhook is intentionally absent, submissions succeed only in development. Production returns a configuration error instead of silently losing leads.

## Verification

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

## Continuous galaxy experience

The shared layout uses one persistent WebGL canvas across all marketing and legal
pages. It stays mounted during client navigation. `src/lib/galaxy-renderer.ts`
contains the spiral, orbital ring, double helix, constellation morph targets,
cursor wake, comet trails, and scroll camera poses. Homepage section markers
(`data-galaxy-stop`) match the poses in document order; inner-page sections and
case studies are measured automatically. Styling is scoped to `.galaxy-site` in
`src/app/galaxy.css`.

- 30,000 galaxy points plus 1,200 background stars and 288 comet-tail points on
  desktop, in three draw calls. All morph targets are uploaded once to GPU buffers.
- 10,000 points plus 400 stars and 144 comet-tail points on small screens, data-saving connections, or devices
  reporting four or fewer logical processors; rendering is capped at 30 fps there.
- Desktop rendering targets 60 fps, caps pixel ratio at 2 (1.5 on mobile), and reduces resolution
  after sustained slow frames. These are rendering budgets, not benchmark results.
- Motion pauses while hidden or offscreen, and can be paused by the visitor.
  Reduced-motion users start with a still frame. A server-rendered SVG remains
  available during loading, without WebGL, or after context loss.
- No additional ambient, hero, or explorer WebGL contexts are created. GPU
  resources and event handlers are released when the shared backdrop unmounts.
  Route changes rebind the scene to the new page without restarting its animation.

`tests/e2e/galaxy.spec.ts` verifies rendering, shared canvas, chapter controls,
pause/resume, scroll explosion/reformation, persistent canvas across routes, and
reduced-motion/no-WebGL behavior. It also saves screenshots in
the ignored `test-results` directory for visual review.

## Legacy cinematic media

These tools are retained for future media work; their videos are not used by the homepage.

Generate new source films with the BytePlus ModelArk/Seedance API. The script securely prompts for the API key and does not save it:

```bash
powershell -NoProfile -File scripts/generate-ark-videos.ps1
powershell -NoProfile -File scripts/prepare-scroll-videos.ps1
```

The earlier homepage scroll film has its own generator:

```bash
powershell -NoProfile -File scripts/generate-hero-scroll-video.ps1
```

Both delivery formats use a six-frame GOP at 24 fps (a seek point every 0.25 seconds), no B-frames, and low-reference encoding for responsive scroll scrubbing. The generated posters are the reduced-motion and video-failure fallbacks.

## Launch checks

- Replace the interim Privacy and Terms copy with counsel-approved content.
- Verify customer logos, case-study status, testimonials and team images.
- Set `NEXT_PUBLIC_SITE_URL` and `CONTACT_WEBHOOK_URL` in production.
- Confirm redirects and DNS in a Vercel preview before moving `antventure.ai`.
