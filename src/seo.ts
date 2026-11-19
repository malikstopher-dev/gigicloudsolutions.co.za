export const origin = 'https://www.gigicloudsolutions.co.za';

export const publicPages = [
  ['/', 'GIGI Cloud Solutions | Security, IT and Energy in Johannesburg', 'CCTV, access control, business networking, data backup, electrical, solar and design services. Based in Johannesburg, South Africa.', 'home'],
  ['/about', 'About Us | GIGI Cloud Solutions', 'Meet the Johannesburg team behind GIGI Cloud Solutions and learn how we assess, install and support security, IT and energy systems.', 'about'],
  ['/services', 'Security, IT, Solar and Design Services | GIGI Cloud Solutions', 'Explore all 11 GIGI Cloud Solutions offerings, from access control and CCTV to fibre, networking, solar, electrical and design services.', 'services'],
  ['/services/it-connectivity', 'Business Fibre and Networking Johannesburg | GIGI Cloud Solutions', 'Plan business fibre, structured cabling, Wi-Fi and IT support for your Johannesburg premises. Tell us about your site and network requirements.', 'it-connectivity'],
  ['/services/security-access', 'CCTV and Access Control Johannesburg | GIGI Cloud Solutions', 'Discuss CCTV installation, access control, alarm systems and electric fencing for your Johannesburg business or residential property.', 'enterprise-security'],
  ['/services/electrical-solar', 'Electrical and Solar Services Johannesburg | GIGI Cloud Solutions', 'Discuss electrical installations, solar, inverters and battery backup for your Johannesburg site. We assess your equipment, power needs and operating hours.', 'solar-energy'],
  ['/services/web-graphic-design', 'Website and Graphic Design Johannesburg | GIGI Cloud Solutions', 'Request a business website, visual identity or graphic design. Tell us about your audience, content, language requirements and launch plans.', 'web-graphic-design'],
  ['/services/cloud-solutions', 'Cloud Solutions and Data Backup | GIGI Cloud Solutions', 'Discuss secure cloud access, shared files, business data backup and recovery planning with GIGI Cloud Solutions in Johannesburg.', 'data-backup'],
  ['/contact', 'Contact and Request a Quote | GIGI Cloud Solutions', 'Send your project requirements and location to GIGI Cloud Solutions by WhatsApp, phone or email.', 'contact'],
  ['/service-areas', 'Johannesburg Service Area and DRC Enquiries | GIGI Cloud Solutions', 'Check on-site coverage in Johannesburg and learn how to enquire about remote services or site-dependent projects in the Democratic Republic of the Congo.', 'contact'],
] as const;

export const notFound = ['Page Not Found | GIGI Cloud Solutions', 'GIGI Cloud Solutions provides integrated security, IT and energy solutions in Johannesburg.'] as const;
export const lastMeaningfulUpdate: Readonly<Record<string, string>> = { '/service-areas': '2026-11-19' };

export function publicPath(locale: string, path: string) {
  const pathname = path.split(/[?#]/, 1)[0];
  const slug = pathname.replace(/\/$/, '');
  return `${locale === 'en' ? '' : `/${locale}`}${slug}/${path.slice(pathname.length)}`;
}

export function pageLanguage(locale: string, tag: string, path: string) {
  return locale === 'fr' && path === '/service-areas' ? 'fr-CD' : tag;
}
