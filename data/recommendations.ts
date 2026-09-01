import { RecommendationRule } from '@/types';

export const recommendationRules: RecommendationRule[] = [
  // Education
  {
    industryIds: ['education'],
    challengeIds: ['admissions', 'leads'],
    employeeIds: ['admission_counselor', 'receptionist'],
  },
  {
    industryIds: ['education'],
    challengeIds: ['support', 'enquiries', 'followup'],
    employeeIds: ['receptionist', 'customer_support'],
  },
  {
    industryIds: ['education'],
    challengeIds: ['appointments'],
    employeeIds: ['appointment_coordinator', 'admission_counselor'],
  },

  // Healthcare
  {
    industryIds: ['healthcare'],
    challengeIds: ['appointments', 'enquiries'],
    employeeIds: ['appointment_coordinator', 'receptionist'],
  },
  {
    industryIds: ['healthcare'],
    challengeIds: ['support'],
    employeeIds: ['receptionist', 'customer_support'],
  },
  {
    industryIds: ['healthcare'],
    challengeIds: ['leads'],
    employeeIds: ['lead_qualification', 'receptionist'],
  },

  // Restaurant
  {
    industryIds: ['restaurant'],
    challengeIds: ['appointments', 'enquiries'],
    employeeIds: ['appointment_coordinator', 'receptionist'],
  },
  {
    industryIds: ['restaurant'],
    challengeIds: ['support', 'followup'],
    employeeIds: ['customer_support', 'receptionist'],
  },
  {
    industryIds: ['restaurant'],
    challengeIds: ['leads'],
    employeeIds: ['sales_assistant', 'receptionist'],
  },

  // Professional Services
  {
    industryIds: ['professional_services'],
    challengeIds: ['leads', 'sales'],
    employeeIds: ['sales_assistant', 'lead_qualification'],
  },
  {
    industryIds: ['professional_services'],
    challengeIds: ['enquiries', 'support', 'followup'],
    employeeIds: ['receptionist', 'customer_support'],
  },
  {
    industryIds: ['professional_services'],
    challengeIds: ['appointments'],
    employeeIds: ['appointment_coordinator', 'sales_assistant'],
  },

  // Retail
  {
    industryIds: ['retail'],
    challengeIds: ['support', 'enquiries'],
    employeeIds: ['customer_support', 'receptionist'],
  },
  {
    industryIds: ['retail'],
    challengeIds: ['leads', 'sales', 'followup'],
    employeeIds: ['sales_assistant', 'lead_qualification'],
  },

  // Technology
  {
    industryIds: ['technology'],
    challengeIds: ['support', 'enquiries'],
    employeeIds: ['customer_support', 'receptionist'],
  },
  {
    industryIds: ['technology'],
    challengeIds: ['hr'],
    employeeIds: ['hr_assistant', 'receptionist'],
  },
  {
    industryIds: ['technology'],
    challengeIds: ['leads', 'sales'],
    employeeIds: ['lead_qualification', 'sales_assistant'],
  },

  // Real Estate
  {
    industryIds: ['real_estate'],
    challengeIds: ['leads', 'sales', 'followup'],
    employeeIds: ['lead_qualification', 'sales_assistant'],
  },
  {
    industryIds: ['real_estate'],
    challengeIds: ['enquiries', 'appointments'],
    employeeIds: ['receptionist', 'appointment_coordinator'],
  },

  // Other
  {
    industryIds: ['other'],
    challengeIds: ['enquiries', 'support'],
    employeeIds: ['receptionist', 'customer_support'],
  },
  {
    industryIds: ['other'],
    challengeIds: ['leads', 'sales'],
    employeeIds: ['sales_assistant', 'lead_qualification'],
  },
  {
    industryIds: ['other'],
    challengeIds: ['appointments'],
    employeeIds: ['appointment_coordinator'],
  },
  {
    industryIds: ['other'],
    challengeIds: ['hr'],
    employeeIds: ['hr_assistant'],
  },

  // HR challenge for all industries
  {
    industryIds: [
      'education', 'healthcare', 'restaurant', 'professional_services',
      'retail', 'technology', 'real_estate', 'other',
    ],
    challengeIds: ['hr'],
    employeeIds: ['hr_assistant'],
  },
];

/**
 * Returns recommended employee IDs based on selected industries and challenges.
 * Always appends 'custom' as the last option.
 */
export function getRecommendations(
  industryIds: string[],
  challengeIds: string[]
): string[] {
  const matched = new Set<string>();

  for (const rule of recommendationRules) {
    const industryMatch = rule.industryIds.some((id) => industryIds.includes(id));
    const challengeMatch = rule.challengeIds.some((id) => challengeIds.includes(id));

    if (industryMatch && challengeMatch) {
      rule.employeeIds.forEach((id) => matched.add(id));
    }
  }

  // Fallback: if nothing matched, show receptionist and customer_support
  if (matched.size === 0) {
    matched.add('receptionist');
    matched.add('customer_support');
  }

  // Always include custom at the end
  matched.add('custom');

  return Array.from(matched);
}
