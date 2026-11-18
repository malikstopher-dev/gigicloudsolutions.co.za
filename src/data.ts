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
  message = "Hi GIGI, I would like to discuss a project for my home or business.",
) => `https://wa.me/27731680832?text=${encodeURIComponent(message)}`;
export type ServicePhoto =
  | "access-control"
  | "cctv-security"
  | "it-networking"
  | "solar-energy"
  | "web-design";
export const services = [
  {
    slug: "it-connectivity",
    name: "IT & Connectivity",
    label: "IT",
    art: "it",
    photo: "it-networking" as ServicePhoto,
    intro: "IT, networks and backup for your home or business.",
    description:
      "Ask GIGI about IT support, fibre, wired and wireless networks, servers and backups for your important files.",
    short: "Connect your devices, secure your data and keep the office running.",
    items: [
      "IT support",
      "Fibre solutions",
      "Networks and Wi-Fi",
      "Servers and storage",
      "Data backup and cloud files",
    ],
    details: [
      "Tell us about a device, software or IT issue you need help with, and how often it affects your work.",
      "Discuss fibre options and what your premises can connect to.",
      "Request a wired or wireless network for the rooms, users and devices you have.",
      "Discuss a server, shared storage or a simple file setup for your team.",
      "Tell us which files need backing up, where they are stored and how you would restore them.",
    ],
    exampleTitle: "Moving into a small office?",
    example:
      "You may need connectivity at reception, Wi-Fi in the meeting room and a backup plan for shared files. Tell us about the layout and the number of people and devices so we can discuss the scope.",
    quoteInfo: [
      "Your suburb and the type of premises",
      "The number of users and devices",
      "Your current internet connection and network equipment",
      "Any IT issues, backup requirements and preferred timing",
    ],
  },
  {
    slug: "security-access",
    name: "Security & Access",
    label: "Security",
    art: "security",
    photo: "cctv-security" as ServicePhoto,
    intro: "See your property. Manage who comes in.",
    description:
      "CCTV, alarm systems, electric fencing, gates and access control for homes and business premises.",
    short: "Plan coverage for entrances, shared spaces and boundaries.",
    items: [
      "CCTV and surveillance",
      "Alarm systems",
      "Access control and RFID",
      "Turnstiles and boom gates",
      "Electric fencing and gates",
    ],
    details: [
      "Discuss the entrances and areas you want to view, including lighting and camera positions.",
      "Request an alarm setup or discuss changes to an existing system.",
      "Discuss biometric readers, RFID cards or a keypad for residents, staff and visitors.",
      "Talk to us about controlled entry at a reception, gate or vehicle entrance.",
      "Tell us about the boundary you want to protect and any existing perimeter equipment.",
    ],
    exampleTitle: "Need a clearer view of your entrance?",
    example:
      "A home may need a camera at the driveway and controlled access at the front door. A business may need separate access for staff and visitors. We can discuss those requirements together.",
    quoteInfo: [
      "The property address and type of premises",
      "The entrances, rooms or boundaries you want to cover",
      "Details of existing cameras, alarms or access equipment",
      "Photos or a simple layout, if available, and your priorities",
    ],
  },
  {
    slug: "electrical-solar",
    name: "Electrical & Solar",
    label: "Energy",
    art: "solar",
    photo: "solar-energy" as ServicePhoto,
    intro: "Electrical work and solar systems for your property.",
    description:
      "Discuss electrical work or a solar system for your home or business, based on what you need to power.",
    short: "Start with your electrical needs and the energy you use.",
    items: [
      "Electrical services",
      "Solar panels and mounting",
      "Inverters and lithium batteries",
      "Hybrid and off-grid systems",
      "Maintenance and support",
    ],
    details: [
      "Request electrical installation, maintenance or upgrade work. Describe the work and your existing setup.",
      "Discuss panel positions and the roof or ground space available at your property.",
      "Talk through inverter and battery options for the appliances you want to keep running.",
      "Explain your goals for daytime use, night-time backup, hybrid or off-grid operation.",
      "Ask about maintaining or supporting an existing electrical or solar installation.",
    ],
    exampleTitle: "Considering solar for your home?",
    example:
      "Start with the appliances you want to run, your electricity usage and the space available for panels. These details help us discuss a suitable scope. The illustration shows the idea of daytime generation and stored energy at night.",
    quoteInfo: [
      "Your location and property type",
      "Your recent electricity usage, if available",
      "The appliances or equipment you want to power",
      "Details of existing electrical or solar equipment and available roof space",
    ],
  },
  {
    slug: "web-graphic-design",
    name: "Web & Graphic Design",
    label: "Design",
    art: "design",
    photo: "web-design" as ServicePhoto,
    intro: "Websites and graphic design for your business.",
    description:
      "Request a website or visual material that explains your business clearly on screen and in print.",
    short: "Help customers understand your business and get in touch.",
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
    exampleTitle: "Starting a local service business?",
    example:
      "You might need a website with your services, contact details and an enquiry form, plus matching visual material. Bring your logo and content, or tell us what still needs to be created.",
    quoteInfo: [
      "Your business name, audience and services",
      "Your existing website, logo and brand files, if available",
      "The pages or design items you need",
      "Your content, reference examples and preferred launch date",
    ],
  },
  {
    slug: "cloud-solutions",
    name: "Cloud Solutions",
    label: "Cloud",
    art: "cloud",
    photo: null,
    intro: "Cloud access for your files, tools and team.",
    description:
      "Discuss the cloud tools, files and access needs of your home or business with GIGI. We will clarify the work required before preparing a quote.",
    short: "Start with how you want to use and access your cloud tools.",
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
    exampleTitle: "Need to access work files from more than one place?",
    example:
      "A small business may want to discuss how staff access shared files at the office and when working elsewhere. Tell us which tools you use and how access is currently managed so we can discuss the requirement.",
    quoteInfo: [
      "The cloud platforms or tools you currently use",
      "The number of people who need access",
      "The files, workflows or access issues involved",
      "Your intended outcome and timing, without sharing passwords",
    ],
  },
];
export const quoteLink = (service?: string) =>
  `/contact${service ? `?service=${encodeURIComponent(service)}` : ""}`;
