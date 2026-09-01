import { AIAgent, RecommendationResult } from '@/types/aiAgent';
import { agentCatalog, getAgentById } from '@/config/agentCatalog';
import { businessNeedsCatalog } from '@/config/businessNeeds';
import { getIndustryConfig } from '@/config/industries';

/**
 * Normalizes need ID aliases so that generic and specific need tags map cleanly
 */
const NEED_ALIAS_MAP: Record<string, string[]> = {
  admissions: ['admissions', 'student_enquiries', 'course_info', 'fee_enquiries'],
  student_enquiries: ['student_enquiries', 'parent_enquiries', 'student_support'],
  table_reservations: ['table_reservations', 'rest_followups'],
  menu_questions: ['menu_questions', 'order_support', 'rest_customer_enquiries'],
  appointment_booking_health: ['appointment_booking_health', 'appointment_reminders', 'followup_coordination'],
  patient_enquiries: ['patient_enquiries', 'clinic_info', 'faq_health', 'reception_support'],
  property_enquiries: ['property_enquiries', 'property_info', 'rental_enquiries', 'sales_enquiries_re'],
  site_visits: ['site_visits', 're_followups', 'buyer_qualification'],
  product_questions: ['product_questions', 'product_recommendations', 'order_enquiries'],
  lead_qual_tech: ['lead_qual_tech', 'sales_enquiries_tech', 'demo_booking_tech'],
  client_enquiries: ['client_enquiries', 'consultation_requests', 'service_info_prof', 'lead_capture_prof'],
  general_enquiries: ['general_enquiries', 'general_info', 'general_support'],
  general_lead_capture: ['general_lead_capture', 'general_followups', 'workflow_automation'],
};

/**
 * Checks if an agent's supportedNeeds matches a user's selected need
 */
function doesAgentMatchNeed(agent: AIAgent, selectedNeedId: string): boolean {
  if (agent.supportedNeeds.includes(selectedNeedId)) return true;

  const aliases = NEED_ALIAS_MAP[selectedNeedId] || [selectedNeedId];
  return aliases.some((alias) => agent.supportedNeeds.includes(alias));
}

/**
 * Dynamic AI Workforce Recommendation Engine
 */
export function recommendAIAgent(
  businessType?: string | null,
  selectedNeeds: string[] = [],
  businessDescription?: string | null
): RecommendationResult {
  const normBiz = (businessType || '').toLowerCase().trim();
  const descLower = (businessDescription || '').toLowerCase();

  // Score each candidate agent
  const scored = agentCatalog.map((agent) => {
    let score = 0;
    const matchedNeeds: string[] = [];

    // 1. Industry Match (+10 points)
    const isIndustryMatch = agent.industries.includes(normBiz);
    if (isIndustryMatch) {
      score += 10;
    }

    // 2. Need Matches (+5 points per matched need)
    for (const needId of selectedNeeds) {
      if (doesAgentMatchNeed(agent, needId)) {
        score += 5;
        matchedNeeds.push(needId);
      }
    }

    // 3. Business Description Keyword Match (+3 points each)
    if (descLower) {
      if (descLower.includes(agent.role.toLowerCase())) score += 6;
      if (agent.capabilities.some((cap) => descLower.includes(cap.toLowerCase().slice(0, 8)))) {
        score += 3;
      }
    }

    // Priority bonus
    score += (agent.priority || 5) * 0.1;

    return {
      agent,
      score,
      matchedNeedsCount: matchedNeeds.length,
      matchedNeeds,
      isIndustryMatch,
      specificity: agent.industries.length,
    };
  });

  // Sort deterministically
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.matchedNeedsCount !== a.matchedNeedsCount) return b.matchedNeedsCount - a.matchedNeedsCount;
    // Prefer specialized agent over universal agent
    if (a.specificity !== b.specificity) return a.specificity - b.specificity;
    return (b.agent.priority || 5) - (a.agent.priority || 5);
  });

  const winner = scored[0]?.agent || agentCatalog[0];
  const rankedAgents = scored.map((s) => s.agent);

  // Top alternative agents (excluding the primary winner)
  const alternativeAgents = rankedAgents.filter((a) => a.id !== winner.id).slice(0, 3);

  // Generate dynamic "Why this AI Agent?" reasoning bullets
  const industryLabel = getIndustryConfig(normBiz).label;
  const needLabels = selectedNeeds
    .map((id) => businessNeedsCatalog.find((n) => n.id === id)?.label)
    .filter(Boolean) as string[];

  const whyPoints: string[] = [];

  if (winner.industries.includes(normBiz) && normBiz !== 'other') {
    whyPoints.push(`Specifically designed for the ${industryLabel} industry.`);
  }

  if (needLabels.length > 0) {
    const topNeeds = needLabels.slice(0, 3).join(', ');
    whyPoints.push(`Pre-configured to handle ${topNeeds}.`);
  }

  whyPoints.push(
    `Equipped with automated 24/7 lead qualification and contact capture.`,
    `Reduces response times from hours to seconds for every incoming customer.`
  );

  const primaryNeedText = needLabels.length > 0 ? needLabels.slice(0, 3).join(', ') : 'customer communication';
  const recommendationSummary = `We recommend the ${winner.role} because your ${industryLabel} business needs help with ${primaryNeedText}.`;

  return {
    primaryAgent: winner,
    alternativeAgents,
    rankedAgents,
    score: scored[0]?.score || 10,
    whyPoints,
    matchedNeedsCount: scored[0]?.matchedNeedsCount || 0,
    recommendationSummary,
  };
}

export { getAgentById };
