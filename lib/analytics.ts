// Analytics event tracking stubs
// Replace console.log calls with your analytics provider (GA4, PostHog, Segment, Mixpanel, etc.)

type EventProperties = Record<string, string | number | boolean | string[]>;

function track(event: string, properties?: EventProperties) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${event}`, properties ?? '');
  }
}

export const analytics = {
  experienceStarted: () =>
    track('experience_started'),

  industrySelected: (industryId: string, industryLabel: string) =>
    track('industry_selected', { industryId, industryLabel }),

  challengeSelected: (challengeIds: string[]) =>
    track('challenge_selected', { challengeIds }),

  aiEmployeeRecommended: (employeeId: string, employeeRole: string) =>
    track('ai_employee_recommended', { employeeId, employeeRole }),

  aiEmployeeViewed: (employeeId: string, employeeRole: string) =>
    track('ai_employee_viewed', { employeeId, employeeRole }),

  aiEmployeeSelected: (employeeId: string, employeeRole: string) =>
    track('ai_employee_selected', { employeeId, employeeRole }),

  demoStarted: (role?: string, industryId?: string) =>
    track('demo_started', { role: role ?? 'default', industryId: industryId ?? 'default' }),

  messageSent: (text: string, sender: 'user' | 'ai') =>
    track('message_sent', { text, sender }),

  suggestedPromptClicked: (prompt: string, role?: string) =>
    track('demo_suggested_prompt_clicked', { prompt, role: role ?? 'default' }),

  demoLeadCaptureStarted: (role?: string) =>
    track('demo_lead_capture_started', { role: role ?? 'default' }),

  demoLeadCaptured: (role?: string, leadType?: string) =>
    track('demo_lead_captured', { role: role ?? 'default', leadType: leadType ?? 'general' }),

  demoCompleted: (role: string) =>
    track('demo_completed', { role }),

  leadFormOpened: (role: string) =>
    track('lead_form_opened', { role }),

  leadSubmitted: (businessType: string, role: string) =>
    track('lead_submitted', { businessType, role }),

  enquirySubmissionFailed: (businessType: string, error: string) =>
    track('enquiry_submission_failed', { businessType, error }),

  workflowCompleted: (businessType: string, role: string) =>
    track('workflow_completed', { businessType, role }),

  heroCTAClick: (cta: 'primary' | 'secondary') =>
    track('hero_cta_click', { cta }),

  consultationRequested: (businessType: string) =>
    track('consultation_requested', { businessType }),

  navCTAClick: (cta: 'book_demo' | 'build') =>
    track('nav_cta_click', { cta }),

  finalCTAClick: (cta: 'primary' | 'secondary') =>
    track('final_cta_click', { cta }),

  customEmployeeFormSubmitted: (businessType: string) =>
    track('custom_employee_form_submitted', { businessType }),
};
