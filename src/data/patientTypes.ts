import { Treatment } from '../types.js';

export type PatientType = 'male' | 'female' | 'child';

export interface PatientTypeOption {
  id: PatientType;
  labelBn: string;
  labelEn: string;
  descriptionBn: string;
  iconName: string;
}

export const PATIENT_TYPE_OPTIONS: PatientTypeOption[] = [
  {
    id: 'male',
    labelBn: 'পুরুষ (Male)',
    labelEn: 'Male',
    descriptionBn: 'পুরুষ সংক্রান্ত সাধারণ ও যৌন/প্রজনন স্বাস্থ্য সমস্যা',
    iconName: 'UserCheck'
  },
  {
    id: 'female',
    labelBn: 'মহিলা (Female)',
    labelEn: 'Female',
    descriptionBn: 'মাতৃস্বাস্থ্য, বন্ধ্যাত্ব, মাসিক ও হরমোনজনিত সমস্যা',
    iconName: 'Heart'
  },
  {
    id: 'child',
    labelBn: 'শিশু (Child)',
    labelEn: 'Child',
    descriptionBn: 'শিশুদের টনসিল, কৃমি, চর্মরোগ, সর্দি-কাশি ও রোগ প্রতিরোধ',
    iconName: 'Baby'
  }
];

// Map treatments to patient types
export function getTreatmentsByPatientType(treatments: Treatment[], patientType: PatientType | ''): Treatment[] {
  if (!patientType) return [];

  return treatments.filter((t) => {
    const title = (t.titleBn + ' ' + (t.titleEn || '') + ' ' + (t.category || '')).toLowerCase();

    if (patientType === 'male') {
      // Exclude exclusive female services
      if (
        title.includes('গর্ভকালীন') ||
        title.includes('মায়ের চিকিৎসা') ||
        title.includes('maternal') ||
        title.includes('মাসিক') ||
        title.includes('শ্বেতস্রাব') ||
        title.includes('জরায়ু') ||
        title.includes('menstrual') ||
        title.includes('uterine') ||
        title.includes('পিসিওএস') ||
        title.includes('pcos')
      ) {
        return false;
      }
      return true;
    }

    if (patientType === 'female') {
      // Exclude exclusive male services
      if (
        title.includes('পুরুষের') ||
        title.includes('শুক্রক্ষয়') ||
        title.includes('অণ্ডকোষ') ||
        title.includes('testicular') ||
        title.includes('male sexual')
      ) {
        return false;
      }
      return true;
    }

    if (patientType === 'child') {
      // For children: general, skin, tonsils, nasal polyps, immunity, digestion
      if (
        title.includes('যৌন') ||
        title.includes('অণ্ডকোষ') ||
        title.includes('বন্ধ্যাত্ব') ||
        title.includes('গর্ভকালীন') ||
        title.includes('জরায়ু') ||
        title.includes('মাসিক') ||
        title.includes('শ্বেতস্রাব')
      ) {
        return false;
      }
      return true;
    }

    return true;
  });
}
