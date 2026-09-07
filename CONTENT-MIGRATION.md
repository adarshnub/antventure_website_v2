# Content migration — September 2026

## Sources and destinations

- antventure.ai homepage and the supplied screenshots: six-product portfolio on `/` and `/products`; implementation services, five setup steps, customer segments and existing client logos retained.
- antventure.ai/interact and supplied screenshot: `/products/interact`, including channels, qualification, CRM handover, behaviour insights and product questions.
- Influence screenshot and homepage: `/products/influence`, including prospecting, contextual outreach, campaigns, engagement and lead handover. The detail URL could not be retrieved during research.
- Homepage In-House and Inspire descriptions: `/products/in-house` and `/products/inspire`. The old detail URLs could not be retrieved; no additional features were invented.
- antventure.ai/aibrain: `/products/organization-brain`, including public/private knowledge, six knowledge functions, setup and governance options.
- antventure.ai/academy and supplied screenshot: `/academy`, including four-hour/two-to-four-session format, six modules, instructor and booking links.
- ROLE:X existing product site: `/products/role-x`, flagship placement on the homepage and product directory; external product experience retained.
- Existing website footer project links: directory on `/work`. PDFX, Manimate, Opod and T-Shaped People descriptions reflect their linked public sites. Pashyanti and Managed Service use neutral descriptions pending fuller content confirmation.

Original product URLs redirect to the new detail pages. Navigation, footer and sitemap include the new routes. Product/training enquiry context passes through the existing contact form and API contract.

## Editorial handling

### Concept-note hero and flagship ordering

The homepage hero retains the concept-note headline and replaces the supporting paragraph with three input streams assembling into a side-view particle brain. The surface is sampled from BodyParts3D cortical, cerebellar and brainstem meshes, not a procedural sphere or mirrored outline. Nearby neural connections and travelling sparks are decorative; they do not represent measured neural activity. The same particles transition into the existing site and ROLE:X scenes. One renderer, four draw calls, reduced-motion support and a static SVG fallback remain. Source attribution is available through the footer at `/brain-attribution.txt`. `scripts/build-brain.mjs` reproducibly samples a pinned source revision into `src/lib/brain-points.json`; the full OBJ meshes stay in a temporary build cache and are not shipped. Visibility is baked for the lateral viewing angle, with intentionally limited cursor rotation. The supplied UT Southwestern image is a visual reference only and is not redistributed.

On the homepage and product directory, ROLE:X is introduced with its animated input/output diagram first. The other five products follow below. Duplicate standalone ROLE:X introduction cards and the later repeated homepage feature have been removed.

The new copy summarizes capabilities and workflows, rather than duplicating repeated marketing sections. Existing interactive galaxy and ROLE:X diagram remain. Product diagrams are labelled functional illustrations, not claims of live integrations or actual customer dashboard screenshots.

Do not publish the old site's template statistics, universal ROI figures, 20–30% conversion promise, 100X efficiency, free-plan promises or compliance certifications without supporting approval. Security and deployment are presented as requirements to agree during implementation, not blanket certifications.

Existing case-study statuses, team details and client logos were retained from the repository; stakeholder confirmation is still required before production. Academy instructor wording is condensed from the public source, without adding patent or performance claims. Detailed testimonials and unavailable source-page content require approved source text before further migration.
