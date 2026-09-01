// =====================================================
//  Workflow Types — AI Emply Session & State
// =====================================================

import { AIAgent } from './aiAgent';

/** The full session record as stored in PostgreSQL / Local storage */
export interface AIEmplySession {
  id: string;
  session_id: string;
  business_type: string | null;
  business_description?: string | null;
  selected_needs: string[] | null;
  recommended_agent: string | null;
  recommendation_source?: 'automatic' | 'manual' | null;
  demo_completed: boolean;
  full_name: string | null;
  business_name: string | null;
  email: string | null;
  phone: string | null;
  workflow_details: string | null;
  dynamic_answers?: Record<string, any> | null;
  current_step: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  created_at: string;
  updated_at: string;
}

/** Centralized workflow state held in React Context */
export interface WorkflowState {
  /** The anonymous session ID (UUID, stored in localStorage) */
  sessionId: string | null;
  /** Whether the session is being fetched on initial load */
  sessionLoading: boolean;
  /** Step 1: Business type & optional custom description */
  businessType: string | null;
  businessDescription?: string | null;
  /** Step 2: Dynamic selected needs */
  selectedNeeds: string[];
  /** Step 3: Recommended primary & alternative agents */
  recommendedAgent: string | null;
  recommendationSource: 'automatic' | 'manual' | null;
  alternativeAgents?: AIAgent[];
  /** Step 4: Demo interaction status */
  demoCompleted: boolean;
  /** Step 5: Customer details & dynamic answers */
  customerDetails: CustomerDetails | null;
  dynamicAnswers?: Record<string, any>;
  /** Which step the user is on */
  currentStep: number;
}

export interface CustomerDetails {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  workflowDetails: string;
  dynamicAnswers?: Record<string, any>;
}

/** Return shape from session API routes */
export interface SessionApiResponse {
  success: boolean;
  session?: AIEmplySession;
  error?: string;
}

/** Payload to create a new session */
export interface CreateSessionPayload {
  sessionId: string;
}

/** Payload to update a session after Step 1 */
export interface UpdateStep1Payload {
  sessionId: string;
  businessType: string;
  businessDescription?: string;
}

/** Payload to update a session after Step 2 */
export interface UpdateStep2Payload {
  sessionId: string;
  selectedNeeds: string[];
}

/** Payload to update a session after Step 3 */
export interface UpdateStep3Payload {
  sessionId: string;
  recommendedAgent: string;
  recommendationSource?: 'automatic' | 'manual';
}
