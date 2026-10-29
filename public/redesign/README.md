# U Channel redesign prototype

Clickable prototype of the brand-aligned redesign (homepage, Solutions, Locations).
Static files served as-is from `public/redesign/`, so on a Vercel preview it is at `/redesign/`.

- Grey crossed boxes (`assets/img/ph.svg`) are photo placeholders to swap for real photography.
- SEO: titles, descriptions, Open Graph and LocalBusiness data match the live site. Canonical tags point to the live URLs (/, /advertising-solutions/, /locations), so Google treats these as the redesign of those pages rather than duplicates; ranking moves over fully once the design replaces the live pages.
- GSAP 3.12.5, ScrollTrigger and Lenis 1.1.14 load from CDNs.
