// =====================================================
//  Step 5 Dynamic Questions Configuration — AI Emply
// =====================================================

export interface DynamicQuestion {
  id: string;
  label: string;
  placeholder?: string;
  type: 'text' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
}

export const industryQuestionsMap: Record<string, DynamicQuestion[]> = {
  education: [
    {
      id: 'monthly_enquiries',
      label: 'Approximately how many student enquiries do you receive monthly?',
      type: 'select',
      options: [
        { value: 'under_100', label: 'Under 100 enquiries / month' },
        { value: '100_500', label: '100 – 500 enquiries / month' },
        { value: '500_2000', label: '500 – 2,000 enquiries / month' },
        { value: '2000_plus', label: '2,000+ enquiries / month' },
      ],
    },
    {
      id: 'current_process',
      label: 'What is your current student inquiry & admission process?',
      type: 'text',
      placeholder: 'e.g. Phone calls, website forms, and WhatsApp inquiries handled manually by staff',
    },
  ],

  restaurant: [
    {
      id: 'contact_channels',
      label: 'How do customers currently reach you for reservations and queries?',
      type: 'select',
      options: [
        { value: 'phone_calls', label: 'Mostly direct phone calls' },
        { value: 'whatsapp_social', label: 'WhatsApp & Instagram DMs' },
        { value: 'online_forms', label: 'Website reservation widget' },
        { value: 'mixed', label: 'A mix of phone, chat, and walk-ins' },
      ],
    },
    {
      id: 'primary_need_scope',
      label: 'Do you need help with reservations, general enquiries, or both?',
      type: 'select',
      options: [
        { value: 'both', label: 'Both table bookings & customer FAQs (Recommended)' },
        { value: 'reservations_only', label: 'Primarily table reservations' },
        { value: 'faqs_only', label: 'Primarily menu & operational FAQs' },
      ],
    },
  ],

  healthcare: [
    {
      id: 'monthly_patient_volume',
      label: 'What is your approximate monthly patient appointment volume?',
      type: 'select',
      options: [
        { value: 'under_150', label: 'Under 150 appointments / month' },
        { value: '150_500', label: '150 – 500 appointments / month' },
        { value: '500_1500', label: '500 – 1,500 appointments / month' },
        { value: '1500_plus', label: '1,500+ appointments / month' },
      ],
    },
    {
      id: 'reminder_preference',
      label: 'Do you want automated SMS / WhatsApp appointment reminders?',
      type: 'select',
      options: [
        { value: 'yes_both', label: 'Yes, both SMS & WhatsApp reminders' },
        { value: 'yes_whatsapp', label: 'Yes, WhatsApp reminders' },
        { value: 'no', label: 'Not at this time' },
      ],
    },
  ],

  real_estate: [
    {
      id: 'monthly_property_leads',
      label: 'How many property inquiries do you typically receive each month?',
      type: 'select',
      options: [
        { value: 'under_50', label: 'Under 50 inquiries / month' },
        { value: '50_200', label: '50 – 200 inquiries / month' },
        { value: '200_1000', label: '200 – 1,000 inquiries / month' },
        { value: '1000_plus', label: '1,000+ inquiries / month' },
      ],
    },
    {
      id: 'buyer_qualification_mode',
      label: 'Do you want the Agent to qualify buyer budgets before scheduling visits?',
      type: 'select',
      options: [
        { value: 'yes_budget_timeline', label: 'Yes, qualify budget & timeline (Recommended)' },
        { value: 'direct_booking', label: 'Directly schedule site visits without pre-qualification' },
      ],
    },
  ],

  retail: [
    {
      id: 'store_format',
      label: 'Do you operate an online store, physical retail, or both?',
      type: 'select',
      options: [
        { value: 'ecommerce_only', label: 'Online / E-commerce only' },
        { value: 'physical_only', label: 'Physical store / showroom only' },
        { value: 'omnichannel', label: 'Both online store and retail outlets' },
      ],
    },
    {
      id: 'primary_retail_challenge',
      label: 'What is your primary customer communication challenge?',
      type: 'text',
      placeholder: 'e.g. Answering order status queries and product recommendations during peak hours',
    },
  ],

  technology: [
    {
      id: 'demo_booking_requirement',
      label: 'Do you need the Agent to book live product demos into sales calendars?',
      type: 'select',
      options: [
        { value: 'yes_integrated', label: 'Yes, integrated with Google Calendar / Calendly' },
        { value: 'lead_capture_only', label: 'No, just capture qualified prospect details' },
      ],
    },
    {
      id: 'current_stack',
      label: 'What CRM or Helpdesk tools do you use? (Optional)',
      type: 'text',
      placeholder: 'e.g. HubSpot, Salesforce, Zendesk, or Slack',
    },
  ],

  professional_services: [
    {
      id: 'consultation_booking_mode',
      label: 'Do you currently book client consultations manually?',
      type: 'select',
      options: [
        { value: 'manual', label: 'Yes, booked manually via email/phone' },
        { value: 'semi_automated', label: 'Semi-automated via scheduling links' },
        { value: 'looking_to_automate', label: 'Looking to automate completely with AI' },
      ],
    },
    {
      id: 'common_inquiry_type',
      label: 'What type of client inquiries do you receive most often?',
      type: 'text',
      placeholder: 'e.g. Initial advisory quotes, practice area eligibility, and retainer inquiries',
    },
  ],

  other: [
    {
      id: 'monthly_volume',
      label: 'Approximately how many customer inquiries do you receive each month?',
      type: 'select',
      options: [
        { value: 'under_100', label: 'Under 100 inquiries / month' },
        { value: '100_500', label: '100 – 500 inquiries / month' },
        { value: '500_2000', label: '500 – 2,000 inquiries / month' },
        { value: '2000_plus', label: '2,000+ inquiries / month' },
      ],
    },
    {
      id: 'primary_goal',
      label: 'What is the primary task you want your AI Agent to handle?',
      type: 'text',
      placeholder: 'e.g. 24/7 lead capture, answering operational FAQs, booking consultations',
    },
  ],
};

export function getDynamicQuestionsForIndustry(industryId: string): DynamicQuestion[] {
  return industryQuestionsMap[industryId] || industryQuestionsMap.other;
}
