import type {
  CompanyProfile,
  TeamMember,
} from "@/features/company-profile/types";
import type { CompanyAccountSettings } from "@/features/company-settings/types";
import type { JobPostTemplate } from "@/features/job-post/types";
import type { CoursePostTemplate } from "@/features/course-post/types";
import type { CompanyHomeData } from "@/features/company-home/types";
import type { ApiResponse } from "@/lib/apiClient/types";

// ─── Shared Utilities ──────────────────────────────────────────────
export const wait = async (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export const createResponse = <T>(
  data: T,
  overrides?: Partial<ApiResponse<T>>,
): ApiResponse<T> => ({
  success: true,
  data,
  ...overrides,
});

export const createError = <T>(message: string): ApiResponse<T> => ({
  success: false,
  data: undefined as T,
  error: message,
});

export const fileToDataUrl = async (file: File): Promise<string> => {
  if (typeof FileReader !== "undefined") {
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  if (typeof Buffer !== "undefined") {
    const buffer = await file.arrayBuffer();
    return `data:${file.type};base64,${Buffer.from(buffer).toString("base64")}`;
  }

  throw new Error("File processing is not supported in this environment.");
};

// ─── Company Profile ────────────────────────────────────────────────
export let mockProfile: CompanyProfile = {
  id: "company-1",
  companyName: "BMW",
  industry: "Automotive",
  foundedYear: "1916",
  location: "Munich, Germany",
  companySize: "30000",
  email: "anaamiri@gmail.com",
  phone: "+1 (555) 123-4567",
  website: "www.bmw.com",
  description:
    "BMW is synonymous with engineering excellence, consistently aiming for unrivaled in precision, performance, and technological innovation across its diverse range of products.",
  socialLinks: {
    linkedin: "https://linkedin.com/company/bmw",
    facebook: "https://facebook.com/bmw",
    instagram: "https://instagram.com/company/bmw",
    x: "https://x.com/bmw",
  },
  logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",
  photos: [],
  teamMembers: [],
};

export const setMockProfile = (profile: CompanyProfile) => {
  mockProfile = profile;
};

// ─── Company Account Settings ─────────────────────────────────────
export let mockCompanySettings: CompanyAccountSettings = {
  id: "company-settings-1",
  companyName: "Joblin Labs",
  legalName: "Joblin Labs LLC",
  industry: "Recruiting Software",
  companySize: "51-200",
  website: "https://joblin.com",
  headquarters: "Austin, TX",
  description:
    "Joblin helps hiring teams build modern talent pipelines with fast, structured workflows.",
  logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",
  accountStatus: "active",
  primaryContact: {
    fullName: "Hannah Reed",
    role: "Head of People",
    email: "hannah.reed@joblin.com",
    phone: "+1 (555) 901-3476",
  },
  supportEmail: "support@joblin.com",
  supportPhone: "+1 (555) 880-1179",
  notifications: {
    applicantUpdates: true,
    interviewReminders: true,
    weeklyReports: true,
    productUpdates: false,
    marketingUpdates: false,
  },
  security: {
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeoutMinutes: 60,
  },
  preferences: {
    timeZone: "America/Chicago",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
  },
  team: {
    defaultRole: "Recruiter",
    allowInvites: true,
    requireAdminApproval: true,
  },
  billing: {
    planName: "Growth",
    billingEmail: "billing@joblin.com",
    paymentMethodLast4: "Visa **** 4242",
    nextBillingDate: "2026-06-01",
  },
};

export const setMockCompanySettings = (settings: CompanyAccountSettings) => {
  mockCompanySettings = settings;
};

// ─── Job Post Template ──────────────────────────────────────────────
export let mockJobPostTemplate: JobPostTemplate = {
  jobTitle: "User interface Designer (UI Designer)",
  jobCategory: "Please type your job category",
  organizationIndustry: "Please type your organization industry",
  organizationalLevel: "Please type your Organizational level",
  department: "Please type your Deoartment",
  employmentTypes: [
    "Full-time",
    "Part-time",
    "Remote",
    "On-Site",
    "Hybrid",
    "Internship",
  ],
  selectedEmploymentTypes: ["Full-time", "Remote"],
  country: "Iran",
  city: "Tehran",
  selectedLocations: ["Tehran/Iran"],
  minimumSalaryAmount: "5000",
  displaySalaryInPost: true,
  selectedSalaryBadges: ["Displaying salary in the job post", "5000$"],
  experienceLevels: [
    "No experience",
    "Less than 1 year",
    "1-3 year",
    "+3 year",
  ],
  selectedExperienceLevels: ["Less than 1 year"],
  experiencePreferences: [
    "Experience in sales, shopping centers, or stores is preferred",
    "Accepting interns and beginners",
  ],
  selectedExperiencePreferences: [
    "Experience in sales, shopping centers, or stores is preferred",
  ],
  languageSkills: [{ field: "English", level: "Advance" }],
  softwareSkills: [{ field: "Graphic Software", level: "junior" }],
  communicationSkills: [
    "Conflict Resolution Skill",
    "Collabration Skill",
    "Time management",
    "Interpersonal skill",
    "Adaptability",
  ],
  selectedCommunicationSkills: ["Collabration Skill", "Time management"],
  workingHoursAndDays: "Saturday to Wendsday 12 AM to 18 PM",
  jobDescriptionAndRequiredSkills:
    "We are looking for a Frontend Developer (React.js) to join our team. Your role will involve building and maintaining scalable web applications, collaborating with designers to create stunning user interfaces, and optimizing performance for a seamless user experience.",
};

export const setMockJobPostTemplate = (template: JobPostTemplate) => {
  mockJobPostTemplate = template;
};

// ─── Course Post Template ────────────────────────────────────────────
export let mockCoursePostTemplate: CoursePostTemplate = {
  courseTitle: "",
  courseCategory: "",
  organizationIndustry: "",
  courseLevel: "",
  deliveryModes: ["Online", "In Person", "Hybrid", "Self-Paced"],
  selectedDeliveryModes: [],
  country: "",
  city: "",
  priceAmount: "",
  displayPriceInPost: false,
  benefits: ["Online Access", "Certificate", "Lifetime Access"],
  selectedBenefits: [],
  skills: [],
  learningOutcomes: [],
  courseDescription: "",
  duration: "",
  maxStudents: "",
  startDate: "",
  endDate: "",
  instructorName: "",
  instructorBio: "",
};

export const setMockCoursePostTemplate = (template: CoursePostTemplate) => {
  mockCoursePostTemplate = template;
};

// ─── Company Home ───────────────────────────────────────────────────
export const mockCompanyHomeData: CompanyHomeData = {
  stats: {
    reviewCount: "1M",
    rating: "4.6",
    companyCount: "2K",
  },
  efficientSolutions: [
    "Robust Resume Search",
    "Flexible and Performance",
    "Efficient Recruiting Process",
    "Increase your visibility",
  ],
  strategyCards: [
    {
      title: "Candidate Sourcing",
      text: "Candidate sourcing is a crucial step in the hiring process, allowing companies to identify and connect with potential candidates before they even apply for a position. This feature enables recruiters to proactively search for talent by leveraging professional networks, resume databases, AI-powered matching algorithms, and targeted outreach campaigns.",
    },
    {
      title: "Tech Job Posts",
      text: "Technology-related job postings require a different approach than traditional job listings due to the highly competitive nature of the tech industry. This feature ensures that job openings are distributed effectively across relevant platforms, including specialized job boards, tech communities, and social media networks where skilled professionals actively search for new opportunities.",
    },
    {
      title: "Career Events",
      text: "Career events provide a unique opportunity for companies to interact with potential employees in a real-time, engaging environment. This feature supports businesses in organizing and participating in job fairs, networking sessions, industry conferences, and virtual hiring events.",
    },
    {
      title: "Perm Sourcing",
      text: "Not all hiring needs are permanent, and businesses often require flexibility in workforce management. This feature enables companies to find and onboard both contract-based and full-time employees through a streamlined process. Recruiters can access a diverse talent pool of freelancers, temporary workers, consultants, and long-term hires, ensuring they meet project-specific requirements efficiently. Additionally, automated contract management and compliance tools simplify administrative tasks, making it easier to handle multiple hiring models within a single system.",
    },
  ],
  testimonials: [
    {
      text: "I had a great experience using this job portal! The application process was smooth, and I was able to find several relevant opportunities in no time.",
      name: "Albert Flores",
      role: "HR",
      company: "Warephase",
    },
    {
      text: "I'm so happy with the results! I found multiple job listings that matched my skills and interests. The website is easy to navigate, and I received timely updates on my applications.",
      name: "Jane Cooper",
      role: "Product Manager",
      company: "Iselectrics",
    },
    {
      text: "This platform made my job search so much easier. I appreciated the variety of jobs available, and the search filters really helped me find the right fit quickly.",
      name: "Floyd Miles",
      role: "Product Manager",
      company: "Toughzap",
    },
  ],
};
