import type { Icon as FeatherIcon } from 'react-feather';
import { BookOpen, CheckCircle, Info, Layers } from 'react-feather';

export type StepDef = {
  name: 'Info' | 'Modules' | 'Lessons' | 'Review';
  subTitle: string;
  icon: FeatherIcon;
};

export const COURSE_WIZARD_STEPS: StepDef[] = [
  { name: 'Info', subTitle: 'Course information', icon: Info },
  { name: 'Modules', subTitle: 'Course modules', icon: Layers },
  { name: 'Lessons', subTitle: 'Course lessons', icon: BookOpen },
  { name: 'Review', subTitle: 'Course review', icon: CheckCircle },
];
