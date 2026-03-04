export interface Vacancy {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  type: string;
  deadline: string;
  detailDescription: string;
  responsibilities: string[];
  requirements: string[];
}

export const vacancies: Vacancy[] = [
  {
    id: "senior-import-logistics-coordinator",
    title: "Senior Import Logistics Coordinator",
    description:
      "Join our dynamic trade division to manage end-to-end global supply chains, ensuring seamless customs clearance and timely delivery of commercial and construction goods.",
    department: "Import & Trade Logistics",
    location: "Addis Ababa",
    type: "Full-time",
    deadline: "March 15, 2026",
    detailDescription:
      "As the Senior Import Logistics Coordinator at DS General PLC, you will be the backbone of our international trade operations. You will ensure that our imported electronics, IT equipment, and construction materials reach our clients and sites without delay.",
    responsibilities: [
      "Manage end-to-end import documentation, including Letters of Credit (LC), Bill of Lading, and Packing Lists.",
      "Liaise daily with the Ethiopian Customs Commission, ESLSE (Ethiopian Shipping and Logistics Services Enterprise), and transit agents.",
      "Track international shipments from global suppliers (China, Turkey, UAE, etc.) to the final destination in Ethiopia.",
      "Ensure compliance with all Ministry of Trade and Regional Integration regulations.",
    ],
    requirements: [
      "BA in Logistics, Supply Chain Management, Business Administration, or a related field.",
      "Minimum of 5 years of proven experience in import/export operations within Ethiopia.",
      "Deep understanding of Ethiopian customs procedures and tariff classifications.",
      "Excellent communication skills in Amharic and English.",
    ],
  },
  {
    id: "international-procurement-specialist",
    title: "International Procurement Specialist",
    description:
      "Be the bridge between our global manufacturing partners and our local Ethiopian market. Help us source the highest quality materials at the best competitive rates.",
    department: "Procurement & Sourcing",
    location: "Addis Ababa",
    type: "Part-time",
    deadline: "February 28, 2026",
    detailDescription:
      "As an International Procurement Specialist, you will work closely with global suppliers to negotiate and secure the best deals on electronics, sanitary equipment, and construction materials, ensuring DS General PLC maintains its competitive edge in the Ethiopian market.",
    responsibilities: [
      "Identify, evaluate, and build relationships with international suppliers and manufacturers.",
      "Negotiate pricing, lead times, and contract terms to secure optimal procurement agreements.",
      "Coordinate with the logistics team to ensure timely and cost-effective delivery of goods.",
      "Monitor global market trends to identify new sourcing opportunities and cost-saving strategies.",
    ],
    requirements: [
      "BA/MA in Procurement, Supply Chain Management, International Trade, or related field.",
      "Minimum of 3 years of experience in international procurement or sourcing.",
      "Strong negotiation skills and experience working with overseas manufacturers.",
      "Proficiency in English; knowledge of Mandarin, Turkish, or Arabic is a plus.",
    ],
  },
  {
    id: "civil-site-engineer",
    title: "Civil Site Engineer",
    description:
      "Bring our blueprints to life. Oversee on-site operations and ensure our construction projects meet strict quality standards using our premium, self-imported materials.",
    department: "Construction & Civil Works",
    location: "Addis Ababa",
    type: "Full-time",
    deadline: "March 5, 2026",
    detailDescription:
      "As a Civil Site Engineer at DS General PLC, you will oversee and manage active construction sites, ensuring all work is executed according to engineering plans, safety standards, and quality benchmarks using our premium, self-imported materials.",
    responsibilities: [
      "Supervise daily on-site construction activities and ensure adherence to project timelines.",
      "Review engineering drawings and specifications, and coordinate with architects and consultants.",
      "Manage material usage, especially imported construction supplies, to minimize waste.",
      "Ensure all works comply with Ethiopian building codes and safety regulations.",
    ],
    requirements: [
      "BSc in Civil Engineering or Construction Technology Management.",
      "Minimum of 4 years of hands-on site engineering experience in building construction.",
      "Strong knowledge of Ethiopian building codes, standards, and permit processes.",
      "Excellent problem-solving abilities and leadership skills.",
    ],
  },
];
