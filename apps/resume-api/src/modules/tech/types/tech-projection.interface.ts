import { TechLogo } from '@/enums/logo.enum';

export interface TechProjection {
  name: TechLogo;
  type: 'lang' | 'fe' | 'be' | 'tool' | 'db' | 'infra' | 'cloud' | 'cowork';
}
