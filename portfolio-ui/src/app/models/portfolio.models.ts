export interface PersonInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedInUrl: string;
  gitHubUrl: string;
  summary: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  highlights: string[];
}

export interface Education {
  institution: string;
  degree: string;
  years: string;
}

export interface Certification {
  name: string;
  code: string;
}

export interface PortfolioData {
  person: PersonInfo;
  skills: Skill[];
  experiences: Experience[];
  educations: Education[];
  certifications: Certification[];
}

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}
