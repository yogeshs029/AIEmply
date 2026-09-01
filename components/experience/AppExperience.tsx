'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { StepId, AIEmployee } from '@/types';
import { AIAgent } from '@/types/aiAgent';
import { DemoChatMessage } from '@/types/demoChat';
import { getAIAgentById } from '@/config/aiAgents';
import { recommendAIAgent } from '@/services/recommendationEngine';
import { fetchDemoChatMessages, completeDemoSession } from '@/services/demoChatService';
import TopBar from './TopBar';
import WavyBackground from '../ui/WavyBackground';
import WelcomeScreen from './screens/WelcomeScreen';
import BusinessSelectorScreen from './screens/BusinessSelectorScreen';
import ChallengeSelectorScreen from './screens/ChallengeSelectorScreen';
import EmployeeRecommendationScreen from './screens/EmployeeRecommendationScreen';
import DemoChatScreen from './screens/DemoChatScreen';
import ResultsScreen from './screens/ResultsScreen';
import SuccessScreen from './screens/SuccessScreen';
import { analytics } from '@/lib/analytics';
import { AnimatePresence } from 'framer-motion';
import { WorkflowProvider, useWorkflow } from '@/store/WorkflowContext';

// ─────────────────────────────────────────────────────────────
//  Inner component — consumes WorkflowContext
// ─────────────────────────────────────────────────────────────
function AppExperienceInner() {
  const {
    sessionId,
    sessionLoading,
    businessType,
    businessDescription,
    setBusinessType,
    setBusinessDescription,
    commitStep1,
    step1Saving,
    step1Error,
    clearStep1Error,
    selectedNeeds,
    toggleNeed,
    setSelectedNeeds,
    commitStep2,
    step2Saving,
    step2Error,
    clearStep2Error,
    recommendedAgent,
    setRecommendedAgent,
    selectAgentManually,
    alternativeAgents,
    commitStep3,
    step3Saving,
    step3Error,
    clearStep3Error,
    setDemoCompleted,
    customerDetails,
    commitEnquiry,
    enquirySaving,
    enquiryError,
    clearEnquiryError,
    resetWorkflow,
  } = useWorkflow();

  const [currentStep, setCurrentStep] = useState<StepId>('industry');
  const [chatMessages, setChatMessages] = useState<DemoChatMessage[]>([]);

  // ── Load persisted chat history on mount or session change ────
  useEffect(() => {
    if (!sessionId) return;
    fetchDemoChatMessages(sessionId).then((msgs) => {
      if (msgs && msgs.length > 0) {
        setChatMessages(msgs);
      }
    });
  }, [sessionId]);

  // ── Step 3 Dynamic Recommendation Engine ─────────────────────
  const recommendation = useMemo(() => {
    return recommendAIAgent(businessType, selectedNeeds, businessDescription);
  }, [businessType, selectedNeeds, businessDescription]);

  // Active AI Agent: if manually/previously saved, use that; otherwise use recommendation winner
  const activeAgent: AIAgent = useMemo(() => {
    if (recommendedAgent) {
      return getAIAgentById(recommendedAgent);
    }
    return recommendation.primaryAgent;
  }, [recommendedAgent, recommendation.primaryAgent]);

  // Active alternatives
  const activeAlternatives: AIAgent[] = useMemo(() => {
    if (alternativeAgents && alternativeAgents.length > 0) {
      return alternativeAgents;
    }
    return recommendation.alternativeAgents;
  }, [alternativeAgents, recommendation.alternativeAgents]);

  // Convert AIAgent to AIEmployee shape for compatibility
  const activeEmployeeCompat: AIEmployee = useMemo(() => {
    return {
      id: activeAgent.id,
      role: activeAgent.role,
      tagline: activeAgent.tagline,
      description: activeAgent.description,
      capabilities: activeAgent.capabilities,
      detailedCapabilities: activeAgent.detailedCapabilities,
      avatar: activeAgent.avatar,
      badge: activeAgent.badge,
      icon: activeAgent.icon || 'star',
    };
  }, [activeAgent]);

  // ── Step 1 Handlers ──────────────────────────────────────────
  const handleStart = () => {
    analytics.experienceStarted();
    setCurrentStep('industry');
  };

  const handleSelectIndustry = useCallback(
    (id: string) => {
      setBusinessType(id);
      clearStep1Error();
    },
    [setBusinessType, clearStep1Error]
  );

  const handleIndustryNext = useCallback(async () => {
    if (!businessType || step1Saving) return;
    analytics.industrySelected(businessType, businessType);
    try {
      await commitStep1(); // persist to DB → advances context.currentStep to 2
      setCurrentStep('challenges');
    } catch {
      // Error already stored in step1Error — UI will display it
    }
  }, [businessType, step1Saving, commitStep1]);

  // ── Step 2 Handlers ──────────────────────────────────────────
  const handleToggleChallenge = useCallback(
    (id: string) => {
      toggleNeed(id);
      clearStep2Error();
    },
    [toggleNeed, clearStep2Error]
  );

  const handleChallengesNext = useCallback(async () => {
    if (selectedNeeds.length === 0 || step2Saving) return;
    analytics.challengeSelected(selectedNeeds);
    try {
      await commitStep2(); // persist to DB → advances context.currentStep to 3
      const rec = recommendAIAgent(businessType, selectedNeeds, businessDescription);
      setRecommendedAgent(rec.primaryAgent.id);
      analytics.aiEmployeeRecommended(rec.primaryAgent.id, rec.primaryAgent.role);
      setCurrentStep('recommendation');
    } catch {
      // Error already stored in step2Error — UI will display it
    }
  }, [selectedNeeds, step2Saving, commitStep2, businessType, businessDescription, setRecommendedAgent]);

  // ── Step 3 Handlers ──────────────────────────────────────────
  const handleSelectDifferentAgent = useCallback(
    async (agent: AIAgent) => {
      analytics.aiEmployeeSelected(agent.id, agent.role);
      await selectAgentManually(agent.id);
    },
    [selectAgentManually]
  );

  const handleTryDemo = useCallback(async () => {
    analytics.demoStarted(activeAgent.role, businessType || 'default');
    try {
      await commitStep3(activeAgent.id);
      setCurrentStep('demo');
    } catch {
      // Error already handled
    }
  }, [activeAgent, businessType, commitStep3]);

  // ── Step 4 Handlers ──────────────────────────────────────────
  const handleSendMessage = useCallback((msg: DemoChatMessage) => {
    setChatMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
  }, []);

  const handleCompleteDemo = useCallback(async () => {
    analytics.demoCompleted(activeAgent.role);
    setDemoCompleted(true);
    if (sessionId) {
      await completeDemoSession(sessionId);
    }
    setCurrentStep('results');
  }, [activeAgent, setDemoCompleted, sessionId]);

  // ── Step 5 Handlers ──────────────────────────────────────────
  const handleSubmitLead = useCallback(
    async (leadData: {
      name: string;
      businessName: string;
      email: string;
      phone: string;
      notes: string;
      dynamicAnswers?: Record<string, any>;
    }) => {
      try {
        await commitEnquiry({
          fullName: leadData.name,
          businessName: leadData.businessName,
          email: leadData.email,
          phone: leadData.phone,
          additionalDetails: leadData.notes,
          dynamicAnswers: leadData.dynamicAnswers,
        });
        analytics.leadSubmitted(businessType || 'other', activeAgent.role);
        setCurrentStep('success');
      } catch (err) {
        // Error captured in enquiryError
      }
    },
    [commitEnquiry, businessType, activeAgent]
  );

  const handleReset = useCallback(async () => {
    await resetWorkflow();
    setCurrentStep('industry');
    setChatMessages([]);
  }, [resetWorkflow]);

  // ── Loading skeleton while session initialises ───────────────
  if (sessionLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          background: 'var(--bg)',
          position: 'relative',
        }}
      >
        <WavyBackground />
        <TopBar currentStep="industry" onReset={() => {}} />
        <main
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              opacity: 0.45,
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '3px solid #D1D5DB',
                borderTopColor: '#111827',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500 }}>
              Loading your session…
            </span>
          </div>
        </main>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: 'var(--bg)',
        position: 'relative',
      }}
    >
      {/* 60fps Wavy Motion Canvas Background */}
      <WavyBackground />

      {/* Top Navigation */}
      <TopBar currentStep={currentStep} onReset={handleReset} />

      {/* Center Experience Workspace with AnimatePresence */}
      <main
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
        }}
      >
        <AnimatePresence mode="wait">
          {currentStep === 'welcome' && (
            <WelcomeScreen key="welcome" onStart={handleStart} />
          )}

          {currentStep === 'industry' && (
            <BusinessSelectorScreen
              key="industry"
              selectedIndustry={businessType}
              businessDescription={businessDescription || ''}
              onSelectIndustry={handleSelectIndustry}
              onChangeDescription={setBusinessDescription}
              onNext={handleIndustryNext}
              saving={step1Saving}
              saveError={step1Error}
              onClearError={clearStep1Error}
            />
          )}

          {currentStep === 'challenges' && (
            <ChallengeSelectorScreen
              key="challenges"
              industryId={businessType}
              selectedChallenges={selectedNeeds}
              onToggleChallenge={handleToggleChallenge}
              onBack={() => setCurrentStep('industry')}
              onNext={handleChallengesNext}
              saving={step2Saving}
              saveError={step2Error}
              onClearError={clearStep2Error}
            />
          )}

          {currentStep === 'recommendation' && (
            <EmployeeRecommendationScreen
              key="recommendation"
              agent={activeAgent}
              alternativeAgents={activeAlternatives}
              whyPoints={recommendation.whyPoints}
              recommendationSummary={recommendation.recommendationSummary}
              onTryDemo={handleTryDemo}
              onSelectDifferentAgent={handleSelectDifferentAgent}
              onBack={() => setCurrentStep('challenges')}
              saving={step3Saving}
              saveError={step3Error}
              onClearError={clearStep3Error}
            />
          )}

          {currentStep === 'demo' && (
            <DemoChatScreen
              key="demo"
              agent={activeAgent}
              businessType={businessType}
              businessDescription={businessDescription}
              selectedNeeds={selectedNeeds}
              sessionId={sessionId}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onBack={() => setCurrentStep('recommendation')}
              onCompleteDemo={handleCompleteDemo}
            />
          )}

          {currentStep === 'results' && (
            <ResultsScreen
              key="results"
              industryId={businessType || 'default'}
              employee={activeEmployeeCompat}
              agent={activeAgent}
              selectedNeeds={selectedNeeds}
              sessionId={sessionId}
              onSubmitLead={handleSubmitLead}
              onBack={() => setCurrentStep('demo')}
              submitting={enquirySaving}
              submitError={enquiryError}
              onClearError={clearEnquiryError}
            />
          )}

          {currentStep === 'success' && (
            <SuccessScreen
              key="success"
              customerName={customerDetails?.fullName}
              businessType={businessType}
              agentRole={activeAgent.role}
              selectedNeeds={selectedNeeds}
              onRestart={handleReset}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Public export — wraps the inner component with the provider
// ─────────────────────────────────────────────────────────────
export default function AppExperience() {
  return (
    <WorkflowProvider>
      <AppExperienceInner />
    </WorkflowProvider>
  );
}
