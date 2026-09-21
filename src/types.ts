export interface SiteSettings {
  clinicNameBn: string;
  clinicNameEn: string;
  taglineBn: string;
  sloganBn: string;
  additionalMessageBn: string;
  heroHeadlineBn: string;
  heroDescriptionBn: string;
  ctaAppointmentTextBn: string;
  ctaCallTextBn: string;
  heroImages: string[];
  phones: string[];
  emergencyHotline: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
}

export interface DoctorProfile {
  nameBn: string;
  nameEn: string;
  qualifications: string;
  registrationNo: string;
  designation: string;
  designationBn: string;
  role: string;
  roleBn: string;
  bioBn: string;
  imageUrl: string;
  experienceYears: number;
}

export interface Treatment {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  icon: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  category?: string;
}

export interface Chamber {
  id: string;
  nameEn: string;
  nameBn: string;
  addressEn: string;
  addressBn: string;
  visitingDaysEn: string;
  visitingDaysBn: string;
  visitingHoursEn: string;
  visitingHoursBn: string;
  phone: string;
  mapUrl?: string;
}

export interface Article {
  id: string;
  titleBn: string;
  titleEn?: string;
  slug: string;
  category: string;
  contentBn: string;
  excerptBn: string;
  imageUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  fullName: string;
  phone: string;
  serviceName: string;
  problemDescription?: string;
  preferredChamber?: string;
  preferredDate?: string;
  status: 'pending' | 'contacted' | 'completed';
  createdAt: string;
  notes?: string;
}

export interface UserSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
  };
  expires: string;
}

export interface SiteData {
  settings: SiteSettings;
  doctor: DoctorProfile;
  treatments: Treatment[];
  chambers: Chamber[];
  articles: Article[];
  appointments: Appointment[];
}
