'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getOrCreateSessionId, resetSessionId } from '@/lib/sessionUtils';
import { createSession, fetchSession, saveStep1, saveStep2, saveStep3 } from '@/services/workflowService';
import { submitCustomerEnquiry } from '@/services/enquiryService';
import { recommendAIAgent } from '@/services/recommendationEngine';
import type { WorkflowState, CustomerDetails } from '@/types/workflow';
import { AIAgent } from '@/types/aiAgent';

// ─────────────────────────────────────────────────────────────
//  Context shape
// ─────────────────────────────────────────────────────────────

interface WorkflowContextValue extends WorkflowState {
  /** Set the selected business type in local state and invalidate downstream data */
  setBusinessType: (type: string) => void;
  /** Set optional custom description for business (e.g. if 'other' is selected) */
  setBusinessDescription: (desc: string) => void;
  /** Persist Step 1 selection to DB and advance current_step to 2 */
  commitStep1: () => Promise<void>;
  /** Step 1 saving & error states */
  step1Saving: boolean;
  step1Error: string | null;
  clearStep1Error: () => void;

  /** Toggle a business need in Step 2 */
  toggleNeed: (needId: string) => void;
  /** Replace the entire selected needs array */
  setSelectedNeeds: (needs: string[]) => void;
  /** Persist Step 2 selection to DB and advance current_step to 3 */
  commitStep2: () => Promise<void>;
  /** Step 2 saving & error states */
  step2Saving: boolean;
  step2Error: string | null;
  clearStep2Error: () => void;

  /** Set recommended agent in Step 3 */
  setRecommendedAgent: (agentId: string) => void;
  /** Manually switch to a different AI Agent */
  selectAgentManually: (agentId: string) => Promise<void>;
  /** Persist Step 3 selection to DB and advance current_step to 4 */
  commitStep3: (agentId?: string) => Promise<void>;
  /** Step 3 saving & error states */
  step3Saving: boolean;
  step3Error: string | null;
  clearStep3Error: () => void;

  /** Mark demo as completed in Step 4 */
  setDemoCompleted: (completed: boolean) => void;

  /** Step 5 customer details & enquiry submission */
  setCustomerDetails: (details: CustomerDetails) => void;
  commitEnquiry: (leadData: {
    fullName: string;
    businessName: string;
    email: string;
    phone: string;
    additionalDetails?: string;
    dynamicAnswers?: Record<string, any>;
  }) => Promise<void>;
  enquirySaving: boolean;
  enquiryError: string | null;
  clearEnquiryError: () => void;

  /** Start a brand new discovery workflow */
  resetWorkflow: () => Promise<void>;
}

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

// ─────────────────────────────────────────────────────────────
//  Provider Component
// ─────────────────────────────────────────────────────────────

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  // Workflow state
  const [businessType, setBusinessTypeState] = useState<string | null>(null);
  const [businessDescription, setBusinessDescription] = useState<string | null>(null);
  const [selectedNeeds, setSelectedNeedsState] = useState<string[]>([]);
  const [recommendedAgent, setRecommendedAgentState] = useState<string | null>(null);
  const [recommendationSource, setRecommendationSource] = useState<'automatic' | 'manual' | null>(null);
  const [alternativeAgents, setAlternativeAgents] = useState<AIAgent[]>([]);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [dynamicAnswers, setDynamicAnswers] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Async operation states
  const [step1Saving, setStep1Saving] = useState(false);
  const [step1Error, setStep1Error] = useState<string | null>(null);

  const [step2Saving, setStep2Saving] = useState(false);
  const [step2Error, setStep2Error] = useState<string | null>(null);

  const [step3Saving, setStep3Saving] = useState(false);
  const [step3Error, setStep3Error] = useState<string | null>(null);

  const [enquirySaving, setEnquirySaving] = useState(false);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);

  const isInitialMount = useRef(true);

  // ── 1. Initialise session on client mount ─────────────────────
  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    const id = getOrCreateSessionId();
    setSessionId(id);

    async function initSession() {
      try {
        let session = await fetchSession(id);
        if (!session) {
          session = await createSession(id);
        }

        if (session) {
          setBusinessTypeState(session.business_type);
          setBusinessDescription(session.business_description || null);
          setSelectedNeedsState(session.selected_needs ?? []);
          setRecommendedAgentState(session.recommended_agent);
          setRecommendationSource(session.recommendation_source ?? null);
          setDemoCompleted(session.demo_completed ?? false);
          setCurrentStep(session.current_step || 1);

          if (session.full_name) {
            setCustomerDetails({
              fullName: session.full_name,
              businessName: session.business_name ?? '',
              email: session.email ?? '',
              phone: session.phone ?? '',
              workflowDetails: session.workflow_details ?? '',
              dynamicAnswers: session.dynamic_answers ?? {},
            });
          }

          // Calculate initial recommendations if data exists
          if (session.business_type) {
            const rec = recommendAIAgent(session.business_type, session.selected_needs ?? [], session.business_description);
            setAlternativeAgents(rec.alternativeAgents);
            if (!session.recommended_agent) {
              setRecommendedAgentState(rec.primaryAgent.id);
            }
          }
        }
      } catch (err) {
        console.warn('[WorkflowContext] initSession error, using local fallback:', err);
      } finally {
        setSessionLoading(false);
      }
    }

    initSession();
  }, []);

  // ── Step 1: Business Type & Invalidation ──────────────────────
  const setBusinessType = useCallback((type: string) => {
    setBusinessTypeState((prev) => {
      if (prev !== type) {
        // Downstream Invalidation: changing business type invalidates needs, agent, and demo
        setSelectedNeedsState([]);
        setRecommendedAgentState(null);
        setRecommendationSource(null);
        setAlternativeAgents([]);
        setDemoCompleted(false);
      }
      return type;
    });
  }, []);

  const commitStep1 = useCallback(async () => {
    if (!sessionId || !businessType) return;
    setStep1Saving(true);
    setStep1Error(null);

    try {
      const updated = await saveStep1(sessionId, businessType, businessDescription || undefined);
      if (updated) {
        setCurrentStep(2);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save business type';
      setStep1Error(msg);
      throw err;
    } finally {
      setStep1Saving(false);
    }
  }, [sessionId, businessType, businessDescription]);

  const clearStep1Error = useCallback(() => setStep1Error(null), []);

  // ── Step 2: Dynamic Business Needs ───────────────────────────
  const toggleNeed = useCallback((needId: string) => {
    setSelectedNeedsState((prev) => {
      const exists = prev.includes(needId);
      const next = exists ? prev.filter((id) => id !== needId) : [...prev, needId];

      // Invalidate agent recommendation when needs change
      setRecommendedAgentState(null);
      setRecommendationSource(null);
      setDemoCompleted(false);

      return next;
    });
  }, []);

  const setSelectedNeeds = useCallback((needs: string[]) => {
    setSelectedNeedsState(needs);
    setRecommendedAgentState(null);
    setRecommendationSource(null);
    setDemoCompleted(false);
  }, []);

  const commitStep2 = useCallback(async () => {
    if (!sessionId || selectedNeeds.length === 0) return;
    setStep2Saving(true);
    setStep2Error(null);

    try {
      const updated = await saveStep2(sessionId, selectedNeeds);
      if (updated) {
        // Calculate new recommendations
        const rec = recommendAIAgent(businessType, selectedNeeds, businessDescription);
        setRecommendedAgentState(rec.primaryAgent.id);
        setAlternativeAgents(rec.alternativeAgents);
        setRecommendationSource('automatic');
        setCurrentStep(3);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save business needs';
      setStep2Error(msg);
      throw err;
    } finally {
      setStep2Saving(false);
    }
  }, [sessionId, selectedNeeds, businessType, businessDescription]);

  const clearStep2Error = useCallback(() => setStep2Error(null), []);

  // ── Step 3: AI Agent Recommendation ─────────────────────────
  const setRecommendedAgent = useCallback((agentId: string) => {
    setRecommendedAgentState(agentId);
    setRecommendationSource('automatic');
  }, []);

  const selectAgentManually = useCallback(
    async (agentId: string) => {
      setRecommendedAgentState(agentId);
      setRecommendationSource('manual');
      setDemoCompleted(false); // Reset demo status if agent switched

      if (sessionId) {
        try {
          await saveStep3(sessionId, agentId, 'manual');
        } catch (err) {
          console.warn('[WorkflowContext] selectAgentManually save failed:', err);
        }
      }
    },
    [sessionId]
  );

  const commitStep3 = useCallback(
    async (agentId?: string) => {
      if (!sessionId) return;
      const targetAgent = agentId || recommendedAgent;
      if (!targetAgent) return;

      setStep3Saving(true);
      setStep3Error(null);

      try {
        const updated = await saveStep3(sessionId, targetAgent, recommendationSource || 'automatic');
        if (updated) {
          setCurrentStep(4);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to save AI Agent';
        setStep3Error(msg);
        throw err;
      } finally {
        setStep3Saving(false);
      }
    },
    [sessionId, recommendedAgent, recommendationSource]
  );

  const clearStep3Error = useCallback(() => setStep3Error(null), []);

  // ── Step 5: Customer Enquiry Submission ──────────────────────
  const commitEnquiry = useCallback(
    async (leadData: {
      fullName: string;
      businessName: string;
      email: string;
      phone: string;
      additionalDetails?: string;
      dynamicAnswers?: Record<string, any>;
    }) => {
      if (!sessionId) return;
      setEnquirySaving(true);
      setEnquiryError(null);

      try {
        const res = await submitCustomerEnquiry({
          sessionId,
          fullName: leadData.fullName,
          businessName: leadData.businessName,
          email: leadData.email,
          phone: leadData.phone,
          businessType,
          businessDescription,
          selectedNeeds,
          recommendedAgent,
          additionalDetails: leadData.additionalDetails,
          dynamicAnswers: leadData.dynamicAnswers,
          demoCompleted: true,
        });

        if (res.success) {
          setCustomerDetails({
            fullName: leadData.fullName,
            businessName: leadData.businessName,
            email: leadData.email,
            phone: leadData.phone,
            workflowDetails: leadData.additionalDetails || '',
            dynamicAnswers: leadData.dynamicAnswers || {},
          });
          setDemoCompleted(true);
          setCurrentStep(5);
        } else {
          throw new Error(res.error || 'Failed to submit enquiry');
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Submission failed. Please try again.';
        setEnquiryError(msg);
        throw err;
      } finally {
        setEnquirySaving(false);
      }
    },
    [sessionId, businessType, businessDescription, selectedNeeds, recommendedAgent]
  );

  const clearEnquiryError = useCallback(() => setEnquiryError(null), []);

  // ── Reset Workflow for New Discovery ─────────────────────────
  const resetWorkflow = useCallback(async () => {
    const newSessionId = resetSessionId();
    setSessionId(newSessionId);
    setBusinessTypeState(null);
    setBusinessDescription(null);
    setSelectedNeedsState([]);
    setRecommendedAgentState(null);
    setRecommendationSource(null);
    setAlternativeAgents([]);
    setDemoCompleted(false);
    setCustomerDetails(null);
    setDynamicAnswers({});
    setCurrentStep(1);

    setStep1Error(null);
    setStep2Error(null);
    setStep3Error(null);
    setEnquiryError(null);

    try {
      await createSession(newSessionId);
    } catch (err) {
      console.warn('[WorkflowContext] resetWorkflow createSession failed:', err);
    }
  }, []);

  const value: WorkflowContextValue = {
    sessionId,
    sessionLoading,
    businessType,
    businessDescription,
    selectedNeeds,
    recommendedAgent,
    recommendationSource,
    alternativeAgents,
    demoCompleted,
    customerDetails,
    dynamicAnswers,
    currentStep,

    setBusinessType,
    setBusinessDescription,
    commitStep1,
    step1Saving,
    step1Error,
    clearStep1Error,

    toggleNeed,
    setSelectedNeeds,
    commitStep2,
    step2Saving,
    step2Error,
    clearStep2Error,

    setRecommendedAgent,
    selectAgentManually,
    commitStep3,
    step3Saving,
    step3Error,
    clearStep3Error,

    setDemoCompleted,

    setCustomerDetails,
    commitEnquiry,
    enquirySaving,
    enquiryError,
    clearEnquiryError,

    resetWorkflow,
  };

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
}

export function useWorkflow(): WorkflowContextValue {
  const ctx = useContext(WorkflowContext);
  if (!ctx) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return ctx;
}
