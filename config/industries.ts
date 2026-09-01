// =====================================================
//  Industry Configuration — AI Emply
// =====================================================

export interface IndustryConfig {
  id: string;
  label: string;
  tagline: string;
  description: string;
  icon: string;
  placeholderDescription?: string;
}

export const industriesConfig: IndustryConfig[] = [
  {
    id: 'education',
    label: 'Education',
    tagline: 'Universities, Colleges, EdTech & Institutes',
    description: 'Admissions counseling, course guidance, campus queries & student support.',
    icon: 'education',
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    tagline: 'Clinics, Hospitals & Wellness Practices',
    description: 'Patient coordination, appointment bookings & general clinic information.',
    icon: 'healthcare',
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    tagline: 'Dining, Cafes, Bars & Catering',
    description: 'Table reservations, menu questions, hours & guest inquiries.',
    icon: 'restaurant',
  },
  {
    id: 'professional_services',
    label: 'Professional Services',
    tagline: 'Consulting, Legal, Accounting & Agencies',
    description: 'Client intake, consultation scheduling, FAQ routing & lead capture.',
    icon: 'professional_services',
  },
  {
    id: 'retail',
    label: 'Retail',
    tagline: 'E-commerce, Boutiques & Physical Stores',
    description: 'Product queries, order status, return policies & purchase guidance.',
    icon: 'retail',
  },
  {
    id: 'technology',
    label: 'Technology',
    tagline: 'SaaS, Software & Digital Platforms',
    description: 'Technical FAQs, product onboarding, demo requests & ticket triage.',
    icon: 'technology',
  },
  {
    id: 'real_estate',
    label: 'Real Estate',
    tagline: 'Agencies, Developers & Property Managers',
    description: 'Property inquiries, site visit booking, buyer qualification & listings.',
    icon: 'real_estate',
  },
  {
    id: 'other',
    label: 'Other',
    tagline: 'Custom Workflows & Emerging Industries',
    description: 'Automated 24/7 business communication tailored to your unique operations.',
    icon: 'other',
    placeholderDescription: 'e.g. We are a logistics firm managing warehouse bookings and freight enquiries...',
  },
];

export function getIndustryConfig(id: string): IndustryConfig {
  return industriesConfig.find((i) => i.id === id) || industriesConfig[industriesConfig.length - 1];
}
