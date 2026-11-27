export type JobCategory =
  | 'all'
  | 'public_interest'
  | 'capability'
  | 'community'
  | 'placement';

export type FontSizeLevel = 'normal' | 'large' | 'xlarge';

export type ActiveTab = 'jobs' | 'saved' | 'resume' | 'support' | 'applications';

export type WorkFilterKey =
  | 'age60Plus'
  | 'basicPension'
  | 'shortHours'
  | 'beginnerOk';

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  category: Exclude<JobCategory, 'all'>;
  categoryLabel: string;
  workplace: string;
  address: string;
  salaryText: string;
  workDays: string;
  workHours: string;
  deadline: string;
  isUrgent: boolean;
  isAge60Plus: boolean;
  isBasicPension: boolean;
  isShortHours: boolean;
  isBeginnerOk: boolean;
  eligibilityText: string;
  requiredDocuments: string[];
  summary: string;
  duties: string[];
  requirements: string[];
  benefits: string[];
  contactName: string;
  contactPhone: string;
}

export interface SimpleResume {
  name: string;
  birthYear: string;
  phone: string;
  desiredCategory: Exclude<JobCategory, 'all'>;
  preferredTime: string;
  careerSummary: string;
  certificates: string[];
  introduction: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  workplace: string;
  salaryText: string;
  applicantName: string;
  applicantPhone: string;
  memo: string;
  appliedAt: string;
  status: '지원 완료' | '담당자 확인 중';
}

export interface ConsultationRequest {
  id: string;
  name: string;
  phone: string;
  preferredTime: string;
  topic: string;
  createdAt: string;
}
