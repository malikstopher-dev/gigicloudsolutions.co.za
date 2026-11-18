import React, {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Check,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Plus,
  Minus,
  Cloud,
} from "lucide-react";
import {
  company,
  services,
  quoteLink,
  whatsapp,
  type ServicePhoto,
} from "./data";
import "./styles.css";
import "./redesign.css";
import "./photo.css";
import './route-design.css';
import { fieldNotes, FieldGuide, Questions } from './field-guide';

const AboutScene = lazy(() => import("./scene"));

function AboutVisual() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setEnabled(
        !mq.matches &&
          !(
            "connection" in navigator &&
            (navigator.connection as { saveData?: boolean }).saveData
          ),
      );
    const timer = setTimeout(update, 500);
    mq.addEventListener("change", update);
    return () => {
      clearTimeout(timer);
      mq.removeEventListener("change", update);
    };
  }, []);
  return (
    <div className="about-visual">
      <div className="about-stage">
        <div className="static-sculpture">
          <img
            src="/artwork/hero.webp"
            width="1600"
            height="1200"
            alt="3D concept showing a property with solar, security and IT equipment"
            loading="lazy"
          />
        </div>
        {enabled && (
          <Suspense fallback={null}>
            <AboutScene />
          </Suspense>
        )}
      </div>
      <small>Illustrative equipment concept</small>
    </div>
  );
}
const logo = "/visuals/gigi-wordmark.webp";
const photoFiles: Record<
  ServicePhoto,
  { widths: number[]; width: number; height: number; alt: string }
> = {
  "access-control": {
    widths: [640, 960, 1536],
    width: 1536,
    height: 1024,
    alt: "Illustrative hand using an access card reader at an office entrance",
  },
  "cctv-security": {
    widths: [640, 960, 1536],
    width: 1536,
    height: 1024,
    alt: "Illustrative CCTV camera installed on a modern property",
  },
  "it-networking": {
    widths: [640, 960, 1536],
    width: 1536,
    height: 1024,
    alt: "Illustrative network switches and structured cabling",
  },
  "solar-energy": {
    widths: [640, 960, 1536],
    width: 1536,
    height: 1024,
    alt: "Illustrative home with rooftop solar panels",
  },
  "web-design": {
    widths: [640, 960, 1536],
    width: 1536,
    height: 1024,
    alt: "Illustrative website layouts on desktop and mobile",
  },
};
function ServicePhoto({
  id,
  sizes = "100vw",
  eager = false,
}: {
  id: ServicePhoto;
  sizes?: string;
  eager?: boolean;
}) {
  const photo = photoFiles[id];
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={photo.widths
          .map((w) => `/images/gigi/${id}-${w}.webp ${w}w`)
          .join(", ")}
        sizes={sizes}
      />
      <img
        src={`/images/gigi/${id}.jpg`}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
      />
    </picture>
  );
}
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}
function HeroMedia() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [allowVideo, setAllowVideo] = useState(false);
  const [failed, setFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = "connection" in navigator
      ? (navigator.connection as { saveData?: boolean })
      : undefined;
    const update = () => setAllowVideo(!mq.matches && !connection?.saveData);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;
    let visible = false;
    const update = () => {
      if (visible && !document.hidden) el.play().catch(() => {});
      else el.pause();
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [isDesktop, allowVideo, failed]);
  const poster = isDesktop
    ? "/images/gigi/hero-desktop-960.webp"
    : "/images/gigi/hero-mobile-960.webp";
  const source = isDesktop
    ? "/videos/HERO%20DESKTOP.mp4"
    : "/videos/hero%20mobile.mp4";
  if (allowVideo && !failed) {
    return (
      <div className="photo-hero-media">
        <video
          key={source}
          ref={video}
          src={source}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }
  return (
    <picture className="photo-hero-media">
      <source
        media="(min-width: 768px)"
        type="image/webp"
        srcSet="/images/gigi/hero-desktop-960.webp 960w, /images/gigi/hero-desktop-1600.webp 1600w"
        sizes="100vw"
      />
      <source
        type="image/webp"
        srcSet="/images/gigi/hero-mobile-640.webp 640w, /images/gigi/hero-mobile-960.webp 960w, /images/gigi/hero-mobile-1024.webp 1024w"
        sizes="100vw"
      />
      <img
        src="/images/gigi/hero-desktop.jpg"
        alt="Illustrative evening view of a Johannesburg home with solar panels, CCTV and access control"
        width="1672"
        height="941"
        fetchPriority="high"
        decoding="async"
      />
    </picture>
  );
}
function Hero() {
  return (
    <section className="photo-hero">
      <HeroMedia />
      <div className="photo-hero-inner">
        <p className="hero-kicker"><span className="desktop-copy">GIGI Cloud Solutions · Johannesburg</span><span className="phone-copy">GIGI • JOHANNESBURG</span></p>
        <h1><span className="desktop-copy">Technology for your home and business.</span><span className="phone-copy">Technology for home and business.</span></h1>
        <p className="hero-lead">
          <span className="desktop-copy">IT and cloud solutions, security, electrical work, solar systems and design. Tell us what you need to connect, protect or improve.</span><span className="phone-copy">IT, security, solar and design for homes and businesses.</span>
        </p>
        <div className="button-row">
          <Button to="/contact">Request a Quote</Button>
          <Link className="button button-ghost" to="/services">
            View our services
            <ArrowRight size={18} />
          </Link>
        </div>
        <ul className="hero-tags" aria-label="Main service areas">
          <li>Access control</li>
          <li>Solar</li>
          <li>IT services</li>
        </ul>
      </div>
    </section>
  );
}
function FeatureBand({
  tone,
  label,
  title,
  copy,
  photo,
  inset,
  items,
  to,
  linkLabel,
  reverse = false,
}: {
  tone: "navy" | "surface";
  label: string;
  title: string;
  copy: string;
  photo: ServicePhoto;
  inset?: ServicePhoto;
  items: string[];
  to: string;
  linkLabel: string;
  reverse?: boolean;
}) {
  return (
    <section className={`photo-band band-${tone}`}>
      <div
        className={`container photo-band-inner${reverse ? " is-reverse" : ""}`}
      >
        <div className="photo-band-media">
          <ServicePhoto id={photo} sizes="(min-width: 800px) 46vw, 92vw" />
          {inset && (
            <div className="photo-band-inset">
              <ServicePhoto id={inset} sizes="(min-width: 800px) 18vw, 40vw" />
            </div>
          )}
        </div>
        <div className="photo-band-copy reveal">
          <p className="band-label">{label}</p>
          <h2>{title}</h2>
          <p className="band-lead">{copy}</p>
          <ul className="band-list">
            {items.map((item) => (
              <li key={item}>
                <Check size={16} />
                {item}
              </li>
            ))}
          </ul>
          <Link className="band-link" to={to}>
            {linkLabel}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
function RevealOnRoute() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = [...document.querySelectorAll<HTMLElement>(".reveal")];
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px" },
    );
    elements.forEach((el) => {
      el.classList.add("reveal-init");
      io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
function Button({
  to,
  children,
  secondary = false,
}: {
  to: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link className={`button ${secondary ? "secondary" : ""}`} to={to}>
      {children}
      <ArrowUpRight size={18} />
    </Link>
  );
}
function Header() {
  const [scrolled,setScrolled]=useState(()=>window.scrollY>16);
  useEffect(()=>{const sync=()=>setScrolled(window.scrollY>16);window.addEventListener('scroll',sync,{passive:true});sync();return ()=>window.removeEventListener('scroll',sync)},[]);
  const [open, setOpen] = useState(false),
    [dropdown, setDropdown] = useState(false);
  const location = useLocation();
  const header = useRef<HTMLElement>(null);
  const serviceToggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
    setDropdown(false);
  }, [location]);
  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (!header.current?.contains(e.target as Node)) {
        setOpen(false);
        setDropdown(false);
      }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  return (
    <header
      className={scrolled ? 'header is-scrolled' : 'header'}
      ref={header}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setDropdown(false);
          setOpen(false);
          if (matchMedia("(max-width:800px)").matches)
            (
              header.current?.querySelector(".menu-toggle") as HTMLElement
            )?.focus();
          else serviceToggle.current?.focus();
        }
      }}
    >
      <div className="container nav-inner">
        <Link to="/" aria-label="GIGI Cloud Solutions home">
          <img
            className="logo"
            src="/visuals/gigi-wordmark-dark.png"
            alt="GIGI Cloud Solutions"
            width="1983"
            height="793"
          />
        </Link>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="navigation"
          className={open ? "open" : ""}
          aria-label="Main navigation"
        >
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <div className="nav-services">
            <div className="service-nav-row">
              <NavLink to="/services">Services</NavLink>
              <button
                ref={serviceToggle}
                aria-label="Show service pages"
                aria-expanded={dropdown}
                aria-controls="service-menu"
                onClick={() => setDropdown(!dropdown)}
              >
                <ChevronDown size={15} />
              </button>
            </div>
            {dropdown && (
              <div className="dropdown" id="service-menu">
                {services.map((s) => (
                  <Link key={s.slug} to={`/services/${s.slug}`}>
                    {s.name}
                    <ArrowUpRight size={15} />
                  </Link>
                ))}
              </div>
            )}
          </div>
          <NavLink to="/contact">Contact</NavLink>
          <Button to="/contact">Request a Quote</Button>
        </nav>
      </div>
    </header>
  );
}
function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" aria-label="Home">
            <img
              src={logo}
              alt="GIGI Cloud Solutions"
              width="1983"
              height="793"
            />
          </Link>
          <p>
            IT, cloud, security, electrical, solar and design services.
            <br />
            Based in Johannesburg.
          </p>
          <a
            className="text-link"
            href={whatsapp()}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp us <ArrowUpRight size={17} />
          </a>
        </div>
        <div>
          <h3>Explore</h3>
          <Link to="/">Home</Link>
          <Link to="/about">About us</Link>
          <Link to="/services">Our services</Link>
          <Link to="/contact">Request a quote</Link>
        </div>
        <div>
          <h3>Services</h3>
          {services.map((s) => (
            <Link key={s.slug} to={`/services/${s.slug}`}>
              {s.name}
            </Link>
          ))}
        </div>
        <div>
          <h3>Contact</h3>
          <a href={`tel:${company.tel}`}>{company.phone}</a>
          <a href={`mailto:${company.email}`}>{company.email}</a>
          <p>{company.address}</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {company.name}
        </span>
        <span>Registration: {company.registration}</span>
        <a href={company.url}>www.gigicloudsolutions.co.za</a>
      </div>
      <div className="container footer-credit">
        Website by <a href="https://stopher-malik.co.za">Stopher Malik</a>
        {" · "}
        <a href="https://smk.stopher-malik.co.za">SMK Web Design</a>
      </div>
    </footer>
  );
}
function Closing() {
  return (
    <section className="closing container reveal">
      <div>
        <h2>Tell us what you need.</h2>
        <p>
          Send your requirements and project location. We will discuss the scope
          before preparing a quotation.
        </p>
      </div>
      <div className="closing-actions">
        <Button to="/contact">Request a Quote</Button>
        <a href={`tel:${company.tel}`}>
          <Phone size={17} />
          {company.phone}
        </a>
      </div>
    </section>
  );
}
function Process() {
  return (
    <section className="process section container">
      <div className="section-heading reveal">
        <h2>How to request a quote</h2>
        <p>
          Start with the details you have. We will discuss anything else needed
          to define the work.
        </p>
      </div>
      <div className="steps">
        {[
          [
            "Tell us what you need",
            "Share your location, current setup and the work you have in mind.",
          ],
          [
            "Discuss the work",
            "We will discuss the requirements and any further information needed.",
          ],
          [
            "Review your quotation",
            "Check the proposed scope and quotation before deciding to proceed.",
          ],
        ].map(([title, copy], i) => (
          <article className="reveal" key={title}>
            <span className="step-number">0{i + 1}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
function ServiceCards() {
  return (
    <div className="photo-service-grid">
      {services.map((s, i) => (
        <article
          className={`photo-service-card ${i < 3 ? "is-primary" : "is-wide"} reveal`}
          key={s.slug}
        >
          <Link to={`/services/${s.slug}`}>
            <div className="photo-card-media">
              {s.photo ? (
                <ServicePhoto
                  id={s.photo}
                  sizes={
                    i < 3
                      ? "(min-width: 1100px) 30vw, (min-width: 641px) 45vw, 92vw"
                      : "(min-width: 1100px) 46vw, 92vw"
                  }
                />
              ) : (
                <div className="cloud-media" aria-hidden="true">
                  <Cloud size={64} strokeWidth={1.4} />
                </div>
              )}
            </div>
            <div className="photo-card-body">
              <h3>{s.name}</h3>
              <p>{s.short}</p>
              <ul>
                {s.items.slice(0, 4).map((item) => (
                  <li key={item}>
                    <Check size={15} />
                    {item}
                  </li>
                ))}
              </ul>
              <span className="card-cta">
                Explore {s.name} <ArrowUpRight size={18} />
              </span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
function Home() {
  return (
    <>
      <Hero />
      <section className="container section home-services">
        <div className="section-heading reveal">
          <h2>What can we help you with?</h2>
          <p>
            Choose a service to see what you can request and which details will
            help us prepare a quote.
          </p>
        </div>
        <ServiceCards />
      </section>
      <FeatureBand
        tone="navy"
        label="Security & Access"
        title="Start with the areas you want to protect."
        copy="See how a camera’s viewing area relates to an entrance. Talk to us about CCTV, alarms, electric fencing and access control for your property."
        photo="access-control"
        inset="cctv-security"
        items={[
          "CCTV and surveillance",
          "Alarm systems",
          "Access control and RFID",
          "Turnstiles and boom gates",
          "Electric fencing and gates",
        ]}
        to="/services/security-access"
        linkLabel="View security services"
      />
      <FeatureBand
        tone="surface"
        reverse
        label="Electrical & Solar"
        title="Plan around what you need to power."
        copy="Start with your electricity use and the appliances you want to keep running, then discuss panels, an inverter and battery storage for your property."
        photo="solar-energy"
        items={[
          "Solar panels and mounting",
          "Inverters and lithium batteries",
          "Hybrid and off-grid systems",
          "Electrical services",
          "Maintenance and support",
        ]}
        to="/services/electrical-solar"
        linkLabel="View electrical and solar services"
      />
      <FeatureBand
        tone="navy"
        label="IT & Connectivity"
        title="Keep your devices, files and team connected."
        copy="From fibre and Wi-Fi to servers, printers and backups, tell us how your home or office works and what needs to change."
        photo="it-networking"
        items={[
          "IT support",
          "Fibre solutions",
          "Networks and Wi-Fi",
          "Servers and storage",
          "Data backup and cloud files",
        ]}
        to="/services/it-connectivity"
        linkLabel="View IT and connectivity services"
      />
      <section className="container about-preview reveal">
        <div>
          <p className="section-label">About GIGI</p>
          <h2>
            Based in Johannesburg.
            <br />
            Working with homes and businesses.
          </h2>
        </div>
        <div>
          <p>
            GIGI Cloud Solutions brings IT, cloud, security, energy and design
            services into one conversation. We start by understanding the work
            you need and the setup you already have.
          </p>
          <Link className="text-link" to="/about">
            About the company <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <Process />
      <Closing />
    </>
  );
}
function RouteHero({variant, label, title, lead, photo, action, to}: {variant:string;label:string;title:string;lead:string;photo:ServicePhoto|'property';action:string;to:string}) {
  return <section className={`photo-hero route-hero route-${variant}`}>
    <figure className="photo-hero-media">{photo === 'property' ? <picture><source media="(max-width:767px)" srcSet="/images/gigi/hero-mobile-640.webp"/><img src="/images/gigi/hero-desktop-1600.webp" alt="Illustrative Johannesburg property with solar panels and a gated entrance"/></picture> : <ServicePhoto id={photo} eager/>}</figure>
    <div className="photo-hero-inner"><p className="hero-kicker">{label}</p><h1>{title}</h1><p className="hero-lead">{lead}</p>{to.startsWith('#') ? <a className="button" href={to}>{action}<ArrowRight size={18}/></a> : <Button to={to}>{action}</Button>}</div>
  </section>;
}
function About() {
  return (
    <>
      <RouteHero variant="about" label="About GIGI • Johannesburg" title="One brief for your property." lead="Plan IT, energy, security and design together with a team based in Kensington." photo="property" action="Discuss your requirements" to="/contact"/>
      <section className="container about-intro reveal">
        <div>
          <p className="section-label">About GIGI Cloud Solutions</p>
          <h2>See how the systems fit together.</h2>
          <p>
            We are a Johannesburg-based company providing IT, cloud solutions,
            security, electrical, solar and design services to homes and
            businesses.
          </p>
          <Button to="/contact">Discuss your requirements</Button>
        </div>
        <AboutVisual />
      </section>
      <section className="container section about-facts reveal">
        <div>
          <h2>What we do</h2>
          <p>
            Your request may be for one service or several. We discuss the
            requirements, your current setup and the information needed to
            prepare a quotation.
          </p>
        </div>
        <div className="about-service-links">
          {services.map((s) => (
            <Link key={s.slug} to={`/services/${s.slug}`}>
              {s.name}
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </div>
      </section>
      <section className="company-band reveal">
        <div className="container">
          <div>
            <h2>Company details</h2>
            <p>{company.name}</p>
          </div>
          <dl>
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
          </dl>
        </div>
      </section>
      <Process />
      <Questions entries={[["Can I combine work from different services?","Yes. Describe your end goal, such as opening an office. We can discuss connectivity, entry control and backup power in the same brief."],["Do I need a complete specification?","No. Start with your location, what is already in place and the change you want to make."]]}/>
      <Closing />
    </>
  );
}
function Services() {
  return (
    <>
      <RouteHero variant="directory" label="Service directory" title="Find your service." lead="Explore five ways to connect, protect or improve your home or business." photo="solar-energy" action="Browse services" to="#directory"/>
      <section className="container services-overview" id="directory">
        <ServiceCards />
      </section>
      <Process />
      <Questions entries={[["Where should I start?","Choose the service closest to your goal. Each guide lists the equipment, site or design details that help us scope the work."],["What if my project spans several services?","Choose Multiple services / Not sure yet on the enquiry form and describe the outcome you need."]]}/>
      <Closing />
    </>
  );
}
function ServicePage({ index }: { index: number }) {
  const s = services[index];
  return (
    <>
      <RouteHero variant={s.art} label={s.name} title={fieldNotes[index].title} lead={fieldNotes[index].lead} photo={s.photo || 'it-networking'} action="Discuss your project" to={quoteLink(s.name)}/>
      <FieldGuide index={index}/>
      <section className="container section request-section reveal">
        <div>
          <p className="section-label">{s.name}</p>
          <h2>What you can request</h2>
        </div>
        <div className="request-list">
          {s.items.map((item, i) => (
            <article key={item}>
              <span>0{i + 1}</span>
              <div>
                <h3>{item}</h3>
                <p>{s.details[i]}</p>
              </div>
              <Link to={quoteLink(s.name)} aria-label={`Enquire about ${item}`}>
                <ArrowUpRight size={21} />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className={`practical-example example-${index}`}>
        <div className="container">
          <div>
            <p className="section-label">A practical example</p>
            <h2>{s.exampleTitle}</h2>
          </div>
          <p>{s.example}</p>
        </div>
      </section>
      <Questions entries={fieldNotes[index].faq}/>
      <section className="container section scope-section reveal">
        <div>
          <h2>What to send for a quote</h2>
          <p>
            These details help us understand the work. Share what you have and
            we will discuss the rest.
          </p>
          <Button to={quoteLink(s.name)}>
            Request a {index === 4 ? "cloud " : ""}quote
          </Button>
        </div>
        <ul>
          {s.quoteInfo.map((t) => (
            <li key={t}>
              <Check size={18} />
              {t}
            </li>
          ))}
        </ul>
      </section>
      <section className="container related">
        <h2>Other services</h2>
        <div>
          {services
            .filter((_, i) => i !== index)
            .map((x) => (
              <Link
                className="text-link"
                key={x.slug}
                to={`/services/${x.slug}`}
              >
                {x.name}
                <ArrowUpRight size={18} />
              </Link>
            ))}
        </div>
      </section>
      <Closing />
    </>
  );
}
function Contact() {
  const [params] = useSearchParams();
  const preset = params.get("service") || "";
  const [feedback, setFeedback] = useState(""),
    [enquiry, setEnquiry] = useState("");
  const [faq, setFaq] = useState<number | null>(null);
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const fields = ["name", "email", "phone", "service", "location", "message"];
    if (fields.some((f) => !String(data.get(f) || "").trim())) {
      setFeedback("Please complete all fields with your project details.");
      return;
    }
    const text = `Hi GIGI, I would like to request a quotation.\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nPhone: ${data.get("phone")}\nService: ${data.get("service")}\nProject location: ${data.get("location")}\n\nProject details:\n${data.get("message")}`;
    window.open(whatsapp(text), "_blank", "noopener,noreferrer");
    setFeedback(
      "Your enquiry is ready to send in WhatsApp. Please review it and press Send there. If WhatsApp did not open, use the link below.",
    );
    setEnquiry(whatsapp(text));
  }
  return (
    <>
      <RouteHero variant="contact" label="Contact • Project enquiries" title="Request a quote." lead="Tell us where the work is needed and what you want to change." photo="web-design" action="Start your enquiry" to="#enquiry"/>
      <section className="container contact-layout">
        <aside>
          <h2>Contact us directly</h2>
          <a className="contact-method" href={`tel:${company.tel}`}>
            <Phone />
            <span>
              <small>Phone</small>
              {company.phone}
            </span>
            <ArrowUpRight size={17} />
          </a>
          <a className="contact-method" href={`mailto:${company.email}`}>
            <Mail />
            <span>
              <small>Email</small>
              {company.email}
            </span>
            <ArrowUpRight size={17} />
          </a>
          <a
            className="contact-method"
            href={whatsapp()}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle />
            <span>
              <small>WhatsApp</small>Message GIGI
            </span>
            <ArrowUpRight size={17} />
          </a>
          <div className="contact-method">
            <MapPin />
            <span>
              <small>Address</small>
              {company.address}
            </span>
          </div>
          <p className="contact-note">
            Include your current setup and the work you need. Please do not send
            passwords or sensitive account details.
          </p>
        </aside>
        <form id="enquiry" className="quote-form" onSubmit={submit}>
          <div className="form-heading">
            <h2>Your project details</h2>
            <p>
              All fields are required. You can review the message before sending
              it in WhatsApp.
            </p>
          </div>
          <div className="form-grid">
            <label>
              Full name
              <input
                name="name"
                autoComplete="name"
                placeholder="Your name"
                required
                maxLength={120}
              />
            </label>
            <label>
              Email address
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
              Phone number
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="e.g. 073 168 0832"
                pattern="[+0-9 ()\-]{7,25}"
                title="Enter a phone number with 7 to 25 digits, spaces, brackets or a plus sign."
                required
              />
            </label>
            <label>
              Service of interest
              <select
                name="service"
                defaultValue={
                  services.some((s) => s.name === preset) ? preset : ""
                }
                required
              >
                <option value="" disabled>
                  Select a service
                </option>
                {services.map((s) => (
                  <option key={s.slug}>{s.name}</option>
                ))}
                <option>Multiple services / Not sure yet</option>
              </select>
            </label>
            <label className="full">
              Project location
              <input
                name="location"
                autoComplete="address-level2"
                placeholder="Suburb or city"
                required
                maxLength={200}
              />
            </label>
            <label className="full">
              What do you have in mind?
              <textarea
                name="message"
                placeholder="Describe the work, your current setup and any timing requirements."
                rows={5}
                required
                maxLength={3000}
              />
            </label>
          </div>
          <button type="submit" className="button whatsapp-submit">
            <MessageCircle size={19} />
            Send enquiry via WhatsApp
            <ArrowUpRight size={18} />
          </button>
          <p className="form-note">
            This opens WhatsApp. Your enquiry is only sent when you press Send
            in WhatsApp.
          </p>
          <div role="status" className={feedback ? "form-feedback" : ""}>
            {feedback}
            {enquiry && (
              <a href={enquiry} target="_blank" rel="noreferrer">
                Open your enquiry in WhatsApp <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </form>
      </section>
      <Process />
      <section className="container section faq">
        <h2>Before you enquire</h2>
        <div>
          {[
            [
              "Can I ask about more than one service?",
              "Yes. Select “Multiple services / Not sure yet” and describe the work you need.",
            ],
            [
              "What should I include?",
              "Your location, current setup and the work you want done. Include photos or a layout in WhatsApp if these would help explain your request.",
            ],
            [
              "How will I get a quotation?",
              "We will discuss your requirements and any further information needed to define the scope before preparing a quotation.",
            ],
          ].map(([q, a], i) => (
            <div className="faq-item" key={q}>
              <button
                aria-expanded={faq === i}
                aria-controls={`faq-${i}`}
                onClick={() => setFaq(faq === i ? null : i)}
              >
                {q}
                {faq === i ? <Minus size={18} /> : <Plus size={18} />}
              </button>
              {faq === i && <p id={`faq-${i}`}>{a}</p>}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
function NotFound() {
  return (
    <section className="container page-hero">
      <h1>Page not found.</h1>
      <p>Use the navigation to find a service or return to the homepage.</p>
      <Button to="/">Back to home</Button>
    </section>
  );
}
function RouteEffects() {
  const location = useLocation();
  const previous = useRef(location.pathname);
  useEffect(() => {
    window.scrollTo(0, 0);
    const s = services.find((s) => location.pathname === `/services/${s.slug}`);
    const title = s
      ? `${s.name} | GIGI Cloud Solutions`
      : {
          "/": "GIGI Cloud Solutions | IT, Cloud, Security, Solar & Design",
          "/about": "About Us | GIGI Cloud Solutions",
          "/services": "Our Services | GIGI Cloud Solutions",
          "/contact": "Contact & Request a Quote | GIGI Cloud Solutions",
        }[location.pathname] || "Page Not Found | GIGI Cloud Solutions";
    const description =
      s?.description ||
      "IT, cloud, security, electrical, solar and design services for homes and businesses. Based in Johannesburg. Contact GIGI Cloud Solutions for a quote.";
    document.title = title;
    for (const [selector, value] of [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', title],
      ['meta[property="og:description"]', description],
      ['meta[property="og:url"]', company.url + location.pathname],
    ])
      document.querySelector(selector)?.setAttribute("content", value);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", company.url + location.pathname);
    if (previous.current !== location.pathname)
      document.getElementById("main")?.focus({ preventScroll: true });
    previous.current = location.pathname;
  }, [location.pathname]);
  return null;
}
function App() {
  return (
    <BrowserRouter>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          {services.map((s, i) => (
            <Route
              key={s.slug}
              path={`/services/${s.slug}`}
              element={<ServicePage index={i} />}
            />
          ))}
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <a
        className="floating-chat"
        href={whatsapp()}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with GIGI on WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
      <RouteEffects />
      <RevealOnRoute />
    </BrowserRouter>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
