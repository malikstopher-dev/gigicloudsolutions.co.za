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
export const services = [
  {
    slug: "it-connectivity",
    name: "IT & Connectivity",
    label: "IT",
    art: "it",
    intro: "IT that works for your home and business.",
    description:
      "Ask GIGI about IT support, fibre, wired and wireless networks, and backups for your important files.",
    short: "Connect your devices and keep your files backed up.",
    items: ["IT services", "Fibre solutions", "Networking", "Data backup"],
    details: [
      "Tell us about a device, software or IT issue you need help with.",
      "Discuss fibre requirements for your home or business premises.",
      "Request a wired or wireless network for your devices and the rooms you use.",
      "Discuss which files need backing up, where they are stored and how you would restore them.",
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
    intro: "See your property. Manage access.",
    description:
      "CCTV, alarm systems, electric fencing and access control for homes and business premises.",
    short: "Plan coverage for entrances, shared spaces and boundaries.",
    items: ["CCTV", "Alarm systems", "Electric fencing", "Access control"],
    details: [
      "Discuss the entrances and areas you want to view, including lighting and camera positions.",
      "Request an alarm setup or discuss changes to an existing system.",
      "Tell us about the boundary you want to protect and any existing perimeter equipment.",
      "Discuss how residents, staff and visitors should enter your property.",
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
    intro: "Electrical and solar services for your property.",
    description:
      "Discuss electrical work or a solar system for your home or business, based on what you need to power.",
    short: "Start with your electrical needs and energy use.",
    items: ["Electrical services", "Solar systems"],
    details: [
      "Request electrical installation, maintenance or upgrade work. Describe the work and your existing setup.",
      "Discuss solar panels, an inverter and battery storage as part of a system scoped for your property.",
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
    intro: "Websites and graphic design for your business.",
    description:
      "Request a website or visual material that explains your business clearly on screen and in print.",
    short: "Help customers understand your business and get in touch.",
    items: ["Web design", "Graphic design"],
    details: [
      "Discuss a new website or a redesign, including the pages, content and enquiry actions you need.",
      "Request visual communication for your business, such as brand layouts and marketing material.",
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
    intro: "Talk to us about your cloud requirements.",
    description:
      "Discuss the cloud tools, files and access needs of your home or business with GIGI. We will clarify the work required before preparing a quote.",
    short: "Start with how you want to use and access your cloud tools.",
    items: ["Your cloud requirements", "Your current setup"],
    details: [
      "Tell us what you want to do in the cloud, who needs access and which files or tools are involved.",
      "Share the platforms you already use and the changes or issues you want to discuss. The service scope will be confirmed in your quotation.",
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
