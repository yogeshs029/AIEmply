import {
  ChatEngine,
  DemoChatContext,
  DemoChatResponse,
  DemoChatMessage,
  DemoLeadData,
} from '@/types/demoChat';

// ─────────────────────────────────────────────────────────────
//  Regex Patterns for Entity & Intent Detection
// ─────────────────────────────────────────────────────────────

const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10,12}\b/;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const DATE_TIME_REGEX = /\b(today|tomorrow|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday|morning|afternoon|evening|night|\d{1,2}\s*(?:am|pm)|\d{1,2}:\d{2}|next\s*week|this\s*weekend)\b/i;

// Clean up user name responses
function extractCleanName(text: string): string {
  let cleaned = text
    .replace(/^(my name is|i am|this is|call me|name:?|it's|it is)\s+/i, '')
    .trim();
  // Remove trailing punctuation
  cleaned = cleaned.replace(/[.,!?;:]+$/, '').trim();
  // If too long or contains non-name words, take first 2-3 words
  const words = cleaned.split(/\s+/);
  if (words.length > 3) {
    return words.slice(0, 3).join(' ');
  }
  return cleaned;
}

// ─────────────────────────────────────────────────────────────
//  Contextual Greeting Generator
// ─────────────────────────────────────────────────────────────

export function getAgentGreeting(agentId: string, agentRole: string, businessType?: string | null): string {
  switch (agentId) {
    case 'admission_counselor':
      return "Hello! 👋\n\nI'm your AI Admission Counselor.\n\nI can help prospective students learn about courses, admissions, eligibility, and application processes.\n\nHow can I help you today?";

    case 'restaurant_assistant':
      return "Hello! 👋\n\nI'm your AI Restaurant Assistant.\n\nI can help customers with menu questions, reservations, opening hours, and dining options.\n\nWhat would you like to know?";

    case 'appointment_coordinator':
      return "Hello! 👋\n\nI'm your AI Appointment Coordinator.\n\nI can help schedule bookings, manage appointment requests, and answer availability questions.\n\nHow can I assist you?";

    case 'sales_agent':
      return "Hello! 👋\n\nI'm your AI Sales Agent.\n\nI can answer product questions, qualify potential customers, provide quotes, and help you find the right solution.\n\nWhat can I help you with?";

    case 'real_estate_assistant':
      return "Hello! 👋\n\nI'm your AI Real Estate Assistant.\n\nI can assist with property details, floor plans, pricing, and scheduling site viewings.\n\nWhat type of property are you interested in?";

    case 'hr_support_agent':
      return "Hello! 👋\n\nI'm your AI HR Support Agent.\n\nI can answer employee questions regarding company policies, benefits, leave balances, and internal resources.\n\nHow can I assist you?";

    case 'customer_support_agent':
      return "Hello! 👋\n\nI'm your AI Customer Support Agent.\n\nI can resolve common questions, provide business information, and assist with support requests 24/7.\n\nHow can I help you today?";

    case 'business_assistant':
    default:
      return `Hello! 👋\n\nI'm your AI ${agentRole || 'Business Assistant'}.\n\nI can answer customer enquiries, capture leads, and support your daily workflow.\n\nWhat would you like to know?`;
  }
}

// ─────────────────────────────────────────────────────────────
//  Mock Demo Chat Engine Implementation
// ─────────────────────────────────────────────────────────────

export class MockDemoChatEngine implements ChatEngine {
  async generateResponse(context: DemoChatContext): Promise<DemoChatResponse> {
    const { agent, userMessage, chatHistory, businessType } = context;
    const text = userMessage.trim();
    const lower = text.toLowerCase();

    // Calculate dynamic realistic typing delay (between 550ms and 1100ms)
    const delayMs = Math.floor(Math.random() * 550) + 550;

    // Analyze conversation history
    const aiMessages = chatHistory.filter((m) => m.sender === 'ai');
    const lastAiMsg = (aiMessages[aiMessages.length - 1]?.text || '').toLowerCase();

    // Check what the AI previously asked
    const askedForName =
      /name\b|who to contact|who am i speaking with|may i have your name/i.test(lastAiMsg);
    const askedForContact =
      /phone|email|contact|reach you|number/i.test(lastAiMsg);
    const askedForCourseOrService =
      /which (course|program|department|service|property|dish)|what are you looking for/i.test(lastAiMsg);
    const askedForDateTime =
      /what (day|time|date|slot)|when work|when would you/i.test(lastAiMsg);

    // ──────────────────────────────────────────────────────────
    //  1. Detect Contact Info (Phone / Email)
    // ──────────────────────────────────────────────────────────
    const phoneMatch = text.match(PHONE_REGEX);
    const emailMatch = text.match(EMAIL_REGEX);

    if (phoneMatch || emailMatch || (askedForContact && (/\d{5,}/.test(text) || text.includes('@')))) {
      const phone = phoneMatch ? phoneMatch[0] : undefined;
      const email = emailMatch ? emailMatch[0] : undefined;

      let reply = '';
      if (agent.id === 'admission_counselor') {
        reply =
          `Thank you! Your details have been captured successfully. ✓\n\n` +
          `Our admissions team now has your information and will follow up with full course brochures, fee schedules, and next steps for your application.\n\n` +
          `This is how your AI Agent automatically captures and qualifies prospective student leads.`;
      } else if (agent.id === 'restaurant_assistant') {
        reply =
          `Thank you! Your reservation details and contact number have been logged. ✓\n\n` +
          `Our hosting team will confirm your table and look forward to welcoming you!\n\n` +
          `This is how your AI Agent captures customer bookings 24/7 without staff intervention.`;
      } else if (agent.id === 'appointment_coordinator') {
        reply =
          `Thank you! Your appointment request and contact information have been recorded. ✓\n\n` +
          `You will receive a confirmation message shortly with your appointment details.\n\n` +
          `This is how your AI Agent automates booking and reduces no-shows effortlessly.`;
      } else if (agent.id === 'real_estate_assistant') {
        reply =
          `Thank you! Your site visit request and contact details have been captured. ✓\n\n` +
          `Our property advisor will send you the complete brochure and coordinate your visit.\n\n` +
          `This is how your AI Agent captures high-intent property leads instantly.`;
      } else {
        reply =
          `Thank you! Your enquiry and contact details have been captured successfully. ✓\n\n` +
          `Our team has received your information and will follow up promptly.\n\n` +
          `This is how your AI Agent automates lead qualification and customer capture around the clock.`;
      }

      return {
        reply,
        intent: 'contact_sharing',
        actionTaken: 'lead_captured',
        leadCaptured: true,
        leadData: { phone, email },
        delayMs,
      };
    }

    // ──────────────────────────────────────────────────────────
    //  2. Detect Name Sharing (if AI previously asked for name or explicitly stated)
    // ──────────────────────────────────────────────────────────
    const nameExplicit = text.match(/^(?:my name is|i am|this is|call me)\s+([A-Za-z\s]+)$/i);
    const looksLikeName =
      askedForName &&
      !lower.includes('?') &&
      text.split(/\s+/).length <= 4 &&
      !/^(yes|no|ok|sure|later|hello|hi)\b/i.test(text);

    if (nameExplicit || looksLikeName) {
      const capturedName = extractCleanName(nameExplicit ? nameExplicit[1] : text);

      const reply =
        `Thank you, ${capturedName}! 😊\n\n` +
        `Could you also share your phone number or email address so our team can follow up with the right details?`;

      return {
        reply,
        intent: 'name_sharing',
        actionTaken: 'ask_contact',
        leadData: { name: capturedName },
        delayMs,
      };
    }

    // ──────────────────────────────────────────────────────────
    //  3. Healthcare Safety Guardrail
    // ──────────────────────────────────────────────────────────
    if (
      (businessType === 'healthcare' || agent.id === 'appointment_coordinator') &&
      /\b(diagnosis|symptom|pain|sick|cure|treatment|medicine|prescription|dosage|disease|injury|bleeding|chest pain)\b/i.test(lower)
    ) {
      return {
        reply:
          `Please note that as an AI Coordinator, I do not provide medical diagnosis or treatment advice.\n\n` +
          `If you are experiencing a medical emergency, please call your local emergency services immediately.\n\n` +
          `For routine consultations, I would be happy to help schedule an appointment with one of our qualified doctors. Would you like to check open slots?`,
        intent: 'medical_safety_disclaimer',
        actionTaken: 'route_to_doctor',
        delayMs,
      };
    }

    // ──────────────────────────────────────────────────────────
    //  4. Greetings
    // ──────────────────────────────────────────────────────────
    if (/^(hi|hello|hey|good morning|good afternoon|good evening|howdy)\b/i.test(lower) && text.length < 25) {
      return {
        reply:
          `Hello! Great to connect with you. 😊\n\n` +
          `I'm ready to answer any questions about our services, pricing, or how we can help your business. What would you like to explore?`,
        intent: 'greeting',
        delayMs,
      };
    }

    // ──────────────────────────────────────────────────────────
    //  5. Affirmative / Interest ("Yes", "Sure", "I'd like that")
    // ──────────────────────────────────────────────────────────
    if (/^(yes|sure|definitely|absolutely|yeah|yep|ok|okay|please do|sounds good|i want to)\b/i.test(lower) && text.length < 30) {
      if (askedForContact) {
        return {
          reply: `Great! Please share your phone number or email address below:`,
          intent: 'ask_contact',
          delayMs,
        };
      }
      return {
        reply:
          `Perfect! I'd be happy to arrange that for you.\n\n` +
          `May I have your name so our team knows who to connect with?`,
        intent: 'lead_interest',
        actionTaken: 'ask_name',
        delayMs,
      };
    }

    // ──────────────────────────────────────────────────────────
    //  6. Admission Counselor Specific Queries
    // ──────────────────────────────────────────────────────────
    if (agent.id === 'admission_counselor') {
      if (/\b(mba|bba|engineering|computer science|course|program|degree|curriculum)\b/i.test(lower)) {
        return {
          reply:
            `Great choice! Our program is designed to build practical leadership and real-world exposure, with flexible schedules and industry mentorship.\n\n` +
            `Would you like me to connect you with our admissions team to share the detailed syllabus and fee structure?`,
          intent: 'course_or_product_question',
          leadData: { interest: text },
          delayMs,
        };
      }

      if (/\b(admission|apply|eligibility|requirements|deadline|scholarship|fees?)\b/i.test(lower)) {
        return {
          reply:
            `Admissions are currently open! Eligibility typically requires relevant qualifying degrees or scores, and merit scholarships are available.\n\n` +
            `May I know your name so I can share the tailored admission guide with you?`,
          intent: 'admission_enquiry',
          actionTaken: 'ask_name',
          delayMs,
        };
      }

      if (/\b(tour|visit|campus|counselor|counselling|appointment)\b/i.test(lower)) {
        return {
          reply:
            `We'd love to host you for a campus tour or a dedicated 1-on-1 counseling session!\n\n` +
            `What day or time works best for you?`,
          intent: 'appointment_request',
          delayMs,
        };
      }
    }

    // ──────────────────────────────────────────────────────────
    //  7. Restaurant Assistant Specific Queries
    // ──────────────────────────────────────────────────────────
    if (agent.id === 'restaurant_assistant') {
      if (/\b(table|reserve|reservation|book|party|seat|guests?)\b/i.test(lower)) {
        return {
          reply:
            `I'd be glad to help you reserve a table! 🍽️\n\n` +
            `How many guests will be dining, and for what date and time?`,
          intent: 'reservation_request',
          delayMs,
        };
      }

      if (/\b(menu|food|vegan|vegetarian|gluten|dish|specials|dessert|drink)\b/i.test(lower)) {
        return {
          reply:
            `Our chef prepares seasonal specialties with fresh local ingredients, including extensive vegetarian, vegan, and gluten-free choices.\n\n` +
            `Would you like to reserve a table for lunch or dinner?`,
          intent: 'service_question',
          delayMs,
        };
      }

      if (/\b(hour|hours|open|timing|close|location|address|parking)\b/i.test(lower)) {
        return {
          reply:
            `We are open daily for Lunch from 12:00 PM to 3:30 PM, and Dinner from 7:00 PM to 11:00 PM. Complimentary valet parking is available at the entrance.\n\n` +
            `Can I help you reserve a table for your next visit?`,
          intent: 'general_question',
          delayMs,
        };
      }
    }

    // ──────────────────────────────────────────────────────────
    //  8. Appointment Coordinator Specific Queries
    // ──────────────────────────────────────────────────────────
    if (agent.id === 'appointment_coordinator') {
      if (/\b(appointment|book|schedule|slot|consult|visit|time|date)\b/i.test(lower)) {
        return {
          reply:
            `I can certainly help you schedule an appointment! 📅\n\n` +
            `We have openings available throughout this week. What date or time would be most convenient for you?`,
          intent: 'appointment_request',
          delayMs,
        };
      }

      if (DATE_TIME_REGEX.test(lower) || askedForDateTime) {
        return {
          reply:
            `Got it! I have noted your preferred timing. 🗓️\n\n` +
            `May I have your name to hold the appointment slot?`,
          intent: 'date_time_provided',
          actionTaken: 'ask_name',
          delayMs,
        };
      }
    }

    // ──────────────────────────────────────────────────────────
    //  9. Sales Agent Specific Queries
    // ──────────────────────────────────────────────────────────
    if (agent.id === 'sales_agent') {
      if (/\b(price|pricing|cost|quote|plan|package|rate|discount)\b/i.test(lower)) {
        return {
          reply:
            `We offer scalable plans tailored to your team size and volume, starting with full onboarding and ongoing support.\n\n` +
            `May I know your name and business name so I can prepare a custom quote?`,
          intent: 'pricing_question',
          actionTaken: 'ask_name',
          delayMs,
        };
      }

      if (/\b(demo|feature|compare|how does it work|services?|solution)\b/i.test(lower)) {
        return {
          reply:
            `Our solution seamlessly automates customer interactions, qualifies high-intent leads, and integrates into your existing CRM workflows.\n\n` +
            `Would you like to schedule a personalized walkthrough with one of our product specialists?`,
          intent: 'sales_enquiry',
          delayMs,
        };
      }
    }

    // ──────────────────────────────────────────────────────────
    //  10. Real Estate Assistant Specific Queries
    // ──────────────────────────────────────────────────────────
    if (agent.id === 'real_estate_assistant') {
      if (/\b(property|apartment|flat|villa|2bhk|3bhk|bhk|sqft|floor\s*plan|price)\b/i.test(lower)) {
        return {
          reply:
            `We feature prime luxury residences with modern amenities, spacious floor plans, and attractive payment milestones.\n\n` +
            `May I have your name so I can share the complete property brochure and pricing sheet?`,
          intent: 'course_or_product_question',
          actionTaken: 'ask_name',
          delayMs,
        };
      }

      if (/\b(visit|viewing|tour|see the property|site visit)\b/i.test(lower)) {
        return {
          reply:
            `I'd be glad to schedule an exclusive on-site property tour for you!\n\n` +
            `Which day and time work best for your visit?`,
          intent: 'appointment_request',
          delayMs,
        };
      }
    }

    // ──────────────────────────────────────────────────────────
    //  11. HR Support Agent Specific Queries
    // ──────────────────────────────────────────────────────────
    if (agent.id === 'hr_support_agent') {
      if (/\b(leave|vacation|holiday|sick leave|policy|handbook|benefits?|insurance|payroll)\b/i.test(lower)) {
        return {
          reply:
            `Our company provides flexible annual leave, comprehensive healthcare coverage, and standard holiday schedules detailed in the employee handbook.\n\n` +
            `Would you like me to email you the specific policy documentation or open a ticket with HR?`,
          intent: 'service_question',
          delayMs,
        };
      }
    }

    // ──────────────────────────────────────────────────────────
    //  12. General "How can you help?" / Capability Queries
    // ──────────────────────────────────────────────────────────
    if (/\b(how can you help|what can you do|your capabilities|how do you work|tell me about yourself)\b/i.test(lower)) {
      return {
        reply:
          `As an AI ${agent.role}, I operate 24/7 to answer customer queries in seconds, qualify incoming opportunities, and capture contact details so your team never misses a lead.\n\n` +
          `Try asking a specific question or request to see how I handle customer conversations!`,
        intent: 'general_question',
        delayMs,
      };
    }

    // ──────────────────────────────────────────────────────────
    //  13. Contextual Default Fallback
    // ──────────────────────────────────────────────────────────
    return {
      reply:
        `I understand! As your AI ${agent.role}, I'm configured to handle your business communications and capture prospective customer needs.\n\n` +
        `Would you like more details on our options, or shall I have our team contact you directly?`,
      intent: 'general_question',
      delayMs,
    };
  }
}

export const defaultChatEngine = new MockDemoChatEngine();
