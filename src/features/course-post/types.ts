export type DeliveryMode = "Online" | "In Person" | "Hybrid" | "Self-Paced";

export type CourseBenefit = "Online Access" | "Certificate" | "Lifetime Access";

export type CoursePostTemplate = {
  courseTitle: string;
  courseCategory: string;
  organizationIndustry: string;
  courseLevel: string;
  deliveryModes: DeliveryMode[];
  selectedDeliveryModes: DeliveryMode[];
  country: string;
  city: string;
  priceAmount: string;
  displayPriceInPost: boolean;
  benefits: CourseBenefit[];
  selectedBenefits: CourseBenefit[];
  skills: string[];
  learningOutcomes: string[];
  courseDescription: string;
  duration: string;
  maxStudents: string;
  startDate: string;
  endDate: string;
  instructorName: string;
  instructorBio: string;
};

export type CoursePostPayload = CoursePostTemplate;

export type SubmitCoursePostResponse = {
  id: string;
  status: "draft" | "published";
  message: string;
};
