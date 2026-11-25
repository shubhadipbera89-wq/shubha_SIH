export const JHARKHAND_DISTRICTS = [
  "Bokaro",
  "Chatra",
  "Deoghar",
  "Dhanbad",
  "Dumka",
  "East Singhbhum",
  "Garhwa",
  "Giridih",
  "Godda",
  "Gumla",
  "Hazaribagh",
  "Jamtara",
  "Khunti",
  "Koderma",
  "Latehar",
  "Lohardaga",
  "Pakur",
  "Palamu",
  "Ramgarh",
  "Ranchi",
  "Sahibganj",
  "Seraikela-Kharsawan",
  "Simdega",
  "West Singhbhum"
] as const;

export type District = (typeof JHARKHAND_DISTRICTS)[number];

export const PROBLEM_CATEGORIES = [
  "Education",
  "Healthcare",
  "Agriculture",
  "Employment",
  "Environment",
  "Water & Sanitation",
  "Roads & Transport",
  "Digital Services",
  "Women & Child Development",
  "Rural Development",
  "Urban Development",
  "Tribal Development",
  "Tourism",
  "Energy",
  "Public Safety",
  "Other"
] as const;

export type Category = (typeof PROBLEM_CATEGORIES)[number];

export const USER_TYPES = [
  "Citizen",
  "Student",
  "Researcher",
  "University Faculty",
  "Industry Professional",
  "NGO",
  "Government Representative"
] as const;

export type UserType = (typeof USER_TYPES)[number];

export const CHALLENGE_STATUSES = [
  "Submitted",
  "Under Review",
  "Open for Solutions",
  "In Progress",
  "Implemented",
  "Resolved"
] as const;

export const SOLUTION_STATUSES = [
  "Submitted",
  "Under Review",
  "Shortlisted",
  "Pilot",
  "Implemented",
  "Rejected"
] as const;

export const BADGES = [
  {
    type: "Community Contributor",
    name: "Jan Sevak",
    description: "Reported 3+ verified societal challenges for Jharkhand",
    icon: "Users",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300"
  },
  {
    type: "Problem Solver",
    name: "Samadhan Karta",
    description: "Submitted an actionable solution shortlisted by university/industry",
    icon: "Lightbulb",
    color: "bg-amber-100 text-amber-800 border-amber-300"
  },
  {
    type: "Innovation Champion",
    name: "Navpravartan Ratna",
    description: "Achieved 100+ impact points through research & implementation",
    icon: "Award",
    color: "bg-purple-100 text-purple-800 border-purple-300"
  },
  {
    type: "Collaboration Leader",
    name: "Sahyog Ratna",
    description: "Built multi-disciplinary cross-sector project team",
    icon: "Handshake",
    color: "bg-blue-100 text-blue-800 border-blue-300"
  },
  {
    type: "Impact Maker",
    name: "Jharkhand Gaurav",
    description: "Successfully implemented a solution benefiting over 500+ citizens",
    icon: "ShieldCheck",
    color: "bg-rose-100 text-rose-800 border-rose-300"
  }
];

export const TAGLINE = "A digital crowdsourcing platform connecting citizens, universities and industry to identify, solve and implement real world societal challenges";
