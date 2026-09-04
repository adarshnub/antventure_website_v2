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

## Cinematic media

Generate new source films with the BytePlus ModelArk/Seedance API. The script securely prompts for the API key and does not save it:

```bash
powershell -NoProfile -File scripts/generate-ark-videos.ps1
powershell -NoProfile -File scripts/prepare-scroll-videos.ps1
```

Both delivery formats use a six-frame GOP at 24 fps (a seek point every 0.25 seconds), no B-frames, and low-reference encoding for responsive scroll scrubbing. The generated posters are the reduced-motion and video-failure fallbacks.

## Launch checks

- Replace the interim Privacy and Terms copy with counsel-approved content.
- Verify customer logos, case-study status, testimonials and team images.
- Set `NEXT_PUBLIC_SITE_URL` and `CONTACT_WEBHOOK_URL` in production.
- Confirm redirects and DNS in a Vercel preview before moving `antventure.ai`.
