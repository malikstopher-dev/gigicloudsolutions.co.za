export const company = {
  name: "GIGI CLOUD SOLUTIONS (Pty) Ltd",
  registration: "2026/867627/07",
  email: "info@gigicloudsolutions.co.za",
  phone: "073 168 0832",
  tel: "+27731680832",
  address: "339 Highland Road, Kensington, Johannesburg, 2094",
  url: "https://www.gigicloudsolutions.co.za",
};

export const whatsapp = (
  message = "Hi GIGI, I would like to discuss a project for my business or home.",
) => `https://wa.me/27731680832?text=${encodeURIComponent(message)}`;

export const mission = {
  intro:
    "At Gigi Cloud, our mission is to provide businesses and homes with reliable, secure and innovative access control, security and IT connectivity solutions.",
  body: "We are committed to simplifying your daily operations, reducing the stress associated with technology and providing seamless connectivity. Through dependable systems, secure data backup and efficient security solutions, we give our clients the flexibility, confidence and peace of mind they deserve.",
  closing: "Your security is our priority. Your connectivity is our commitment.",
};

export const vision = {
  intro:
    "To become a leading and trusted provider of innovative security, access control and IT connectivity solutions, empowering homes and businesses through technology.",
  body: "We envision a future where every home and business enjoys seamless connectivity, advanced security and reliable digital protection. Through continuous innovation, excellence and customer-focused solutions, we aim to create safer, smarter and more connected environments.",
  closing: "Building a safer, smarter and more connected future.",
};

export const missionParagraphs = [mission.intro, mission.body];
export const visionParagraphs = [vision.intro, vision.body];

export type HeroKey =
  | "home"
  | "about"
  | "services"
  | "access-control"
  | "cctv-surveillance"
  | "fibre-networking"
  | "it-connectivity"
  | "data-backup"
  | "alarm-electric-fence"
  | "electrical-installations"
  | "solar-energy"
  | "web-graphic-design"
  | "contact"
  | "enterprise-security";

export type GroupSlug =
  | "security-access"
  | "it-connectivity"
  | "electrical-solar"
  | "web-graphic-design"
  | "cloud-solutions";

export type Capability = {
  id: string;
  name: string;
  group: GroupSlug;
  icon: string;
  image: string;
  summary: string;
  detail: string;
  benefits: string[];
};

export type ServiceGroup = {
  slug: GroupSlug;
  name: string;
  short: string;
  label: string;
  hero: HeroKey;
  heroAlt: string;
  intro: string;
  description: string;
  capabilities: string[];
  items: string[];
  details: string[];
  outcomes: string[];
  applications: string[];
  approach: { title: string; text: string }[];
  exampleTitle: string;
  example: string;
  quoteInfo: string[];
  faq: [string, string][];
  related: GroupSlug[];
};

export const capabilities: Capability[] = [
  {
    id: "access-control",
    name: "Access Control",
    group: "security-access",
    icon: "icon-access-control.svg",
    image: "access-control",
    summary:
      "Manage who enters your premises with biometric readers, RFID cards, keypads and controlled entry points.",
    detail:
      "Access control gives your team a clear way to manage staff, visitors and contractors across doors, gates and restricted areas. We plan the entry points around how your building is used, then discuss the readers, credentials and integration that suit your security setup.",
    benefits: [
      "Controlled entry for staff, visitors and contractors",
      "Credentials that can change when access needs change",
      "A clearer view of movement through key entry points",
    ],
  },
  {
    id: "cctv-surveillance",
    name: "CCTV and Surveillance",
    group: "security-access",
    icon: "icon-cctv.svg",
    image: "cctv-surveillance",
    summary:
      "Plan camera coverage around entrances, walkways, parking and high-value areas.",
    detail:
      "Surveillance is most useful when the cameras are positioned around real sightlines, lighting and areas of concern. We discuss indoor and outdoor coverage, monitoring needs and how footage should be reviewed so the system supports your daily operations.",
    benefits: [
      "Coverage planned around entrances and movement routes",
      "Views that support monitoring and incident review",
      "Flexible options for indoor and outdoor areas",
    ],
  },
  {
    id: "alarm-systems",
    name: "Alarm Systems",
    group: "security-access",
    icon: "icon-alarm.svg",
    image: "alarm-systems",
    summary:
      "Detect intrusion and alert the right people with an alarm system matched to your premises.",
    detail:
      "We discuss the doors, windows, rooms and movement zones that need protection, then plan detection and alerting around your response arrangements. Existing alarm equipment can be reviewed before replacement is considered.",
    benefits: [
      "Detection for doors, windows and movement zones",
      "Alerting that fits your response arrangements",
      "Room to extend as your premises change",
    ],
  },
  {
    id: "electric-fencing",
    name: "Electric Fencing",
    group: "security-access",
    icon: "icon-fence.svg",
    image: "electric-fencing",
    summary:
      "Strengthen perimeter security with electric fencing and controlled gate entry.",
    detail:
      "A perimeter is often the first layer of security. We discuss the boundary, gates, existing equipment and how fencing should work with alarms and access control. Maintenance and support for existing installations can also be discussed.",
    benefits: [
      "A visible perimeter deterrent",
      "Integration with alarms and access points",
      "Maintenance and support for existing installations",
    ],
  },
  {
    id: "fibre-solutions",
    name: "Fibre Solutions",
    group: "it-connectivity",
    icon: "icon-networking.svg",
    image: "fibre-networking",
    summary:
      "Build a reliable foundation for connectivity with fibre planning and installation.",
    detail:
      "Fibre can provide the stable backbone that modern business systems need. We discuss the providers available at your premises, where the connection enters the building and how the internal network should distribute it.",
    benefits: [
      "Connectivity planned around your building and providers",
      "Wired links for systems that need stability",
      "Support for current and future network demand",
    ],
  },
  {
    id: "it-networking",
    name: "IT Networking and Connectivity",
    group: "it-connectivity",
    icon: "icon-it.svg",
    image: "it-connectivity",
    summary:
      "Connect offices, devices and teams with structured cabling, networking and Wi-Fi.",
    detail:
      "We plan networks around the people, rooms and devices that depend on them. That includes wired connections, wireless coverage, switching and the physical cabling that keeps the environment maintainable.",
    benefits: [
      "Networks designed around users, rooms and devices",
      "Wired and wireless coverage for daily operations",
      "A maintainable foundation for future growth",
    ],
  },
  {
    id: "data-backup",
    name: "Data Backup Solutions",
    group: "it-connectivity",
    icon: "icon-backup.svg",
    image: "data-backup",
    summary:
      "Protect important files with a backup and recovery approach suited to your business.",
    detail:
      "A backup is only useful if it can be restored. We discuss which files matter, where they are stored and who needs access, then plan backup and recovery steps that fit the way your team works.",
    benefits: [
      "Backup planning around the files that matter",
      "Clear recovery steps when data is lost",
      "Access controls that support responsible handling",
    ],
  },
  {
    id: "electrical-installations",
    name: "Electrical Installations",
    group: "electrical-solar",
    icon: "icon-electrical.svg",
    image: "electrical-installations",
    summary:
      "Commercial electrical installations, upgrades and maintenance planned around your operations.",
    detail:
      "Electrical work needs to support the way a building is used. We discuss the installation, distribution and maintenance requirements of your site, and coordinate the work with the systems and equipment that depend on it.",
    benefits: [
      "Electrical work coordinated with your site and systems",
      "Distribution and installation planning for commercial spaces",
      "Support for upgrades and ongoing maintenance",
    ],
  },
  {
    id: "solar-energy",
    name: "Solar Energy Systems",
    group: "electrical-solar",
    icon: "icon-solar.svg",
    image: "solar-energy",
    summary:
      "Reduce dependence on the grid with commercial solar, inverter and battery systems.",
    detail:
      "We plan solar and backup systems around your actual energy use and the operations you need to keep running. Panel positions, inverter capacity and battery storage are discussed together so the system has a clear purpose.",
    benefits: [
      "Systems sized around your actual energy use",
      "Backup for essential operations",
      "Integration with electrical and monitoring systems",
    ],
  },
  {
    id: "web-design",
    name: "Web Design",
    group: "web-graphic-design",
    icon: "icon-design.svg",
    image: "web-graphic-design",
    summary:
      "Websites that explain your business clearly and turn interest into enquiries.",
    detail:
      "We structure websites around the services you offer and the action you want visitors to take. The layout, content and enquiry paths are planned for desktop and mobile from the start.",
    benefits: [
      "Clear structure for services and contact paths",
      "Responsive layouts for desktop and mobile",
      "SEO-ready foundations and fast loading",
    ],
  },
  {
    id: "graphic-design",
    name: "Graphic Design",
    group: "web-graphic-design",
    icon: "icon-design.svg",
    image: "graphic-design",
    summary:
      "Brand and marketing design that keeps your business consistent across every touchpoint.",
    detail:
      "From brand layouts to brochures and digital material, graphic design should make your business easier to recognise and understand. We discuss the formats, content and existing brand assets before starting.",
    benefits: [
      "A consistent visual language",
      "Print and digital layouts",
      "Brand assets that are practical to use",
    ],
  },
];

export const services: ServiceGroup[] = [
  {
    slug: "security-access",
    name: "Security & Access",
    short: "Security",
    label: "Protect people and property",
    hero: "enterprise-security",
    heroAlt:
      "Security operations centre monitoring commercial surveillance feeds",
    intro:
      "Protect people, property and operations with layered security.",
    description:
      "From biometric access control and surveillance to alarms and perimeter protection, we plan security as one connected system rather than isolated devices.",
    capabilities: [
      "access-control",
      "cctv-surveillance",
      "alarm-systems",
      "electric-fencing",
    ],
    items: [
      "Access control",
      "CCTV and surveillance",
      "Alarm systems",
      "Electric fencing",
      "Integrated security planning",
    ],
    details: [
      "Plan controlled entry for staff, visitors and contractors across doors, gates and restricted areas.",
      "Discuss camera coverage for entrances, walkways, parking and high-value areas.",
      "Review intrusion detection and alerting for the parts of your premises that need protection.",
      "Discuss perimeter fencing, gate entry and how it should work with your other security systems.",
      "Bring the layers together so access, surveillance, alarms and perimeter protection support one another.",
    ],
    outcomes: [
      "Clear control over who enters your premises",
      "Visibility across entrances, walkways and boundaries",
      "Early warning and coordinated response",
      "A security setup that can grow with your site",
    ],
    applications: [
      "Corporate offices and commercial buildings",
      "Retail, hospitality and customer-facing spaces",
      "Industrial sites, warehouses and logistics",
      "Residential estates and private properties",
    ],
    approach: [
      {
        title: "Understand the site",
        text: "We start with the layout, entrances, boundaries and the way people and vehicles move through the property.",
      },
      {
        title: "Map the layers",
        text: "Access, surveillance, alarms and perimeter protection are considered together so each layer supports the next.",
      },
      {
        title: "Agree the scope",
        text: "We discuss the equipment, coverage and priorities before preparing a quotation.",
      },
      {
        title: "Install and support",
        text: "The installation is coordinated around your operations, with support for the system afterwards.",
      },
    ],
    exampleTitle: "A commercial entrance with several user groups",
    example:
      "Staff, visitors and deliveries may all arrive at the same entrance but need different levels of access. We can discuss readers, visitor management and camera coverage together so reception has a clear process and the security team has a useful view of the entrance.",
    quoteInfo: [
      "Property address and type of premises",
      "Entrances, boundaries and areas to cover",
      "Existing cameras, alarms, access or fencing",
      "Who needs access and how visitors are managed",
      "Your priorities and preferred timing",
    ],
    faq: [
      [
        "Should we start with cameras or access control?",
        "Start with the outcome you need. Viewing an area and controlling who may enter are different jobs, and your scope can cover either or both.",
      ],
      [
        "Can you work with our existing security equipment?",
        "Share the make, model and current behaviour of the equipment. We can discuss what can be retained before recommending changes.",
      ],
      [
        "Do you handle both commercial and residential premises?",
        "Yes. The same planning principles apply, but the equipment, user groups and operating requirements differ by site.",
      ],
    ],
    related: ["it-connectivity", "electrical-solar"],
  },
  {
    slug: "it-connectivity",
    name: "IT & Connectivity",
    short: "IT",
    label: "Connect your business",
    hero: "it-connectivity",
    heroAlt:
      "Illustrative enterprise network switches and structured cabling",
    intro: "Keep your business connected, protected and ready to grow.",
    description:
      "Fibre, structured networking, Wi-Fi and data backup work together. We plan the foundation around your people, systems and the way your business operates.",
    capabilities: ["fibre-solutions", "it-networking", "data-backup"],
    items: [
      "Fibre solutions",
      "IT networking",
      "Wi-Fi and structured cabling",
      "Data backup",
      "IT support and maintenance",
    ],
    details: [
      "Discuss fibre options and what your premises can connect to.",
      "Plan wired and wireless networking for the rooms, users and devices you have.",
      "Request structured cabling and Wi-Fi coverage for offices, meeting rooms and shared areas.",
      "Talk through backup, retention and how important files would be restored.",
      "Ask about ongoing support and maintenance for your IT environment.",
    ],
    outcomes: [
      "Reliable connectivity across your premises",
      "Network coverage that supports daily work",
      "Protected files and a clearer recovery path",
      "Infrastructure that can scale with your team",
    ],
    applications: [
      "Offices and co-working environments",
      "Retail and hospitality operations",
      "Warehouses and industrial facilities",
      "Multi-site and growing teams",
    ],
    approach: [
      {
        title: "Map the demand",
        text: "We look at the users, devices, rooms and systems that depend on the network.",
      },
      {
        title: "Design the foundation",
        text: "Fibre, cabling, switching and Wi-Fi are planned as one environment rather than separate add-ons.",
      },
      {
        title: "Protect the data",
        text: "Backup and recovery are discussed alongside connectivity so files are not an afterthought.",
      },
      {
        title: "Support the rollout",
        text: "Installation and handover are coordinated with your team and existing service providers.",
      },
    ],
    exampleTitle: "An office that is outgrowing its network",
    example:
      "A growing team may add desks, meeting-room video calls and shared files faster than the original network can handle. We can review the current setup, discuss coverage gaps and plan the cabling, Wi-Fi and backup changes together.",
    quoteInfo: [
      "Your suburb and the type of premises",
      "The number of users and devices",
      "Your current internet connection and network equipment",
      "Any IT issues, backup requirements and preferred timing",
    ],
    faq: [
      [
        "Is slow Wi-Fi always a fibre issue?",
        "No. Compare a wired connection with Wi-Fi in the affected area. Tell us where the difference shows up so we can discuss the cause.",
      ],
      [
        "Can we keep our existing router and switches?",
        "Send the make and model. We can discuss what the equipment supports before recommending replacements.",
      ],
      [
        "Does a backup need to be in the cloud?",
        "Not necessarily. The right approach depends on your files, recovery needs and how your team works. We discuss the options with you.",
      ],
    ],
    related: ["security-access", "cloud-solutions"],
  },
  {
    slug: "electrical-solar",
    name: "Electrical & Solar",
    short: "Energy",
    label: "Power your operations",
    hero: "solar-energy",
    heroAlt:
      "Illustrative commercial rooftop solar installation at a corporate building",
    intro: "Power your operations with safer electrical systems and resilient energy.",
    description:
      "From commercial electrical installations to solar, inverters and battery storage, we plan energy around how your premises actually runs.",
    capabilities: ["electrical-installations", "solar-energy"],
    items: [
      "Electrical installations",
      "Solar energy systems",
      "Inverters and battery storage",
      "Maintenance and support",
      "Energy planning",
    ],
    details: [
      "Request electrical installation, maintenance or upgrade work for your premises.",
      "Discuss panel positions and the roof or ground space available at your site.",
      "Talk through inverter and battery options for the operations you need to keep running.",
      "Ask about maintaining or supporting an existing electrical or solar installation.",
      "Bring your electricity use, backup priorities and future plans into one conversation.",
    ],
    outcomes: [
      "Electrical systems planned around your operations",
      "Solar and storage sized around real energy use",
      "Backup for the equipment that matters most",
      "A maintainable energy setup for the long term",
    ],
    applications: [
      "Commercial and industrial buildings",
      "Retail and hospitality sites",
      "Warehouses and logistics facilities",
      "Homes and residential estates",
    ],
    approach: [
      {
        title: "Review the load",
        text: "We start with the equipment, operating hours and energy use that the system needs to support.",
      },
      {
        title: "Plan the supply",
        text: "Electrical distribution, solar generation and storage are considered as one energy plan.",
      },
      {
        title: "Agree the priorities",
        text: "Essential operations, budget and future expansion are discussed before the scope is set.",
      },
      {
        title: "Install and maintain",
        text: "The installation is coordinated with your site, with maintenance and support discussed for the future.",
      },
    ],
    exampleTitle: "Keeping essential operations running",
    example:
      "A business may need to keep security systems, connectivity and selected equipment running during an outage. We can discuss the loads that matter, the backup window and how solar and battery storage could support them.",
    quoteInfo: [
      "Your location and property type",
      "Your recent electricity usage, if available",
      "The equipment or operations you need to keep running",
      "Details of existing electrical or solar equipment and available space",
    ],
    faq: [
      [
        "Is a monthly bill enough to size a battery?",
        "It helps with consumption, but power ratings and the hours each item must run matter too.",
      ],
      [
        "Can you discuss an existing installation?",
        "Yes. Include inverter and battery model numbers and describe the behaviour you want to change.",
      ],
      [
        "Can solar work with our existing electrical system?",
        "That depends on the current installation and equipment. Share the details and we can discuss the options before any work is proposed.",
      ],
    ],
    related: ["it-connectivity", "security-access"],
  },
  {
    slug: "web-graphic-design",
    name: "Web & Graphic Design",
    short: "Design",
    label: "Present your business",
    hero: "web-graphic-design",
    heroAlt:
      "Illustrative creative digital workspace with website and brand layouts",
    intro: "Present your business with clarity and consistency.",
    description:
      "Your website and brand materials should make it easy for customers to understand what you do and take the next step.",
    capabilities: ["web-design", "graphic-design"],
    items: [
      "Website design",
      "Website redesign",
      "Brand and graphic design",
      "Marketing material",
    ],
    details: [
      "Discuss a new website, including the pages, content and enquiry actions you need.",
      "Ask to refresh an existing site so it is clearer, faster and easier to use on a phone.",
      "Request brand layouts, logo support and visual systems for your business.",
      "Ask for flyers, brochures or social media layouts that match your brand.",
    ],
    outcomes: [
      "A website that explains your services clearly",
      "Consistent visual material across digital and print",
      "Enquiry paths that are easy to find and use",
      "A brand presence that feels professional and current",
    ],
    applications: [
      "Professional service businesses",
      "Security, IT and infrastructure companies",
      "Retail and hospitality brands",
      "New and growing businesses",
    ],
    approach: [
      {
        title: "Clarify the message",
        text: "We start with the audience, the services and the action a visitor should take.",
      },
      {
        title: "Structure the experience",
        text: "Pages, content and contact paths are planned before the visual design is finalised.",
      },
      {
        title: "Design the system",
        text: "Typography, colour and layout are applied consistently across web and print.",
      },
      {
        title: "Review and launch",
        text: "Phone layouts, enquiry links and print formats are checked before the work goes live.",
      },
    ],
    exampleTitle: "A service business that needs a clearer first impression",
    example:
      "You might need a website with your services, contact details and an enquiry form, plus matching visual material for proposals and social media. Bring your logo and content, or tell us what still needs to be created.",
    quoteInfo: [
      "Your business name, audience and services",
      "Your existing website, logo and brand files, if available",
      "The pages or design items you need",
      "Your content, reference examples and preferred launch date",
    ],
    faq: [
      [
        "What if I only need print material?",
        "Name the formats and finished dimensions, and tell us whether the logo and copy are ready.",
      ],
      [
        "Can we redesign without starting over?",
        "Share your current URL and identify the pages, content and brand elements you want to keep.",
      ],
      [
        "Do you write the content too?",
        "We can help structure and refine the content. Tell us what already exists and what still needs to be written.",
      ],
    ],
    related: ["it-connectivity", "cloud-solutions"],
  },
  {
    slug: "cloud-solutions",
    name: "Cloud Solutions",
    short: "Cloud",
    label: "Work from anywhere",
    hero: "data-backup",
    heroAlt:
      "Illustrative illuminated server racks in a secure data environment",
    intro: "Give your team secure access to the files and tools they need.",
    description:
      "We help you plan cloud access, shared files and recovery around the way your business works, without overcomplicating the tools you already use.",
    capabilities: ["data-backup", "it-networking"],
    items: [
      "Cloud requirements",
      "Shared file access",
      "Data backup and recovery",
      "Platform guidance",
    ],
    details: [
      "Tell us what you want to do in the cloud, who needs access and which files or tools are involved.",
      "Discuss how staff should reach shared files at the office and when working elsewhere.",
      "Talk about backups, retention and how files would be restored.",
      "Share the platforms you already use and ask about alternatives before changing anything.",
    ],
    outcomes: [
      "File access that works in and out of the office",
      "Clear ownership and access rules for shared files",
      "A recovery approach that has been thought through",
      "Practical guidance on the platforms you already use",
    ],
    applications: [
      "Teams working across office and remote locations",
      "Businesses sharing files with clients or partners",
      "Growing teams that need consistent access rules",
      "Organisations reviewing backup and recovery",
    ],
    approach: [
      {
        title: "Map the access",
        text: "We identify who needs which files, from where and on which devices.",
      },
      {
        title: "Review the platforms",
        text: "Existing tools are reviewed before any migration or new platform is proposed.",
      },
      {
        title: "Plan the recovery",
        text: "Backup, retention and restoration are discussed alongside day-to-day access.",
      },
      {
        title: "Support the change",
        text: "Access changes are introduced with the team and the practical details covered.",
      },
    ],
    exampleTitle: "Accessing work files from more than one place",
    example:
      "A small business may want staff to reach shared files at the office and when working elsewhere. Tell us which tools you use and how access is currently managed so we can discuss the requirement.",
    quoteInfo: [
      "The cloud platforms or tools you currently use",
      "The number of people who need access",
      "The files, workflows or access issues involved",
      "Your intended outcome and timing, without sharing passwords",
    ],
    faq: [
      [
        "Does syncing count as a backup?",
        "A deletion can sync across devices. Discuss version history, retention and a recovery test separately.",
      ],
      [
        "What should I send about our accounts?",
        "Platform names, team size and access issues are enough to start. Never send passwords or recovery codes.",
      ],
      [
        "Can we keep our current cloud platform?",
        "Often yes. We review what you already use and discuss whether it fits your access and recovery needs.",
      ],
    ],
    related: ["it-connectivity", "web-graphic-design"],
  },
];

export const capabilityById = (id: string) =>
  capabilities.find((capability) => capability.id === id)!;

export const groupBySlug = (slug: string) =>
  services.find((group) => group.slug === slug)!;

export const industries = [
  {
    name: "Corporate offices",
    text: "Connected workplaces with controlled access, surveillance and reliable IT.",
  },
  {
    name: "Retail & hospitality",
    text: "Security and connectivity for busy customer-facing environments.",
  },
  {
    name: "Industrial & logistics",
    text: "Perimeter protection, surveillance and network infrastructure for operational sites.",
  },
  {
    name: "Education & institutions",
    text: "Access, monitoring and connectivity for shared facilities and campuses.",
  },
  {
    name: "Healthcare & professional services",
    text: "Secure spaces, protected data and dependable connectivity.",
  },
  {
    name: "Residential estates",
    text: "Integrated security, access and connectivity for modern residential properties.",
  },
];

export const values = [
  {
    title: "Integrated thinking",
    text: "Security, connectivity, energy and design are considered together so the systems support one another.",
  },
  {
    title: "Reliable systems",
    text: "We focus on practical equipment and a scope that can be maintained after installation.",
  },
  {
    title: "Clear communication",
    text: "You should understand what is being proposed, what it covers and what happens next.",
  },
  {
    title: "Long-term support",
    text: "The conversation does not end at installation. Maintenance and support can be discussed for the future.",
  },
];

export const processSteps = [
  {
    title: "Tell us what you need",
    text: "Share your location, the type of premises and the outcome you want to achieve.",
  },
  {
    title: "Review the environment",
    text: "We discuss the existing setup, the areas involved and any information needed to scope the work.",
  },
  {
    title: "Agree the scope",
    text: "The proposed equipment, coverage and priorities are set out before a quotation is prepared.",
  },
  {
    title: "Install and support",
    text: "The work is coordinated around your operations, with support for the system afterwards.",
  },
];

export const quoteLink = (service?: string) =>
  `/contact${service ? `?service=${encodeURIComponent(service)}` : ""}`;

export const groupForCapability = (id: string) =>
  services.find((group) => group.capabilities.includes(id));

export const capabilitiesByGroup = (group: ServiceGroup) =>
  group.capabilities.map((id) => capabilityById(id));
