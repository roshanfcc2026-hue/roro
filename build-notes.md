# Roshan Raj Kantaraja — creative and implementation notes

## Positioning

Architecture. Construction. Intelligence.

An architect and construction manager who connects spatial design with the planning, coordination, and resource decisions behind delivery. Sustainability and AI are forward directions; the site does not imply published AI research or deployed AI products.

Primary objective: make project-management work easy for employers and collaborators to assess and provide direct contact and resume access. Secondary objective: support academic and research conversations with a documented education, thesis, technical archive, and clearly identified research interests. Audiences include construction employers, architecture studios, collaborators, professors, and admissions committees.

The visitor journey is identity → flagship pre-construction work → professional interiors and supporting studies → perspective and research questions → biography, experience, education and tools → contact. Project details place responsibilities, methods, and source evidence together.

## Creative direction

An architectural systems atlas: charcoal and moss surfaces, warm orange annotation, large editorial typography, restrained technical captions, and the original project's images. The opening exploded frame is an original conceptual illustration, not a reconstruction of Nexus Terminal. Source footage underneath ties the hero to actual pre-construction documents.

Personality: precise (metadata and source captions), architectural (grid and drawing language), grounded (original deliverables), curious (research framed as questions), human (warm imagery and direct prose), forward-looking (motion and AI interests without unsupported claims).

Colors: background #141613; secondary/surface #1c1f1a; accent #ff713d; primary text #eeeee7; muted text #9b9f94; border #35382f; light research section #e1e2d8. Photography and renders retain their real source character; mild desaturation integrates them into the palette. No fabricated portrait, project renders, or awards.

Typography: Space Grotesk display/headings, DM Sans body, IBM Plex Mono technical captions, and Georgia italic editorial accents. Hero 65–139px desktop, 47–76px mobile; section headings approximately 42–85px; body 12–16px; technical captions 8–10px. Display tracking is deliberately tight, body line-height 1.6. Free Google web fonts have system fallbacks.

Layout: a flexible conceptual 12-column desktop grid with 5.3vw margins, two-column editorial spans, 30–50px gutters, and 80–105px section spacing. Tablet simplifies gutters and spacing. Mobile uses a single primary column, 6vw margins, 65px sections, independently composed hero and stacked case studies. Hairline borders separate information; whitespace carries hierarchy. Light/dark behavior is an intentional light research section inside a dark site, not an operating-system theme switch.

Components: compact navigation, outline pills, circular project links, full-width flagship, staggered supporting cards, compact archive rows, accessible native modal case studies with source-page galleries, accordions, timelines, direct email/LinkedIn and downloadable PDFs.

## Content and source decisions

Source: Roshan Raj Portfolio.pdf, 35 raster pages. Page images were extracted without changing their contents; cropped project imagery is used as imagery and complete pages remain available in galleries. Resume PDF consists of original pages 3–4, unchanged. The preferred name **Roshan Raj Kantaraja** follows the user's brief; the PDF uses **Kantharaja**. The download preserves the original spelling.

- Nexus Terminal, pp. 6–10: flagship pre-construction study; BIM/Navisworks coordination, P6 sequencing, Bluebeam takeoffs and RSMeans estimating. The source's 530-day programme and approximate activity count are study parameters. Different finish dates appear in the source, so no completion date is asserted.
- Miami Tower, pp. 11–15: proposed pre-construction study. Estimate staff names are illustrative; no staffing claims are repeated. A LEED assertion is not independently supported and is not amplified.
- Primavera P6 archive, pp. 16–21: schedule, resource, cost, risk and earned-value reporting. Date/status examples are treated as report content, not current live project progress.
- Multipurpose Sports Complex, pp. 23–26: architecture thesis, not a built commission. No external research statistics copied from its images are asserted in the site prose.
- Shinde Dental & Eye Care, pp. 28–30: professional healthcare design and coordination.
- Windmere Valley Resort, pp. 31–33: hospitality design, with corresponding resort documentation responsibilities in the resume. No environmental-performance claim.
- Motorcycle Service Facility, pp. 34–35: commercial design-build. Page 4 says 15 days ahead and page 35 says 10 days ahead; the narrative states only ahead of schedule.
- Education, tools, credentials, recognition, employment and community service: pp. 3–4. No GPA, publications, or new academic titles invented. Credential validity is described as listed in the supplied record, without independent verification.

No project-specific year, software, or organization is invented when absent from its pages. Academic interests are editorial positioning informed by the user's brief, not completed research claims. No portrait suitable for identity-consistent generation was found, so no person is generated. Phone and street address are not exposed in main site text; the original resume remains an unchanged download as requested.

## Motion and technical implementation

Static index.html, style.css, script.js and assets only. GSAP 3.12.5, ScrollTrigger and Lenis 1.1.20 load via CDN with working native fallbacks. Responsive CSS, hover feedback, hero parallax, gentle heading reveals, an animated conceptual axonometric, and four 10-second 1920×1080 WebM editorial sequences provide motion. Clips use supplied images with camera-like pans/zooms and transitions; they are **not Seedance-generated footage**. Seedance production prompts are supplied separately.

An IntersectionObserver selects only one sufficiently visible video; other videos pause. Clips load on demand, use posters, and stop when the document is hidden, a project modal opens, or motion is paused. Reduced-motion users see posters and stable layouts. Native scroll remains available with motion disabled. Horizontal scroll hijacking and animated vanity counters are intentionally omitted: the case studies and readable timelines serve this source material better.

Native dialog gives modal keyboard focus containment and Escape handling; visible focus, a skip link, descriptive source-image alt text, lazy galleries, and semantic headings support accessibility. Essential content is in HTML; case-study overlays require JavaScript. No backend, analytics, email form, build system, or framework. Open index.html directly or serve the directory over any static host. Internet connectivity improves fonts and motion libraries; core content, images, contact links, and source files remain local. The resume is an image-based original, so it does not have selectable/accessibility-tagged text.

Deployment-specific canonical URL and absolute Open Graph image URL should be set when a real public domain is known. No domain or deployment is invented.
