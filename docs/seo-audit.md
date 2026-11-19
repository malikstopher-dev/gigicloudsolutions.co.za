# SEO audit: South Africa and the Democratic Republic of the Congo

## Before and after

| Check | Live baseline, 19 November 2026 | Implemented and tested in the production build |
| --- | --- | --- |
| Host and redirects | The apex permanently redirected to `https://www.gigicloudsolutions.co.za/`; `/fr/contact` returned 308 to `/fr/contact/`. | Navigation, canonical URLs and sitemap use the preferred hostname and trailing slashes. Original paths remain reachable. |
| Crawlable pages | The homepage returned 200 with an empty React root. Primary text, links and headings required JavaScript. | React produces complete HTML for 70 pages (10 routes in seven languages), then hydrates it for language selection, media and forms. |
| Metadata | Separate static and client page descriptions; alternating URLs used paths that redirected. | One metadata registry; unique titles, descriptions and localized social snippets; reciprocal self-referencing language alternatives in both HTML and sitemap. English is the `x-default`. |
| Error pages | An unknown URL returned 404 on the production hostname. | The build includes a readable `404.html` with `noindex`, excluded from the sitemap. Confirm the HTTP status again on Cloudflare after release. Vite preview is not the production error handler. |
| Schema | An Organization record carrying the Johannesburg address. | Organization, WebSite and WebPage; service detail pages also have Service and BreadcrumbList matching visible breadcrumbs. No extra offices, rating markup or fabricated profiles. |
| Enquiries | WhatsApp handoff used `+27 73 168 0832`; delivery coverage focused on Johannesburg. | The existing handoff remains; the location prompt asks for suburb or city and country. The quote button activates on hydration; phone and email links work without JavaScript. |
| Mobile delivery | One Chromium mobile baseline transferred ~205 KB of JS and a ~56 KB portrait poster (encoded size, reduced motion). | Responsive preloads now follow the same image candidates as the hero; mobile/desktop tests verify that the opposite device image is not fetched. Variable-weight font requests replace discrete weight lists. Home HTML is ~72 KB raw/~11 KB gzip and now contains the full page. JS remains ~215 KB gzip; the bundle-size warning is still open. The local checks are not field Core Web Vitals or comparable live speed measurements. |

The `www` address was verified live and remains canonical. `.co.za` signals South Africa; it is not a DRC address. The new French coverage guide targets `fr-CD`, while the other French pages keep generic `fr`. There is no IP-based redirection or domain change.

## Market strategy and keyword-to-page map

South Africa: target local installation and quote intent around Johannesburg and nearby confirmed suburbs. A site assessment and coverage confirmation precede a quote. Avoid nationwide installation claims.

DRC: target enquiries from the **Democratic Republic of the Congo**, including Kinshasa and Lubumbashi as enquiry locations. Lead with website, design, cloud and backup discussions that can start remotely. Installation queries go to the coverage guide, where local delivery is expressly subject to confirmation. French service detail pages explain each service without claiming a Congolese office, installer or inventory.

| Market / language | Canonical path | Primary intent and supporting topics |
| --- | --- | --- |
| ZA / en-ZA | `/` · `/services/` | Security, IT and energy company in Johannesburg; browse all eleven capabilities. |
| ZA / en-ZA | `/services/security-access/` | CCTV installation and access control Johannesburg; alarm systems, electric fencing, surveillance coverage and assessment. |
| ZA / en-ZA | `/services/it-connectivity/` | Business networking and fibre Johannesburg; structured cabling, Wi-Fi and IT support. |
| ZA / en-ZA | `/services/electrical-solar/` | Electrical and solar services Johannesburg; inverters, batteries and load assessment. |
| ZA / en-ZA | `/services/cloud-solutions/` | Business cloud access, data backup and recovery planning. |
| ZA / en-ZA | `/services/web-graphic-design/` | Website design Johannesburg; business website and visual identity briefs. |
| ZA / en-ZA | `/service-areas/` · `/contact/` | Confirm suburb and scope; request a quote. |
| DRC / fr-CD | `/fr/service-areas/` | Projets en RDC; conditions for CCTV, contrôle d’accès, réseau informatique and installations solaires; remote versus on-site delivery. |
| DRC / fr | `/fr/services/web-graphic-design/` | Création de site web and graphisme; language, content and delivery requirements. |
| DRC / fr | `/fr/services/cloud-solutions/` | Sauvegarde de données d’entreprise; cloud access, restoration and security. |
| DRC / fr | `/fr/services/it-connectivity/` · `/fr/services/security-access/` · `/fr/services/electrical-solar/` | Service education for réseau informatique, vidéosurveillance, contrôle d’accès and solaire; refer actual installation enquiries to the coverage guide. |
| DRC / fr | `/fr/contact/` | Demander un devis; specify city, country, scope and whether in-person work is required. |

Research: [Vodacom RDC Business](https://www.vodacom.cd/fr/entreprise) illustrates a market distinction between enterprise connectivity and digital services; GIGI's copy does not imply it acts as a telecom carrier. [Google Search Central](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) informed the URL and targeting choices. Search-result pages returned a JavaScript interstitial, and attempted South African competitor pages could not be verified in this session. The map represents service-intent hypotheses, not volume, ranking or difficulty claims.

## 90-day plan

1. **Days 1–30:** Verify the domain property in Search Console using DNS, submit `https://www.gigicloudsolutions.co.za/sitemap.xml`, and inspect the English and French service URLs plus the coverage guide. Record index status, relevant queries and enquiry country. Confirm Johannesburg suburbs, DRC remote/on-site arrangements and the current WhatsApp line. Claim or update the Johannesburg Business Profile only if eligible and verified; hide the address if it is not staffed for customer visits. No DRC listing without an eligible, verified location.
2. **Days 31–60:** Publish a Johannesburg CCTV/site-assessment checklist and a French guide on preparing a business website or data-backup brief from the DRC. Link each article to the matching service and quote route. Have Congolese Francophone staff or a reviewer refine the French terminology.
3. **Days 61–90:** Review Search Console by country, query and landing URL. Use actual enquiry data to adjust links and copy. Expand DRC delivery pages only when staffing, support, travel and installation terms are confirmed; use approved case studies only. If analytics and consent are enabled later, track contact-click and WhatsApp-handoff events without form data. A handoff is not a completed quote; count actual received enquiries separately.

No Search Console, Business Profile or analytics account was available during implementation. Follow-up: verify the live deployment, test a real WhatsApp receipt with the business, and check field performance once enough data is available. No ranking or indexing is asserted.
