# Website 1 — Roshan portfolio

From this folder, run `node preview.cjs` (Node.js 22+) and open http://127.0.0.1:4173. No package installation is needed to serve the website. Set PORT to use a different port.

All original HTML, styles, scripts, images, videos, PDFs, project data, screenshots and notes are preserved. Three.js is bundled in assets/vendor. GSAP 3.12.5, ScrollTrigger, Lenis 1.1.20 and Google Fonts retain their existing online URLs.

Optional historical browser checks: run `npm install`, then `node assets/check-header.cjs` from this folder. These checks use Microsoft Edge. The checks cover different past revisions, so not every historical selector necessarily exists in the current page. Alternatively, set PORTFOLIO_TEST_DEPS to an existing dependency directory containing node_modules/playwright.

The other website folders and the parent dependency cache are not needed to run this website.
