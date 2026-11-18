import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link as RouterLink,
  NavLink as RouterNavLink,
  type LinkProps,
  type NavLinkProps,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  Briefcase,
  Building2,
  Cable,
  Camera,
  Check,
  ChevronDown,
  CircuitBoard,
  Cloud,
  Database,
  Factory,
  Fingerprint,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  Layers,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Monitor,
  Network,
  Palette,
  Phone,
  Plus,
  Radio,
  Server,
  ShieldCheck,
  Sparkles,
  Store,
  Sun,
  Wifi,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  capabilities,
  capabilitiesByGroup,
  company,
  groupForCapability,
  industries,
  mission,
  processSteps,
  quoteLink,
  services,
  values,
  vision,
  whatsapp,
  type Capability,
  type HeroKey,
  type ServiceGroup,
} from "./data";
import HeroMedia, { heroDescriptions } from "./HeroMedia";
import "./enterprise.css";
import './cinema.css';
import { codes, localeTag, localPath, stripLocale, LanguageProvider, LanguageSelect, useLanguage } from './language';

function Link({to,...props}:LinkProps) {
  const {code}=useLanguage();
  return <RouterLink {...props} to={typeof to==='string' && to.startsWith('/') ? localPath(code,to) : to}/>;
}
function NavLink({to,...props}:NavLinkProps) {
  const {code}=useLanguage();
  return <RouterNavLink {...props} to={typeof to==='string' && to.startsWith('/') ? localPath(code,to) : to}/>;
}

const capabilityIcons: Record<string, LucideIcon> = {
  "access-control": Fingerprint,
  "cctv-surveillance": Camera,
  "fibre-solutions": Cable,
  "it-networking": Network,
  "alarm-systems": Radio,
  "electric-fencing": Zap,
  "electrical-installations": CircuitBoard,
  "solar-energy": Sun,
  "data-backup": Database,
  "web-design": Monitor,
  "graphic-design": Palette,
};

const groupIcons: Record<string, LucideIcon> = {
  "security-access": ShieldCheck,
  "it-connectivity": Network,
  "electrical-solar": Sun,
  "web-graphic-design": Palette,
  "cloud-solutions": Cloud,
};

const industryIcons: Record<string, LucideIcon> = {
  "Corporate offices": Building2,
  "Retail & hospitality": Store,
  "Industrial & logistics": Factory,
  "Education & institutions": GraduationCap,
  "Healthcare & professional services": HeartPulse,
  "Residential estates": Home,
};

const coreCapabilityIds = [
  "access-control",
  "cctv-surveillance",
  "fibre-solutions",
  "solar-energy",
  "data-backup",
  "electrical-installations",
];

const coreCapabilities = coreCapabilityIds.map(
  (id) => capabilities.find((capability) => capability.id === id)!,
);

function HeroStill({
  hero,
  className = "",
}: {
  hero: HeroKey;
  className?: string;
}) {
  return (
    <picture className={className}>
      <source
        media="(max-width: 767px)"
        srcSet={`/enterprise/heroes/hero-${hero}-mobile-720.webp`}
      />
      <img
        src={`/enterprise/heroes/hero-${hero}-desktop-1440.webp`}
        alt={heroDescriptions[hero]}
        width={1440}
        height={810}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

function ServiceImage({
  capability,
  className = "",
  eager = false,
}: {
  capability: Capability;
  className?: string;
  eager?: boolean;
}) {
  return (
    <picture className={className}>
      <source
        media="(max-width: 767px)"
        srcSet={`/enterprise/services/${capability.image}-mobile.webp`}
      />
      <img
        src={`/enterprise/services/${capability.image}-desktop.webp`}
        alt={capability.name}
        width={1440}
        height={900}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
      />
    </picture>
  );
}

function Action({
  to,
  children,
  variant = "primary",
  arrow = true,
  external = false,
}: {
  to: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "light" | "text" | "text-light";
  arrow?: boolean;
  external?: boolean;
}) {
  const { ui } = useLanguage();
  const content = (
    <>
      <span>{ui(children)}</span>
      {arrow && <ArrowUpRight size={17} aria-hidden="true" />}
    </>
  );
  if (to.startsWith('#') || to.startsWith('tel:')) return <a className={`gc-btn gc-btn--${variant}`} href={to}>{content}</a>;
  if (external) {
    return (
      <a
        className={`gc-btn gc-btn--${variant}`}
        href={to}
        target="_blank"
        rel="noreferrer"
      >
        {content}
      </a>
    );
  }
  return (
    <Link className={`gc-btn gc-btn--${variant}`} to={to}>
      {content}
    </Link>
  );
}

const mobileHeadlines: Partial<Record<HeroKey, string>> = {
  home: 'Secure. Connected.', about: 'Meet GIGI Cloud.', services: 'Explore our services.', contact: 'Let’s talk projects.',
  'enterprise-security': 'Secure your premises.', 'it-connectivity': 'Connect your workplace.', 'solar-energy': 'Power your business.',
  'web-graphic-design': 'Design with clarity.', 'data-backup': 'Keep your data close.',
};

function Hero({
  hero,
  kicker,
  title,
  lead,
  primary,
  secondary,
  chips,
}: {
  hero: HeroKey;
  kicker: string;
  title: string;
  lead: string;
  primary: { to: string; label: string };
  secondary?: { to: string; label: string };
  chips?: string[];
}) {
  return (
    <section className={`gc-hero gc-film-${hero}`}>
      <HeroMedia hero={hero} />
      <div className="gc-hero__shade" aria-hidden="true" />
      <div className="gc-hero__grid" aria-hidden="true" />
      <div className="gc-container gc-hero__inner">
        <div className="gc-hero__copy">
          <p className="gc-hero__kicker"><Words text={kicker}/></p>
          <h1><span className="gc-hero__title-wide"><Words text={title}/></span><span className="gc-hero__title-compact"><Words text={mobileHeadlines[hero] || title}/></span></h1>
          <p className="gc-hero__lead"><Words text={lead}/></p>
          <div className="gc-hero__actions">
            <Action to={primary.to}>{primary.label}</Action>
            {secondary && (
              <Action to={secondary.to} variant="ghost" arrow>
                {secondary.label}
              </Action>
            )}
          </div>
          {chips && chips.length > 0 && (
            <ul className="gc-hero__chips" aria-label="Service focus areas">
              {chips.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <span className="gc-hero__scroll" aria-hidden="true">
        GIGI / <Words text={kicker}/>
      </span>
    </section>
  );
}

function Words({text}: {text:string}) { return <>{useLanguage().t(text)}</>; }
function useWhatsApp() {
  const {t}=useLanguage();
  return whatsapp(t('Hi GIGI, I would like to discuss a project for my business or home.'));
}

function SectionHead({
  eyebrow,
  title,
  copy,
  dark = false,
  centered = false,
}: {
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  dark?: boolean;
  centered?: boolean;
}) {
  return (
    <header
      className={`gc-heading${dark ? " gc-heading--dark" : ""}${centered ? " gc-heading--centered" : ""} gc-reveal`}
    >
      <p className="gc-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {copy && <p className="gc-heading__copy">{copy}</p>}
    </header>
  );
}

function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const sync = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => window.removeEventListener("scroll", sync);
  }, []);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [stripLocale(location.pathname)]);

  useEffect(() => {
    document.body.classList.toggle("gc-menu-open", open);
    return () => document.body.classList.remove("gc-menu-open");
  }, [open]);

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  return (
    <header
      ref={header}
      className={`gc-header${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}
      onKeyDown={(event) => {
        if (open && event.key === 'Tab') {
          const items = [...event.currentTarget.querySelectorAll<HTMLElement>('a[href],button,select')].filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
          const edge = event.shiftKey ? items[0] : items.at(-1);
          if (document.activeElement === edge) { event.preventDefault(); (event.shiftKey ? items.at(-1) : items[0])?.focus(); }
        }
        if (event.key === "Escape") {
          setServicesOpen(false);
          setOpen(false);
          (
            header.current?.querySelector(".gc-menu-btn") as HTMLElement | null
          )?.focus();
        }
      }}
    >
      <div className="gc-container gc-header__inner">
        <Link className="gc-logo" to="/" aria-label="GIGI Cloud Solutions home">
          <img
            src="/brand/gigi-on-navy.webp"
            alt="GIGI Cloud Solutions"
            width={1983}
            height={793}
          />
        </Link>
        <nav className="gc-nav" aria-label="Main navigation">
          <NavLink to="/" end>
            <Words text="Home"/>
          </NavLink>
          <NavLink to="/about"><Words text="About"/></NavLink>
          <div className="gc-nav__group">
            <NavLink to="/services"><Words text="Services"/></NavLink>
            <button
              type="button"
              className="gc-nav__toggle"
              aria-label="Show service pages"
              aria-expanded={servicesOpen}
              aria-controls="service-menu"
              onClick={() => setServicesOpen(!servicesOpen)}
            >
              <ChevronDown size={15} />
            </button>
            <div
              id="service-menu"
              className={`gc-dropdown${servicesOpen ? " is-open" : ""}`}
            >
              <p><Words text="Service groups"/></p>
              {services.map((group) => {
                const Icon = groupIcons[group.slug] || Layers;
                return (
                  <Link
                    key={group.slug}
                    to={`/services/${group.slug}`}
                    onClick={() => setServicesOpen(false)}
                  >
                    <span className="gc-dropdown__icon">
                      <Icon size={17} />
                    </span>
                    <span>
                      <strong><Words text={group.name}/></strong>
                      <small>{group.short}</small>
                    </span>
                    <ArrowUpRight size={15} />
                  </Link>
                );
              })}
            </div>
          </div>
          <NavLink to="/contact"><Words text="Contact"/></NavLink>
          <LanguageSelect />
        </nav>
        <Link className="gc-header__cta" to="/contact">
          <Words text="Request a quote"/>
          <ArrowUpRight size={16} />
        </Link>
        <button
          type="button"
          className="gc-menu-btn"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <div
        id="mobile-navigation"
        className={`gc-mobile${open ? " is-open" : ""}`}
        aria-hidden={!open}
        inert={!open}
      >
        <nav className="gc-mobile__nav" aria-label="Mobile navigation">
          <NavLink to="/" end>
            <Words text="Home"/> <ArrowUpRight size={18} />
          </NavLink>
          <NavLink to="/about">
            <Words text="About"/> <ArrowUpRight size={18} />
          </NavLink>
          <NavLink to="/services">
            <Words text="All services"/> <ArrowUpRight size={18} />
          </NavLink>
          <LanguageSelect />
          <div className="gc-mobile__group">
            <p><Words text="Service groups"/></p>
            {services.map((group) => (
              <NavLink key={group.slug} to={`/services/${group.slug}`}>
                <Words text={group.name}/>
                <ArrowUpRight size={17} />
              </NavLink>
            ))}
          </div>
          <NavLink to="/contact">
            <Words text="Contact"/> <ArrowUpRight size={18} />
          </NavLink>
        </nav>
        <div className="gc-mobile__footer">
          <Action to={quoteLink()}>Request a quote</Action>
          <a href={`tel:${company.tel}`}>
            <Phone size={17} />
            {company.phone}
          </a>
          <a href={`mailto:${company.email}`}>
            <Mail size={17} />
            {company.email}
          </a>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  const chat = useWhatsApp();
  return (
    <footer className="gc-footer">
      <div className="gc-container gc-footer__top">
        <div className="gc-footer__brand">
          <Link to="/" aria-label="GIGI Cloud Solutions home">
            <img
              src="/brand/gigi-on-navy.webp"
              alt="GIGI Cloud Solutions"
              width={1983}
              height={793}
            />
          </Link>
          <p>
            Integrated security, access control, IT connectivity, energy and
            design solutions for businesses and residential estates.
          </p>
          <span className="gc-footer__reg">
            Registration {company.registration}
          </span>
          <a
            className="gc-footer__whatsapp"
            href={chat}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} />
            Message us on WhatsApp
            <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="gc-footer__col">
          <h3>Explore</h3>
          <Link to="/">Home</Link>
          <Link to="/about">About us</Link>
          <Link to="/services">All services</Link>
          <Link to="/contact">Request a quote</Link>
        </div>
        <div className="gc-footer__col">
          <h3>Service groups</h3>
          {services.map((group) => (
            <Link key={group.slug} to={`/services/${group.slug}`}>
              {group.name}
            </Link>
          ))}
        </div>
        <div className="gc-footer__col gc-footer__contact">
          <h3>Contact</h3>
          <a href={`tel:${company.tel}`}>
            <Phone size={15} />
            {company.phone}
          </a>
          <a href={`mailto:${company.email}`}>
            <Mail size={15} />
            {company.email}
          </a>
          <p>
            <MapPin size={15} />
            {company.address}
          </p>
          <span>Project enquiries in Johannesburg and surrounding areas.</span>
        </div>
      </div>
      <div className="gc-container gc-footer__bottom">
        <span>
          © {new Date().getFullYear()} {company.name}
        </span>
        <a href={company.url}>www.gigicloudsolutions.co.za</a>
        <span className="gc-footer__credit">
          Website by{" "}
          <a href="https://stopher-malik.co.za">Stopher Malik</a>
          {" / "}
          <a href="https://smk.stopher-malik.co.za">SMK Web Design</a>
        </span>
      </div>
    </footer>
  );
}

function CapabilityCard({
  capability,
  eager = false,
}: {
  capability: Capability;
  eager?: boolean;
}) {
  const {t}=useLanguage();
  const group = groupForCapability(capability.id);
  const Icon = capabilityIcons[capability.id] || Layers;
  if (!group) return null;
  return (
    <article className="gc-cap-card gc-reveal">
      <Link
        className="gc-cap-card__media"
        to={`/services/${group.slug}`}
        aria-label={`${t('View')}: ${t(group.name)}`}
      >
        <ServiceImage capability={capability} eager={eager} />
        <span className="gc-cap-card__icon">
          <Icon size={19} />
        </span>
        <span className="gc-cap-card__group">{group.name}</span>
      </Link>
      <div className="gc-cap-card__body">
          <h3><Words text={capability.name}/></h3>
        <p>{capability.summary}</p>
        <ul className="gc-cap-card__points">
          {capability.benefits.slice(0, 2).map((benefit) => (
            <li key={benefit}>
              <Check size={14} />
              {benefit}
            </li>
          ))}
        </ul>
        <div className="gc-cap-card__foot">
          <Action to={quoteLink(capability.name)} variant="text">
            Request a quote
          </Action>
          <Link
            className="gc-cap-card__arrow"
            to={`/services/${group.slug}`}
            aria-label={`${t('Explore')} ${t(group.name)}`}
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function GroupCard({ group }: { group: ServiceGroup }) {
  const Icon = groupIcons[group.slug] || Layers;
  const groupCaps = capabilitiesByGroup(group);
  return (
    <article className="gc-group-card gc-reveal">
      <Link to={`/services/${group.slug}`}>
        <div className="gc-group-card__media">
          <HeroStill hero={group.hero} />
          <span className="gc-group-card__number">{group.short}</span>
          <span className="gc-group-card__icon">
            <Icon size={20} />
          </span>
        </div>
        <div className="gc-group-card__body">
          <p className="gc-eyebrow">{group.label}</p>
          <h3><Words text={group.name}/></h3>
          <p>{group.description}</p>
          <ul>
            {groupCaps.slice(0, 4).map((capability) => (
              <li key={capability.id}>{capability.name}</li>
            ))}
          </ul>
          <span className="gc-group-card__link">
            Explore {group.name}
            <ArrowUpRight size={17} />
          </span>
        </div>
      </Link>
    </article>
  );
}

function FeatureBand({
  group,
  capabilityId,
  insetId,
  reverse = false,
}: {
  group: ServiceGroup;
  capabilityId: string;
  insetId: string;
  reverse?: boolean;
}) {
  const capability = capabilities.find((item) => item.id === capabilityId)!;
  const inset = capabilities.find((item) => item.id === insetId)!;
  return (
    <section
      className={`gc-section gc-feature-band${reverse ? " is-reverse" : ""}`}
    >
      <div className="gc-container gc-feature-band__inner">
        <div className="gc-feature-band__media gc-reveal">
          <div className="gc-feature-band__frame">
            <ServiceImage capability={capability} />
          </div>
          <div className="gc-feature-band__inset">
            <ServiceImage capability={inset} />
          </div>
          <span className="gc-feature-band__tag">{group.short}</span>
        </div>
        <div className="gc-feature-band__copy gc-reveal">
          <p className="gc-eyebrow">{group.label}</p>
          <h2>{group.intro}</h2>
          <p>{group.description}</p>
          <ul className="gc-check-list">
            {group.outcomes.map((outcome) => (
              <li key={outcome}>
                <Check size={16} />
                {outcome}
              </li>
            ))}
          </ul>
          <div className="gc-feature-band__actions">
            <Action to={`/services/${group.slug}`} variant="primary">
              Explore {group.name}
            </Action>
            <Action to={quoteLink(group.name)} variant="text">
              Request a quote
            </Action>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionVision() {
  return (
    <div className="gc-mv">
      <article className="gc-mv__panel gc-mv__panel--mission gc-reveal">
        <div className="gc-mv__top">
          <p className="gc-eyebrow">Our mission</p>
          <ShieldCheck size={26} aria-hidden="true" />
        </div>
        <p className="gc-mv__lead">{mission.intro}</p>
        <p>{mission.body}</p>
        <p className="gc-mv__closing">{mission.closing}</p>
      </article>
      <article className="gc-mv__panel gc-mv__panel--vision gc-reveal">
        <div className="gc-mv__top">
          <p className="gc-eyebrow">Our vision</p>
          <Sparkles size={26} aria-hidden="true" />
        </div>
        <p className="gc-mv__lead">{vision.intro}</p>
        <p>{vision.body}</p>
        <p className="gc-mv__closing">{vision.closing}</p>
      </article>
    </div>
  );
}

function ValuesGrid({ dark = false }: { dark?: boolean }) {
  const icons = [Layers, ShieldCheck, MessageCircle, Wifi];
  return (
    <div className={`gc-values${dark ? " gc-values--dark" : ""}`}>
      {values.map((value, index) => {
        const Icon = icons[index] || Layers;
        return (
          <article className="gc-value gc-reveal" key={value.title}>
            <span className="gc-value__icon">
              <Icon size={20} />
            </span>
            <small>0{index + 1}</small>
            <h3>{value.title}</h3>
            <p>{value.text}</p>
          </article>
        );
      })}
    </div>
  );
}

function Industries() {
  return (
    <div className="gc-industries">
      {industries.map((industry) => {
        const Icon = industryIcons[industry.name] || Briefcase;
        return (
          <article className="gc-industry gc-reveal" key={industry.name}>
            <span className="gc-industry__icon">
              <Icon size={21} />
            </span>
            <h3>{industry.name}</h3>
            <p>{industry.text}</p>
          </article>
        );
      })}
    </div>
  );
}

function ProcessSection() {
  return (
    <section className="gc-section gc-section--soft">
      <div className="gc-container">
        <SectionHead
          eyebrow="How it works"
          title="A clear path from requirement to installation."
          copy="Start with the outcome you need. We will discuss the site, the existing systems and the scope before preparing a quotation."
        />
        <div className="gc-process">
          {processSteps.map((step, index) => (
            <article className="gc-process__step gc-reveal" key={step.title}>
              <span>0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="gc-cta">
      <HeroStill hero="contact" className="gc-cta__media" />
      <div className="gc-cta__shade" aria-hidden="true" />
      <div className="gc-container gc-cta__inner">
        <div className="gc-reveal">
          <p className="gc-eyebrow">Start a project</p>
          <h2>Tell us what you need to secure, connect or power.</h2>
          <p>
            Share your location, the type of premises and what you want to
            change. We will discuss the requirements and the information needed
            to prepare a quotation.
          </p>
        </div>
        <div className="gc-cta__actions gc-reveal">
          <Action to="/contact" variant="light">
            Discuss your project
          </Action>
          <a href={`tel:${company.tel}`}>
            <Phone size={17} />
            {company.phone}
          </a>
          <a href={whatsapp()} target="_blank" rel="noreferrer">
            <MessageCircle size={17} />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <Hero
        hero="home"
        kicker="GIGI / Johannesburg"
        title="Smart security. Seamless connectivity."
        lead="Security, networks and energy for the places you work."
        primary={{ to: "/services", label: "Explore our solutions" }}
        secondary={{ to: "/contact", label: "Discuss your project" }}
      />

      <section className="gc-strip" aria-label="Company focus areas">
        <div className="gc-container gc-strip__inner">
          {[
            [ShieldCheck, "Security and access"],
            [Network, "IT and connectivity"],
            [Sun, "Electrical and solar"],
            [Palette, "Web and graphic design"],
          ].map(([Icon, label]) => {
            const IconComponent = Icon as LucideIcon;
            return (
              <div key={label as string} className="gc-strip__item">
                <IconComponent size={19} />
                <span><Words text={label as string}/></span>
              </div>
            );
          })}
          <div className="gc-strip__item gc-strip__item--wide">
            <span>One integrated brief for your premises</span>
            <ArrowRight size={18} />
          </div>
        </div>
      </section>

      <section className="gc-section">
        <div className="gc-container">
          <SectionHead
            eyebrow="Enterprise capabilities"
            title="One partner for the systems your business depends on."
            copy="GIGI Cloud Solutions plans, installs and supports the technology that protects people, connects teams and keeps operations running."
          />
          <div className="gc-cap-grid">
            {coreCapabilities.map((capability, index) => (
              <CapabilityCard
                capability={capability}
                eager={index === 0}
                key={capability.id}
              />
            ))}
          </div>
          <div className="gc-section-foot">
            <Action to="/services" variant="text">
              View all 11 service offerings
            </Action>
          </div>
        </div>
      </section>

      <section className="gc-section gc-section--navy gc-intro-band">
        <div className="gc-container gc-intro-band__inner">
          <div className="gc-intro-band__copy gc-reveal">
            <p className="gc-eyebrow">Built around your operation</p>
            <h2>Corporate capability, with the care of a local partner.</h2>
            <p>
              Commercial buildings, campuses, warehouses and residential
              estates depend on several systems working together. We bring
              security, connectivity, energy and design into one conversation
              so responsibilities are clear and the installation supports the
              way your premises actually operates.
            </p>
            <div className="gc-intro-band__facts">
              <div>
                <Building2 size={20} />
                <span>
                  <strong>Commercial first</strong>
                  Corporate, industrial and institutional environments
                </span>
              </div>
              <div>
                <MapPin size={20} />
                <span>
                  <strong>Johannesburg based</strong>
                  Projects discussed across Johannesburg and surrounds
                </span>
              </div>
              <div>
                <Layers size={20} />
                <span>
                  <strong>Integrated planning</strong>
                  Security, network and energy considered together
                </span>
              </div>
            </div>
            <Action to="/about" variant="text-light">
              About GIGI Cloud Solutions
            </Action>
          </div>
          <div className="gc-intro-band__visual gc-reveal">
            <div className="gc-intro-band__screen">
              <HeroStill hero="enterprise-security" />
            </div>
            <div className="gc-intro-band__panel">
              <Server size={22} />
              <div>
                <small>System view</small>
                <strong>One coordinated environment</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeatureBand
        group={services[0]}
        capabilityId="cctv-surveillance"
        insetId="access-control"
      />
      <FeatureBand
        group={services[1]}
        capabilityId="it-networking"
        insetId="fibre-solutions"
        reverse
      />
      <FeatureBand
        group={services[2]}
        capabilityId="solar-energy"
        insetId="electrical-installations"
      />

      <section className="gc-section gc-section--navy">
        <div className="gc-container">
          <SectionHead
            dark
            eyebrow="Why GIGI Cloud Solutions"
            title="Practical systems. Clear communication. Long-term support."
            copy="Our approach is built around the realities of running a property: reliable equipment, sensible scope and a partner who remains available after installation."
          />
          <ValuesGrid dark />
        </div>
      </section>

      <section className="gc-section">
        <div className="gc-container">
          <SectionHead
            eyebrow="Our mission and vision"
            title="Your security is our priority. Your connectivity is our commitment."
            copy="The full statements that guide how we plan, install and support every solution."
          />
          <MissionVision />
        </div>
      </section>

      <section className="gc-section gc-section--soft">
        <div className="gc-container">
          <SectionHead
            eyebrow="Who we serve"
            title="Technology for commercial operations and modern residential estates."
            copy="Our primary focus is business and commercial infrastructure. Residential estates and homes remain part of the business and are supported with the same planning discipline."
          />
          <Industries />
        </div>
      </section>

      <ProcessSection />
      <ClosingCta />
    </>
  );
}

function AboutPage() {
  return (
    <>
      <Hero
        hero="about"
        kicker="About"
        title="Meet GIGI Cloud Solutions."
        lead="A Johannesburg team connecting technology to the needs of your premises."
        primary={{ to: "/contact", label: "Discuss your requirements" }}
        secondary={{ to: "/services", label: "Explore our capabilities" }}
      />

      <section className="gc-section">
        <div className="gc-container gc-story">
          <div className="gc-story__copy gc-reveal">
            <p className="gc-eyebrow">Who we are</p>
            <h2>One conversation for the systems that keep your premises working.</h2>
            <p>
              GIGI Cloud Solutions works with commercial, institutional and
              residential customers who need dependable security, connectivity
              and energy infrastructure. Our services cover access control,
              surveillance, alarms, electric fencing, fibre, networking, data
              backup, electrical installations, solar systems and design.
            </p>
            <p>
              We begin by understanding the site, the people who use it and the
              outcome you want to achieve. From there, we discuss the equipment,
              coverage and installation requirements, then set out a clear scope
              before quoting.
            </p>
            <div className="gc-story__actions">
              <Action to="/contact">Start a conversation</Action>
              <Action to="/services" variant="text">
                View all services
              </Action>
            </div>
          </div>
          <div className="gc-story__media gc-reveal">
            <HeroStill hero="services" />
            <div className="gc-story__badge">
              <ShieldCheck size={20} />
              <div>
                <strong>Integrated by design</strong>
                <span>Security, connectivity and energy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gc-section gc-section--soft">
        <div className="gc-container">
          <SectionHead
            eyebrow="Our mission and vision"
            title="A clear purpose for every installation."
            copy="These are the complete statements supplied by GIGI Cloud Solutions."
          />
          <MissionVision />
        </div>
      </section>

      <section className="gc-section">
        <div className="gc-container">
          <SectionHead
            eyebrow="What we do"
            title="Eleven service offerings, planned as one environment."
            copy="Each service can be requested on its own. When several systems are involved, we consider how they should work together."
          />
          <div className="gc-cap-grid gc-cap-grid--compact">
            {capabilities.map((capability) => (
              <CapabilityCard capability={capability} key={capability.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="gc-section gc-section--navy">
        <div className="gc-container">
          <SectionHead
            dark
            eyebrow="Who we serve"
            title="Commercial capability, with residential expertise."
            copy="The systems differ by site, but the principles remain the same: understand the environment, plan the layers and support the installation."
          />
          <div className="gc-segments">
            <article className="gc-segment gc-reveal">
              <span>
                <Building2 size={22} />
              </span>
              <p className="gc-eyebrow">Business and commercial</p>
              <h3>Offices, retail, industrial and institutional sites</h3>
              <p>
                Controlled access for staff and visitors, camera coverage over
                entrances and movement routes, structured network
                infrastructure, backup power and electrical systems planned
                around operating hours.
              </p>
              <ul className="gc-check-list">
                <li>
                  <Check size={15} /> Commercial security and surveillance
                </li>
                <li>
                  <Check size={15} /> Fibre, networking and data backup
                </li>
                <li>
                  <Check size={15} /> Electrical, solar and backup power
                </li>
              </ul>
              <Action to={quoteLink("Multiple services / Not sure yet")} variant="text-light">
                Discuss a commercial project
              </Action>
            </article>
            <article className="gc-segment gc-reveal">
              <span>
                <Home size={22} />
              </span>
              <p className="gc-eyebrow">Residential estates and homes</p>
              <h3>Practical systems for modern residential properties</h3>
              <p>
                Entry control, cameras, alarms and perimeter protection can be
                planned alongside connectivity, backup power and solar. We
                discuss the household routine and the areas that matter most.
              </p>
              <ul className="gc-check-list">
                <li>
                  <Check size={15} /> Access control and intercoms
                </li>
                <li>
                  <Check size={15} /> CCTV, alarms and electric fencing
                </li>
                <li>
                  <Check size={15} /> Home networking, solar and backup power
                </li>
              </ul>
              <Action to={quoteLink("Multiple services / Not sure yet")} variant="text-light">
                Discuss a residential project
              </Action>
            </article>
          </div>
        </div>
      </section>

      <section className="gc-section">
        <div className="gc-container">
          <SectionHead
            eyebrow="Our approach"
            title="The values behind the work."
            copy="We keep the scope practical, the communication clear and the installation maintainable."
          />
          <ValuesGrid />
        </div>
      </section>

      <section className="gc-section gc-section--soft">
        <div className="gc-container gc-company">
          <div className="gc-reveal">
            <p className="gc-eyebrow">Company details</p>
            <h2>Registered, contactable and accountable.</h2>
            <p>
              GIGI Cloud Solutions is a registered South African company based
              in Kensington, Johannesburg. Project enquiries are handled
              directly by our team.
            </p>
          </div>
          <dl className="gc-company__list gc-reveal">
            <div>
              <dt>Company</dt>
              <dd>{company.name}</dd>
            </div>
            <div>
              <dt>Registration</dt>
              <dd>{company.registration}</dd>
            </div>
            <div>
              <dt>Contact address</dt>
              <dd>{company.address}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </dd>
            </div>
            <div>
              <dt>Telephone</dt>
              <dd>
                <a href={`tel:${company.tel}`}>{company.phone}</a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <ProcessSection />
      <ClosingCta />
    </>
  );
}

function ServicesPage() {
  return (
    <>
      <Hero
        hero="services"
        kicker="Services"
        title="Eleven services. One team."
        lead="Find the right combination for your site."
        primary={{ to: "#capabilities", label: "Browse capabilities" }}
        secondary={{ to: "/contact", label: "Discuss your project" }}
      />

      <section className="gc-section">
        <div className="gc-container">
          <SectionHead
            eyebrow="Service groups"
            title="Five connected disciplines."
            copy="Start with the area closest to your requirement. Each group brings related services together with practical planning detail."
          />
          <div className="gc-group-grid">
            {services.map((group) => (
              <GroupCard group={group} key={group.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="gc-section gc-section--soft" id="capabilities">
        <div className="gc-container">
          <SectionHead
            eyebrow="All service offerings"
            title="Eleven capabilities. One accountable team."
            copy="Every card includes a direct enquiry link so you can ask about a specific service without searching for a form."
          />
          <div className="gc-cap-grid">
            {capabilities.map((capability) => (
              <CapabilityCard capability={capability} key={capability.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="gc-section">
        <div className="gc-container">
          <SectionHead
            eyebrow="Planning a combined project"
            title="Several services can share one brief."
            copy="A new office may need access control, cameras, networking, backup power and a website. We can discuss the sequence, dependencies and scope in one conversation."
          />
          <div className="gc-advice">
            <article className="gc-advice__item gc-reveal">
              <span>
                <Fingerprint size={21} />
              </span>
              <h3>Start with access and movement</h3>
              <p>
                Map entrances, visitor routes and restricted areas before
                choosing readers, cameras or alarms.
              </p>
            </article>
            <article className="gc-advice__item gc-reveal">
              <span>
                <Network size={21} />
              </span>
              <h3>Plan the network foundation</h3>
              <p>
                Cameras, access readers and office systems depend on structured
                connectivity. Plan it early.
              </p>
            </article>
            <article className="gc-advice__item gc-reveal">
              <span>
                <BatteryCharging size={21} />
              </span>
              <h3>Protect essential operations</h3>
              <p>
                Identify the loads and systems that must remain available during
                an outage before sizing solar or backup power.
              </p>
            </article>
            <article className="gc-advice__item gc-reveal">
              <span>
                <Palette size={21} />
              </span>
              <h3>Present the business clearly</h3>
              <p>
                Website and brand material should explain the services and make
                the enquiry path obvious.
              </p>
            </article>
          </div>
        </div>
      </section>

      <ProcessSection />
      <ClosingCta />
    </>
  );
}

const filmCopy: Record<string,[string,string]> = {
  'security-access':['Control access. Protect your site.','Access control, cameras, alarms and perimeter protection.'],
  'it-connectivity':['Connect every workspace.','Fibre and Wi-Fi built around your premises.'],
  'electrical-solar':['Power your operations.','Electrical installations, solar power and battery storage.'],
  'web-graphic-design':['Design with clarity.','Websites and visual identities for your business.'],
  'cloud-solutions':['Keep your data within reach.','Shared files, backups and recovery for your team.'],
};
function ServicePage({ index }: { index: number }) {
  const {t}=useLanguage();
  const group = services[index];
  const groupCapabilities = capabilitiesByGroup(group);
  const Icon = groupIcons[group.slug] || Layers;
  return (
    <>
      <Hero
        hero={group.hero}
        kicker={group.name}
        title={filmCopy[group.slug][0]}
        lead={filmCopy[group.slug][1]}
        primary={{ to: quoteLink(group.name), label: "Discuss your project" }}
        secondary={{ to: "#capabilities", label: "View capabilities" }}
      />

      <section className="gc-section">
        <div className="gc-container gc-overview">
          <div className="gc-overview__copy gc-reveal">
            <p className="gc-eyebrow">{group.name}</p>
            <h2>Planned around the site, the users and the work that must continue.</h2>
            <p>{group.description}</p>
            <ul className="gc-check-list">
              {group.outcomes.map((outcome) => (
                <li key={outcome}>
                  <Check size={16} />
                  {outcome}
                </li>
              ))}
            </ul>
             <Action to={quoteLink(group.name)}>Request a quote</Action>
          </div>
          <div className="gc-overview__panel gc-reveal">
            <div className="gc-overview__icon">
              <Icon size={28} />
            </div>
            <p className="gc-eyebrow">Designed for</p>
            <ul>
              {group.applications.map((application) => (
                <li key={application}>
                  <ArrowRight size={15} />
                  {application}
                </li>
              ))}
            </ul>
            <div className="gc-overview__meta">
              <strong>{groupCapabilities.length} related capabilities</strong>
              <span>Commercial and residential enquiries</span>
            </div>
          </div>
        </div>
      </section>

      <section className="gc-section gc-section--soft" id="capabilities">
        <div className="gc-container">
          <SectionHead
            eyebrow="Capabilities"
            title="What this service group includes."
            copy="Each capability can be discussed separately or as part of a larger scope."
          />
          <div className="gc-cap-grid">
            {groupCapabilities.map((capability) => (
              <CapabilityCard capability={capability} key={capability.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="gc-section">
        <div className="gc-container gc-request">
          <div className="gc-request__head gc-reveal">
            <p className="gc-eyebrow">What you can request</p>
            <h2>Scope the work around your actual requirement.</h2>
            <p>
              These are the practical areas we discuss. The final scope depends
              on the site, existing equipment and the outcome you need.
            </p>
          </div>
          <ol className="gc-request__list">
            {group.items.map((item, itemIndex) => (
              <li key={item} className="gc-reveal">
                <span>0{itemIndex + 1}</span>
                <div>
                  <h3>{item}</h3>
                  <p>{group.details[itemIndex]}</p>
                </div>
                <Link
                  to={quoteLink(item)}
                   aria-label={`${t('Enquire about')}: ${t(item)}`}
                  className="gc-request__link"
                >
                  <ArrowUpRight size={19} />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="gc-section gc-section--navy">
        <div className="gc-container gc-approach">
          <SectionHead
            dark
            eyebrow="Our approach"
            title="From first conversation to a supported installation."
            copy="The sequence keeps the scope clear and the installation coordinated with the rest of your premises."
          />
          <div className="gc-approach__grid">
            {group.approach.map((step, stepIndex) => (
              <article className="gc-approach__step gc-reveal" key={step.title}>
                <span>0{stepIndex + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gc-section">
        <div className="gc-container gc-example">
          <div className="gc-example__copy gc-reveal">
            <p className="gc-eyebrow">A practical example</p>
            <h2>{group.exampleTitle}</h2>
            <p>{group.example}</p>
            <Action to={quoteLink(group.name)}>Discuss a similar requirement</Action>
          </div>
          <div className="gc-example__media gc-reveal">
            <ServiceImage capability={groupCapabilities[0]} />
            <div className="gc-example__note">
              <span>Example application</span>
              <p>{group.exampleTitle}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="gc-section gc-section--soft">
        <div className="gc-container gc-quote-info">
          <div className="gc-quote-info__copy gc-reveal">
            <p className="gc-eyebrow">Requesting a quotation</p>
            <h2>What to send.</h2>
            <p>
              You do not need a complete specification. Start with the details
              you have and we will discuss anything else needed to define the
              scope.
            </p>
            <Action to={quoteLink(group.name)}>Start your enquiry</Action>
          </div>
          <ul className="gc-quote-info__list gc-reveal">
            {group.quoteInfo.map((item) => (
              <li key={item}>
                <Check size={17} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqSection entries={group.faq} />

      <section className="gc-section gc-related">
        <div className="gc-container">
          <SectionHead
            eyebrow="Related services"
            title="Explore another service group."
          />
          <div className="gc-related__grid">
            {services
              .filter((item) => item.slug !== group.slug)
              .map((item) => {
                const RelatedIcon = groupIcons[item.slug] || Layers;
                return (
                  <Link
                    className="gc-related__card gc-reveal"
                    to={`/services/${item.slug}`}
                    key={item.slug}
                  >
                    <span>
                      <RelatedIcon size={20} />
                    </span>
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.intro}</p>
                    </div>
                    <ArrowUpRight size={18} />
                  </Link>
                );
              })}
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}

function FaqSection({ entries }: { entries: [string, string][] }) {
  return (
    <section className="gc-section">
      <div className="gc-container gc-faq">
        <div className="gc-faq__head gc-reveal">
          <p className="gc-eyebrow">Common questions</p>
          <h2>Useful context before you enquire.</h2>
          <p>
            If your question is not covered here, include it in the enquiry and
            we will discuss it with you.
          </p>
        </div>
        <div className="gc-faq__list gc-reveal">
          {entries.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactPage() {
  const { t } = useLanguage();
  const chat = useWhatsApp();
  const [params] = useSearchParams();
  const preset = params.get("service") || "";
  const [feedback, setFeedback] = useState("");
  const [enquiry, setEnquiry] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fields = ["name", "email", "phone", "service", "location", "message"];
    if (fields.some((field) => !String(data.get(field) || "").trim())) {
      setFeedback("Please complete all fields with your project details.");
      return;
    }
    const text = [t('Hi GIGI, I would like to request a quotation.'), '',
      `${t('Name')}: ${data.get('name')}`, `${t('Email')}: ${data.get('email')}`,
      `${t('Phone')}: ${data.get('phone')}`, `${t('Service')}: ${t(String(data.get('service')))}`,
      `${t('Project location')}: ${data.get('location')}`, '', `${t('Project details')}:`, data.get('message')].join('\n');
    window.open(whatsapp(text), "_blank", "noopener,noreferrer");
    setFeedback(
      "Your enquiry is ready to send in WhatsApp. Please review it and press Send there. If WhatsApp did not open, use the link below.",
    );
    setEnquiry(whatsapp(text));
  }

  return (
    <>
      <Hero
        hero="contact"
        kicker="Contact"
        title="Plan your next project."
        lead="Tell us what your premises need and where the work will take place."
        primary={{ to: "#enquiry", label: "Start your enquiry" }}
        secondary={{ to: `tel:${company.tel}`, label: company.phone }}
      />

      <section className="gc-section">
        <div className="gc-container gc-contact">
          <aside className="gc-contact__aside gc-reveal">
            <p className="gc-eyebrow">Direct contact</p>
            <h2>Speak to the team.</h2>
            <p>
              Project enquiries are handled directly. Include the location, the
              type of premises and a short description of the work you need.
            </p>
            <div className="gc-contact__methods">
              <a href={`tel:${company.tel}`} className="gc-contact__method">
                <span>
                  <Phone size={19} />
                </span>
                <div>
                  <small>Telephone</small>
                  <strong>{company.phone}</strong>
                </div>
                <ArrowUpRight size={16} />
              </a>
              <a
                href={`mailto:${company.email}`}
                className="gc-contact__method"
              >
                <span>
                  <Mail size={19} />
                </span>
                <div>
                  <small>Email</small>
                  <strong>{company.email}</strong>
                </div>
                <ArrowUpRight size={16} />
              </a>
              <a
                 href={chat}
                target="_blank"
                rel="noreferrer"
                className="gc-contact__method"
              >
                <span>
                  <MessageCircle size={19} />
                </span>
                <div>
                  <small>WhatsApp</small>
                  <strong>Message GIGI</strong>
                </div>
                <ArrowUpRight size={16} />
              </a>
              <div className="gc-contact__method gc-contact__method--static">
                <span>
                  <MapPin size={19} />
                </span>
                <div>
                  <small>Contact address</small>
                  <strong>{company.address}</strong>
                </div>
              </div>
            </div>
            <div className="gc-contact__meta">
              <div>
                <Landmark size={17} />
                <span>
                  <small>Registration</small>
                  {company.registration}
                </span>
              </div>
              <div>
                <Building2 size={17} />
                <span>
                  <small>Service area</small>
                  Johannesburg and surrounding areas
                </span>
              </div>
            </div>
            <p className="gc-contact__note">
              Please do not send passwords, access codes or sensitive account
              details in an enquiry.
            </p>
          </aside>

          <form id="enquiry" className="gc-form gc-reveal" onInvalid={() => setFeedback('Please check the highlighted fields before continuing.')} onSubmit={submit}>
            <div className="gc-form__head">
              <p className="gc-eyebrow">Project enquiry</p>
              <h2>Your project details.</h2>
              <p>
                All fields are required. You can review the message before
                sending it in WhatsApp.
              </p>
            </div>
            <div className="gc-form__grid">
              <label>
                {t('Full name')}
                <input
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  required
                  maxLength={120}
                />
              </label>
              <label>
                {t('Email address')}
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.co.za"
                  required
                  maxLength={200}
                />
              </label>
              <label>
                {t('Phone number')}
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="e.g. 073 168 0832"
                  pattern={String.raw`[+0-9 \(\)\-]{7,25}`}
                  title="Enter a phone number with 7 to 25 digits, spaces, brackets or a plus sign."
                  required
                />
              </label>
              <label>
                {t('Service of interest')}
                <select
                  name="service"
                  defaultValue={
                    preset === 'Multiple services / Not sure yet' ||
                    services.some((group) => group.name === preset) ||
                    capabilities.some((capability) => capability.name === preset)
                      ? preset
                      : ""
                  }
                  required
                >
                  <option value="" disabled>
                    {t('Select a service')}
                  </option>
                  {services.map((group) => (
                    <option key={group.slug} value={group.name}>{t(group.name)}</option>
                  ))}
                  {capabilities.map((capability) => (
                    <option key={capability.id} value={capability.name}>{t(capability.name)}</option>
                  ))}
                  <option value="Multiple services / Not sure yet">Multiple services / Not sure yet</option>
                </select>
              </label>
              <label className="gc-form__full">
                {t('Project location')}
                <input
                  name="location"
                  autoComplete="address-level2"
                  placeholder="Suburb or city"
                  required
                  maxLength={200}
                />
              </label>
              <label className="gc-form__full">
                {t('What do you have in mind?')}
                <textarea
                  name="message"
                  placeholder="Describe the work, your current setup and any timing requirements."
                  rows={5}
                  required
                  maxLength={3000}
                />
              </label>
            </div>
            <button type="submit" className="gc-btn gc-btn--primary gc-form__submit">
              <MessageCircle size={18} />
              {t('Send enquiry via WhatsApp')}
              <ArrowUpRight size={17} />
            </button>
            <p className="gc-form__note">
              This opens WhatsApp. Your enquiry is only sent when you press Send
              in WhatsApp.
            </p>
            <div
              role="status"
              className={`gc-form__feedback${feedback ? " is-visible" : ""}`}
            >
              {feedback}
              {enquiry && (
                <a href={enquiry} target="_blank" rel="noreferrer">
                  Open your enquiry in WhatsApp <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          </form>
        </div>
      </section>

      <FaqSection
        entries={[
          [
            "Can I ask about more than one service?",
            "Yes. Select Multiple services / Not sure yet and describe the work you need. We can discuss the scope as one project.",
          ],
          [
            "What should I include?",
            "Your location, current setup and the work you want done. Photos or a layout can help explain the site.",
          ],
          [
            "How will I receive a quotation?",
            "We will discuss your requirements and any further information needed to define the scope before preparing a quotation.",
          ],
          [
            "Do you work outside Johannesburg?",
            "The business is based in Johannesburg. Share the project location and we will confirm whether it falls within the area we can support.",
          ],
        ]}
      />
      <ClosingCta />
    </>
  );
}

function NotFoundPage() {
  return (
    <section className="gc-notfound">
      <div className="gc-container">
        <p className="gc-eyebrow">404</p>
        <h1>Page not found.</h1>
        <p>
          Use the navigation to find a service group or return to the homepage.
        </p>
        <Action to="/">Back to home</Action>
      </div>
    </section>
  );
}

function ScrollReveal() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = [...document.querySelectorAll<HTMLElement>(".gc-reveal")];
    let frame = 0;
    const reveal = (element: HTMLElement) => {
      element.classList.add("is-visible");
      observer.unobserve(element);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px" },
    );
    const check = () => {
      frame = 0;
      const limit = window.innerHeight * 0.96;
      elements.forEach((element) => {
        if (element.classList.contains("is-visible")) return;
        if (element.getBoundingClientRect().top < limit) reveal(element);
      });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };
    elements.forEach((element) => {
      element.classList.add("gc-reveal-init");
      observer.observe(element);
    });
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);
  return null;
}

function RouteEffects() {
  const location = useLocation();
  const {code,t}=useLanguage();
  const path = stripLocale(location.pathname).replace(/\/$/, '') || '/';
  const previous = useRef(path);
  useEffect(() => {
    if (previous.current !== path) window.scrollTo({top:0, behavior:'instant'});
    const group = services.find(
      (item) => path === `/services/${item.slug}`,
    );
    const titles: Record<string, string> = {
      "/": "GIGI Cloud Solutions | Enterprise Security, IT and Energy",
      "/about": "About Us | GIGI Cloud Solutions",
      "/services": "Our Services | GIGI Cloud Solutions",
      "/contact": "Contact and Request a Quote | GIGI Cloud Solutions",
    };
    const descriptions: Record<string, string> = {
      "/": "Integrated access control, CCTV, networking, data backup, electrical and solar solutions for businesses and residential estates in Johannesburg.",
      "/about":
        "GIGI Cloud Solutions provides security, access control, IT connectivity, electrical, solar and design solutions to businesses and residential customers in Johannesburg.",
      "/services":
        "Explore all 11 GIGI Cloud Solutions offerings, from access control and CCTV to fibre, networking, solar, electrical and design services.",
      "/contact":
        "Send your project requirements and location to GIGI Cloud Solutions by WhatsApp, phone or email.",
    };
    const title = group
      ? `${t(group.name)} | GIGI Cloud Solutions`
      : t(titles[path] || "Page Not Found | GIGI Cloud Solutions");
    const description =
      group?.description ||
      descriptions[path] ||
      "GIGI Cloud Solutions provides integrated security, IT and energy solutions in Johannesburg.";
    document.title = title;
    for (const [selector, value] of [
      ['meta[name="description"]', t(description)],
      ['meta[property="og:title"]', title],
      ['meta[property="og:description"]', t(description)],
      ['meta[property="og:url"]', company.url + localPath(code,path)],
    ]) {
      document.querySelector(selector)?.setAttribute("content", value);
    }
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", company.url + localPath(code,path));
    for (const [tag, href] of [...codes.map(c=>[localeTag(c),localPath(c,path)]),['x-default', path]]) {
      let link=document.querySelector<HTMLLinkElement>(`link[hreflang="${tag}"]`);
      if(!link){link=document.createElement('link');link.rel='alternate';link.hreflang=tag;document.head.append(link);}
      link.href=company.url+href;
    }
    if (previous.current !== path) {
      document.getElementById("main")?.focus({ preventScroll: true });
    }
    previous.current = path;
  }, [path,code,t]);
  return null;
}

function AppRoutes() {
  const location = useLocation();
  const pathname = stripLocale(location.pathname);
  return (
    <div className="gc-page" key={pathname}>
      <Routes location={{...location, pathname}}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        {services.map((group, index) => (
          <Route
            key={group.slug}
            path={`/services/${group.slug}`}
            element={<ServicePage index={index} />}
          />
        ))}
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

function App() {
  const chat = useWhatsApp();
  return (
    <BrowserRouter>
      <a className="gc-skip" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <AppRoutes />
      </main>
      <SiteFooter />
      <a
        className="gc-chat"
        href={chat}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with GIGI on WhatsApp"
      >
        <MessageCircle size={23} />
      </a>
      <RouteEffects />
      <ScrollReveal />
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(<LanguageProvider><App /></LanguageProvider>);
