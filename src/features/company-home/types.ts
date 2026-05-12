export type CompanyStats = {
  reviewCount: string;
  rating: string;
  companyCount: string;
};

export type Testimonial = {
  text: string;
  name: string;
  role: string;
  company: string;
};

export type StrategyCard = {
  title: string;
  text: string;
};

export type CompanyHomeData = {
  stats: CompanyStats;
  efficientSolutions: string[];
  strategyCards: StrategyCard[];
  testimonials: Testimonial[];
};
