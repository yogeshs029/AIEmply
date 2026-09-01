// =====================================================
//  Customer Enquiry Types — AI Emply Step 5
// =====================================================

export interface CustomerEnquiryPayload {
  sessionId: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  businessType?: string | null;
  businessDescription?: string | null;
  selectedNeeds?: string[];
  recommendedAgent?: string | null;
  additionalDetails?: string;
  dynamicAnswers?: Record<string, any>;
  demoCompleted?: boolean;
}

export interface CustomerEnquiryRecord {
  id: string;
  session_id: string;
  full_name: string;
  business_name: string;
  email: string;
  phone: string;
  business_type: string | null;
  business_description?: string | null;
  selected_needs: string[] | null;
  recommended_agent: string | null;
  additional_details: string | null;
  dynamic_answers?: Record<string, any> | null;
  demo_completed: boolean;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface EnquirySubmissionResponse {
  success: boolean;
  enquiry?: CustomerEnquiryRecord;
  isDuplicate?: boolean;
  error?: string;
}
