import { ChatMessage, PersonaResponse } from '@/types';

export const personaEngine: Record<string, PersonaResponse> = {
  education: {
    greeting: "Hello! 👋 I'm your AI Admission Counselor.\n\nI handle student enquiries, provide course details, qualify prospective applicants, and schedule campus consultations 24/7.",
    suggestedPrompts: [
      "Tell me about course admissions",
      "What are the eligibility criteria?",
      "Can I book a campus tour?",
      "How can you help our institute?"
    ],
    knowledge: [
      {
        pattern: /admission|apply|enroll|course|program|degree|fee|tuition/i,
        reply: "We offer comprehensive undergraduate and postgraduate programs. I can answer specific queries regarding eligibility, fees, and application deadlines.\n\nWould you like me to share a program brochure or schedule an admissions call for you?",
        triggerLeadCapture: true
      },
      {
        pattern: /tour|visit|campus|meet|consult|slot|schedule/i,
        reply: "I'd be glad to arrange a campus tour or video consultation with our admissions officer.\n\nWhat day and time work best for your visit?",
        triggerLeadCapture: true
      },
      {
        pattern: /help|benefit|institute|university|college|work/i,
        reply: "I reduce response times from hours to seconds! I answer 85%+ of routine student questions instantly, capture student details, and route high-priority applicants directly to your team."
      }
    ],
    defaultReply: "That's a great question! As an AI Admission Counselor, I can handle course enquiries, collect student info, and automate follow-ups. What specific program or admission requirement would you like to know about?"
  },

  healthcare: {
    greeting: "Hello! 👋 I'm your AI Appointment Coordinator.\n\nI assist patients with scheduling visits, answering clinic hours and department queries, and handling routine enquiries 24/7.",
    suggestedPrompts: [
      "I want to book an appointment",
      "What are your working hours?",
      "Do you accept health insurance?",
      "How do you handle patient enquiries?"
    ],
    knowledge: [
      {
        pattern: /appointment|book|schedule|doctor|slot|visit/i,
        reply: "I can assist in scheduling appointments across all active departments.\n\nWhich specialist or department are you looking for, and what date and time work best for you?",
        triggerLeadCapture: true
      },
      {
        pattern: /hour|time|open|location|address/i,
        reply: "Our clinic is open Monday through Saturday from 8:00 AM to 8:00 PM. Emergency services are supported 24/7."
      },
      {
        pattern: /insurance|pay|cost|fee|claim/i,
        reply: "We accept all major insurance providers and cashless claims. Would you like me to connect you with our billing department for exact coverage details?"
      },
      {
        pattern: /help|benefit|clinic|hospital|patient/i,
        reply: "I eliminate patient hold times, coordinate appointment bookings 24/7, and automatically send SMS/WhatsApp reminders to minimize no-shows."
      }
    ],
    defaultReply: "I'm trained to handle patient coordination and appointment bookings seamlessly. What department or appointment slot can I check for you?"
  },

  restaurant: {
    greeting: "Hello! 👋 I'm your AI Restaurant Assistant.\n\nI handle table reservations, answer menu and dietary questions, provide location details, and collect guest feedback 24/7.",
    suggestedPrompts: [
      "I'd like to reserve a table",
      "Do you have vegetarian / vegan options?",
      "What are your opening hours?",
      "How do you handle orders & reservations?"
    ],
    knowledge: [
      {
        pattern: /reserve|table|book|party|seat|guest/i,
        reply: "I can help lock in a table reservation for you!\n\nHow many guests will be joining, and for what date and time?",
        triggerLeadCapture: true
      },
      {
        pattern: /menu|food|vegan|vegetarian|gluten|dish/i,
        reply: "Our menu features chef-crafted dishes including extensive vegetarian, vegan, and gluten-free options. I can also send you a link to our full digital menu."
      },
      {
        pattern: /hour|open|location|parking|address/i,
        reply: "We are open daily for Lunch (12 PM - 3:30 PM) and Dinner (7 PM - 11 PM). Valet parking is available at the main entrance."
      },
      {
        pattern: /help|benefit|restaurant|cafe|order/i,
        reply: "I handle peak-hour phone and chat traffic without missing a single reservation, so your staff can focus 100% on serving in-house guests."
      }
    ],
    defaultReply: "I manage reservations, menu FAQs, and guest feedback around the clock. Would you like to reserve a table or view our dining options?"
  },

  professional_services: {
    greeting: "Hello! 👋 I'm your AI Receptionist & Client Assistant.\n\nI greet prospective clients, qualify business leads, answer service FAQs, and book consultation calls 24/7.",
    suggestedPrompts: [
      "Tell me about your services",
      "I'd like to book a consultation",
      "What are your pricing packages?",
      "How can an AI Employee help my firm?"
    ],
    knowledge: [
      {
        pattern: /service|offer|do|help|solution|capability/i,
        reply: "We specialize in tailored business solutions. I can provide overview documents, capture your requirements, and match you with the right advisor."
      },
      {
        pattern: /consult|book|call|meet|schedule|demo/i,
        reply: "I'd be happy to schedule a consultation with a senior consultant.\n\nWhat day and time work best for your call?",
        triggerLeadCapture: true
      },
      {
        pattern: /price|cost|quote|package|rate/i,
        reply: "Pricing is customized based on your scope and project needs. I can collect your project requirements right now and generate a custom proposal estimate."
      },
      {
        pattern: /firm|agency|company|business/i,
        reply: "I act as your digital front desk — screening incoming inquiries, qualifying high-value leads, and booking qualified meetings directly into your calendar."
      }
    ],
    defaultReply: "I qualify incoming business leads, answer service queries, and keep your business responsive 24 hours a day. How can I assist your firm today?"
  },

  retail: {
    greeting: "Hello! 👋 I'm your AI Sales & Support Executive.\n\nI answer product questions, assist with order tracking, recommend items based on customer preference, and capture leads 24/7.",
    suggestedPrompts: [
      "Where is my order?",
      "Do you offer discounts for bulk orders?",
      "What is your return policy?",
      "How do you boost sales for stores?"
    ],
    knowledge: [
      {
        pattern: /order|track|ship|deliver|status/i,
        reply: "I can check your order status instantly! Just provide your Order ID or registered mobile number.",
        triggerLeadCapture: true
      },
      {
        pattern: /discount|bulk|price|offer|wholesale/i,
        reply: "We offer tier discounts for bulk orders! Leave your contact email and requirement details, and our sales representative will get back to you with custom quotes.",
        triggerLeadCapture: true
      },
      {
        pattern: /return|refund|exchange|policy/i,
        reply: "We offer hassle-free 30-day returns and exchanges on all eligible items. I can guide you through generating a return label right away."
      },
      {
        pattern: /help|boost|sale|retail|store|ecommerce/i,
        reply: "I guide online shoppers, answer pre-purchase questions instantly, reduce cart abandonment, and convert casual visitors into paying customers."
      }
    ],
    defaultReply: "I assist shoppers, resolve pre-purchase doubts, and boost conversions for your retail business around the clock! What product or order can I help with?"
  },

  technology: {
    greeting: "Hello! 👋 I'm your AI Customer Support & Onboarding Specialist.\n\nI answer technical FAQs, troubleshoot common issues, guide product onboarding, and escalate complex tickets 24/7.",
    suggestedPrompts: [
      "How do I integrate your API?",
      "I need technical support",
      "Do you offer custom enterprise features?",
      "How do you lower support ticket volume?"
    ],
    knowledge: [
      {
        pattern: /api|integrate|doc|setup|code|developer/i,
        reply: "Our API documentation provides step-by-step SDK guides for Node.js, Python, and REST endpoints. Would you like me to email you the technical documentation?"
      },
      {
        pattern: /support|issue|bug|help|ticket|error|problem/i,
        reply: "I can troubleshoot standard issues immediately! If it requires engineer escalation, I will summarize your ticket and alert on-call support.",
        triggerLeadCapture: true
      },
      {
        pattern: /enterprise|security|custom|pricing|plan/i,
        reply: "Our Enterprise tier includes custom SLA agreements, dedicated VPC hosting, and SOC2 compliance. May I collect your business email for an enterprise brief?",
        triggerLeadCapture: true
      },
      {
        pattern: /ticket|volume|saas|tech|automate/i,
        reply: "I resolve up to 70% of tier-1 support queries autonomously, reducing your L1 support costs and guaranteeing instant response times."
      }
    ],
    defaultReply: "I handle technical inquiries, assist with user onboarding, and keep your software support running 24/7/365! What technical question can I resolve for you?"
  },

  real_estate: {
    greeting: "Hello! 👋 I'm your AI Real Estate Lead Specialist & Receptionist.\n\nI answer property queries, qualify buyer budget and timelines, share property brochures, and schedule site visits 24/7.",
    suggestedPrompts: [
      "I want to book a site visit",
      "What property configurations are available?",
      "Can I get price details & floor plans?",
      "How do you qualify property leads?"
    ],
    knowledge: [
      {
        pattern: /visit|site|see|tour|viewing|meet|schedule|book/i,
        reply: "I'd be glad to schedule an exclusive site visit!\n\nWhat day and time work best for your visit?",
        triggerLeadCapture: true
      },
      {
        pattern: /price|cost|budget|plan|floor|bhk|sqft/i,
        reply: "We have luxury 2BHK and 3BHK residences. I can send the detailed price sheet and floor plan directly to your WhatsApp or email.",
        triggerLeadCapture: true
      },
      {
        pattern: /qualify|lead|agent|broker|property/i,
        reply: "I respond to buyer ads instantly while their interest is hottest, qualify their budget/location needs, and pass high-intent leads straight to your sales agents."
      }
    ],
    defaultReply: "I qualify high-intent real estate buyers, answer property specs 24/7, and book site visits automatically! Would you like to schedule a site tour or view property details?"
  },

  default: {
    greeting: "Hello! 👋 I'm your AI Support Executive & Receptionist.\n\nI can assist your customers, answer routine questions, capture qualified leads, and manage communications 24 hours a day.",
    suggestedPrompts: [
      "Tell me about your services",
      "How do you capture leads?",
      "Can you handle customer support?",
      "How do we get started?"
    ],
    knowledge: [
      {
        pattern: /service|about|do|work|capability/i,
        reply: "I am customized around your exact business workflow — handling customer inquiries, qualifying leads, and taking over repetitive communication tasks."
      },
      {
        pattern: /lead|capture|qualify|prospect|customer/i,
        reply: "Whenever a prospective customer asks for quotes, bookings, or consultations, I collect their name, email, and requirements and notify your sales team instantly!",
        triggerLeadCapture: true
      },
      {
        pattern: /start|build|setup|deploy|cost/i,
        reply: "Getting started takes just a quick consultation where we map out your workflow! Would you like to request an AI Employee setup now?"
      }
    ],
    defaultReply: "I'm an AI Employee designed to handle repetitive business communication, capture prospective leads, and operate 24/7! How can I assist you today?"
  }
};

/**
 * Multi-Turn History-Aware Persona Response Engine
 * Evaluates full conversation context to stay in sync with user responses!
 */
export function getPersonaResponse(
  industryId: string,
  messages: ChatMessage[]
): { reply: string; triggerLeadCapture?: boolean } {
  const persona = personaEngine[industryId] || personaEngine.default;
  const userMessages = messages.filter((m) => m.sender === 'user');
  const lastUserMsg = userMessages[userMessages.length - 1]?.text.trim() || '';
  const lastAiMsg = messages.filter((m) => m.sender === 'ai').pop()?.text.toLowerCase() || '';

  // 1. Detect Date / Time / Scheduling responses (e.g. "tomorrow at 9 pm", "next Monday", "9pm", "5 oclock")
  const dateTimeRegex = /tomorrow|today|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday|morning|afternoon|evening|night|\d{1,2}\s*(am|pm)|at\s*\d{1,2}|next\s*week|\d{1,2}:\d{2}/i;
  const isDateTimeProvided = dateTimeRegex.test(lastUserMsg);

  // Check if previous AI message was asking for a time / date / visit / slot / consultation
  const aiAskedForTime = /what (day|time|date|slot)|when work|schedule|when would you|what date/i.test(lastAiMsg);

  if (isDateTimeProvided || (aiAskedForTime && lastUserMsg.length > 1 && !lastUserMsg.startsWith('?'))) {
    const matchedTime = lastUserMsg;
    return {
      reply: `Got it! I've noted **"${matchedTime}"** for your slot/visit.\n\nCould you please share your **Name** and **Contact Number (or Email)** so our team can send you the confirmation details?`,
      triggerLeadCapture: true,
    };
  }

  // 2. Detect Name / Phone / Email submission
  const contactInfoRegex = /@|\d{8,12}|my name is|i am|this is|call me|email is|phone/i;
  if (contactInfoRegex.test(lastUserMsg)) {
    return {
      reply: "Thank you! I've registered your contact details and confirmed your request in our system.\n\nOur representative will send you a confirmation message shortly!",
      triggerLeadCapture: true,
    };
  }

  // 3. Detect Clarification / Question mark "?" or short follow-ups like "ok", "yes", "what next?"
  if (lastUserMsg === '?' || lastUserMsg.toLowerCase() === 'what?' || lastUserMsg.toLowerCase() === 'meaning?' || lastUserMsg.toLowerCase() === 'how?') {
    if (aiAskedForTime || lastAiMsg.includes('contact') || lastAiMsg.includes('slot') || lastAiMsg.includes('visit')) {
      return {
        reply: "I'm holding your requested slot! Simply provide your contact name or phone number whenever you're ready, or ask me any questions about our property and services.",
        triggerLeadCapture: true,
      };
    }
    return {
      reply: "I'm here to assist you! You can ask me about available properties, pricing, booking a site visit, or scheduling a consultation. What would you like to know?",
    };
  }

  if (/^(yes|sure|yep|yeah|ok|okay|sounds good|go ahead)$/i.test(lastUserMsg)) {
    return {
      reply: "Awesome! What date and time work best for you, or is there a specific requirement you'd like me to look into?",
      triggerLeadCapture: true,
    };
  }

  // 4. Standard Knowledge Pattern Match on latest user message
  for (const item of persona.knowledge) {
    if (item.pattern.test(lastUserMsg)) {
      return { reply: item.reply, triggerLeadCapture: item.triggerLeadCapture };
    }
  }

  // 5. Fallback context-aware response (does NOT repeat static default line if user asks specific follow-up)
  return { reply: persona.defaultReply };
}
