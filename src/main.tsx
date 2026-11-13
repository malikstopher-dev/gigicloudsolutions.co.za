import React, { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import { company, services, quoteLink, whatsapp } from "./data";
import VisualBoard, { BoardThumbnail } from "./VisualBoard";
import HeroEnvironment from "./HeroEnvironment";
import "./styles.css";
import "./redesign.css";
const logo = "/visuals/gigi-wordmark.webp";
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
      className="header"
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
            src={logo}
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
    <section className="closing container">
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
      <div className="section-heading">
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
          <article key={title}>
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
    <div className="service-cards">
      {services.map((s, i) => (
        <Link
          className={`service-card card-${i}`}
          to={`/services/${s.slug}`}
          key={s.slug}
        >
          <BoardThumbnail index={i} />
          <div className="service-card-copy">
            <h3>{s.name}</h3>
            <p>{s.short}</p>
            <span className="card-bottom">
              View services <ArrowUpRight size={19} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <p className="location-line">GIGI Cloud Solutions · Johannesburg</p>
          <h1>Technology for your home and business.</h1>
          <p>
            IT and cloud solutions, security, electrical work, solar systems and
            design. Tell us what you need to connect, protect or improve.
          </p>
          <div className="button-row">
            <Button to="/contact">Request a Quote</Button>
            <Link className="text-link" to="/services">
              View our services <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <HeroEnvironment />
      </section>
      <section className="container section home-services">
        <div className="section-heading">
          <h2>What can we help you with?</h2>
          <p>
            Choose a service to see what you can request and which details will
            help us prepare a quote.
          </p>
        </div>
        <ServiceCards />
      </section>
      <section className="feature-dark">
        <div className="container feature-layout">
          <div className="feature-copy">
            <p className="section-label">Security & Access</p>
            <h2>Start with the areas you want to protect.</h2>
            <p>
              See how a camera’s viewing area relates to an entrance. Talk to us
              about CCTV, alarms, electric fencing and access control for your
              property.
            </p>
            <Link className="text-link" to="/services/security-access">
              View security services <ArrowUpRight size={18} />
            </Link>
          </div>
          <VisualBoard index={1} />
        </div>
      </section>
      <section className="container section feature-layout energy-feature">
        <VisualBoard index={2} />
        <div className="feature-copy">
          <p className="section-label">Electrical & Solar</p>
          <h2>Plan around what you need to power.</h2>
          <p>
            Switch the illustration between day and night to see the role of
            panels and battery storage. Then tell us about your electricity use
            and existing equipment.
          </p>
          <Link className="text-link" to="/services/electrical-solar">
            View electrical and solar services <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="container about-preview">
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
function About() {
  return (
    <>
      <section className="container about-intro">
        <div>
          <p className="section-label">About GIGI Cloud Solutions</p>
          <h1>Practical services for your property and business.</h1>
          <p>
            We are a Johannesburg-based company providing IT, cloud solutions,
            security, electrical, solar and design services to homes and
            businesses.
          </p>
          <Button to="/contact">Discuss your requirements</Button>
        </div>
        <div className="about-visual">
          <img
            src="/artwork/hero.webp"
            alt="Original 3D concept showing a property with solar, security and IT equipment"
            width="1600"
            height="1200"
          />
          <small>Illustrative equipment concept</small>
        </div>
      </section>
      <section className="container section about-facts">
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
      <section className="company-band">
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
      <Closing />
    </>
  );
}
function Services() {
  return (
    <>
      <section className="page-hero container">
        <p className="section-label">Services</p>
        <h1>Services for your home and business.</h1>
        <p>
          Explore IT, cloud solutions, security, electrical, solar and design.
          Each page explains what you can request and how to start an enquiry.
        </p>
      </section>
      <section className="container services-overview">
        <ServiceCards />
      </section>
      <Process />
      <Closing />
    </>
  );
}
function ServicePage({ index }: { index: number }) {
  const s = services[index];
  return (
    <>
      <section
        className={`container service-page-hero service-layout-${index}`}
      >
        <div className="service-intro">
          <Link className="breadcrumb" to="/services">
            Services <ArrowRight size={14} /> {s.name}
          </Link>
          <h1>{s.intro}</h1>
          <p>{s.description}</p>
          <Button to={quoteLink(s.name)}>Discuss your project</Button>
        </div>
        <VisualBoard key={index} index={index} />
      </section>
      <section className="container section request-section">
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
      <section className="container section scope-section">
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
      <section className="page-hero container contact-heading">
        <p className="section-label">Contact GIGI</p>
        <h1>Request a quote.</h1>
        <p>
          Tell us what you need and where the work is required. Use the form to
          prepare a WhatsApp enquiry, or contact us directly.
        </p>
      </section>
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
        <form className="quote-form" onSubmit={submit}>
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
    </BrowserRouter>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
