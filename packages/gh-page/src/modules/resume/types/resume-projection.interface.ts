export interface ResumeProjection {
  title: string;
  github: string;
  historyId: number;
  companyName: string;
  companyStartDate: string;
  companyEndDate: string | null;
  website: string | null;
  companyDescription: string | null;
  logoId: number;
  src: string;
  alt: string;
  logoWidth: number;
  logoHeight: number;
  historyDetailId: number;
  historyDetailGroup: string | null;
  projectName: string;
  projectStartDate: string;
  projectEndDate: string | null;
  techList: string;
  historyDetailDescription: string | null;
}
