export interface ResumeProjection {
  companyId: number;
  companyName: string;
  companyStartDate: string;
  companyEndDate: string | null;
  companyWebsiteUrl: string | null;
  companyDescription: string | null;
  companyLogoSrc: string;
  companyLogoAlt: string;
  companyLogoWidth: number;
  companyLogoHeight: number;
  projectGroup: string | null;
  projectId: number;
  projectTitle: string;
  projectStartDate: string;
  projectEndDate: string | null;
  projectDescription: string | null;
  resumeProjectId: number;
  projectTechList: string;
}
