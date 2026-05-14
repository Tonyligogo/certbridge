export type Course = {
  slug: string;
  title: string;
  category: string;
  duration: string;
  format: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  image: string;
};

export const courses: Course[] = [
  {
    slug: "leadership-essentials",
    title: "Leadership Essentials for New Managers",
    category: "Leadership",
    duration: "2 days",
    format: "Online or On-Site",
    level: "Beginner",
    description:
      "Equip first-time managers with the core skills to lead teams, give feedback, and drive performance.",
    image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
  },
  {
    slug: "customer-service-excellence",
    title: "Customer Service Excellence",
    category: "Customer Experience",
    duration: "1 day",
    format: "On-Site",
    level: "Beginner",
    description:
      "Practical techniques to deliver memorable service, handle complaints, and build customer loyalty.",
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
  },
  {
    slug: "strategic-sales",
    title: "Strategic B2B Sales",
    category: "Sales",
    duration: "3 days",
    format: "On-Site or Venue",
    level: "Intermediate",
    description:
      "A consultative selling framework for closing complex deals with corporate clients.",
    image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg",
  },
  {
    slug: "data-analytics-excel",
    title: "Data Analytics with Excel & Power BI",
    category: "Data & Analytics",
    duration: "4 days",
    format: "Online",
    level: "Intermediate",
    description:
      "From spreadsheets to dashboards — turn raw data into decisions that move the business.",
    image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg",
  },
  {
    slug: "project-management-pmp",
    title: "Project Management Fundamentals",
    category: "Operations",
    duration: "5 days",
    format: "Online or Venue",
    level: "Intermediate",
    description:
      "PMI-aligned framework covering scope, schedule, risk, and stakeholder management.",
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
  },
  {
    slug: "cybersecurity-awareness",
    title: "Cybersecurity Awareness for Teams",
    category: "Technology",
    duration: "1 day",
    format: "Online",
    level: "Beginner",
    description:
      "Protect your business from phishing, social engineering and data breaches.",
    image: "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg",
  },
  {
    slug: "hr-compliance-kenya",
    title: "HR Compliance in Kenya",
    category: "Human Resources",
    duration: "2 days",
    format: "On-Site",
    level: "Intermediate",
    description:
      "Stay compliant with the Employment Act, NSSF, NHIF, and labour relations best practices.",
    image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg",
  },
  {
    slug: "executive-communication",
    title: "Executive Communication & Presence",
    category: "Leadership",
    duration: "2 days",
    format: "Venue",
    level: "Advanced",
    description:
      "Speak with authority, present with clarity, and lead high-stakes conversations.",
    image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg",
  },
];