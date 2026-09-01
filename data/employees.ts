import { AIEmployee } from '@/types';

export const aiEmployees: AIEmployee[] = [
  {
    id: 'receptionist',
    role: 'AI Receptionist',
    tagline: 'Your first line of customer communication.',
    description:
      'Handles incoming enquiries, provides business information, and routes requests to the right team — available around the clock.',
    capabilities: [
      'Answer common questions instantly',
      'Capture customer contact details',
      'Route enquiries to the right department',
      'Provide business hours and location info',
      'Work 24/7 without downtime',
    ],
    icon: '🤝',
    badge: 'Most Popular',
  },
  {
    id: 'sales_assistant',
    role: 'AI Sales Assistant',
    tagline: 'Engage prospects and drive conversions.',
    description:
      'Engages potential customers at the right moment, understands their needs, qualifies their interest, and passes hot leads to your sales team.',
    capabilities: [
      'Engage website visitors proactively',
      'Understand customer requirements',
      'Qualify leads before handoff',
      'Share product/service information',
      'Schedule sales calls or demos',
    ],
    icon: '📈',
  },
  {
    id: 'customer_support',
    role: 'AI Customer Support Executive',
    tagline: 'Instant support, every time.',
    description:
      'Provides immediate responses to customer queries, resolves common issues, and escalates complex cases to your human support team.',
    capabilities: [
      'Resolve common support queries instantly',
      'Track and follow up on open requests',
      'Escalate complex issues to humans',
      'Reduce average response time significantly',
      'Collect customer satisfaction feedback',
    ],
    icon: '💬',
  },
  {
    id: 'lead_qualification',
    role: 'AI Lead Qualification Agent',
    tagline: 'Identify your best opportunities.',
    description:
      'Filters and scores incoming enquiries so your sales team spends time only on high-quality, sales-ready leads.',
    capabilities: [
      'Score leads based on set criteria',
      'Ask qualifying questions automatically',
      'Segment leads by intent and priority',
      'Notify sales team of hot leads',
      'Maintain a clean, qualified pipeline',
    ],
    icon: '🎯',
  },
  {
    id: 'appointment_coordinator',
    role: 'AI Appointment Coordinator',
    tagline: 'Bookings made effortless.',
    description:
      'Helps customers schedule appointments, sends confirmations, and reduces no-shows — freeing your staff from repetitive scheduling tasks.',
    capabilities: [
      'Handle appointment booking requests',
      'Send booking confirmations',
      'Manage rescheduling and cancellations',
      'Reduce no-shows with reminders',
      'Integrate with scheduling workflows',
    ],
    icon: '📅',
  },
  {
    id: 'admission_counselor',
    role: 'Admission Counselor',
    tagline: 'Support every prospective student.',
    description:
      'Specialized in handling student and parent enquiries, explaining courses, and capturing quality leads.',
    avatar: '/agents/admission_counselor.jpg',
    capabilities: [
      'Answer student & parent enquiries',
      'Follow up with prospective students',
      'Explain courses & programs',
      'Qualify enquiries',
      'Capture leads & student details',
      'Escalate important requests',
    ],
    detailedCapabilities: [
      {
        title: 'Answer student & parent enquiries',
        subtitle: 'Provide instant and accurate information.',
        icon: 'chat',
      },
      {
        title: 'Follow up with prospective students',
        subtitle: 'Send reminders and follow-ups automatically.',
        icon: 'calendar',
      },
      {
        title: 'Explain courses & programs',
        subtitle: 'Share details about courses, eligibility and fees.',
        icon: 'grad_cap',
      },
      {
        title: 'Qualify enquiries',
        subtitle: 'Understand student needs and qualify leads.',
        icon: 'funnel',
      },
      {
        title: 'Capture leads & student details',
        subtitle: 'Collect interested student information automatically.',
        icon: 'user',
      },
      {
        title: 'Escalate important requests',
        subtitle: 'Forward complex queries to your team instantly.',
        icon: 'forward',
      },
    ],
    icon: '🎓',
  },
  {
    id: 'hr_assistant',
    role: 'AI HR Assistant',
    tagline: 'Support your team from the inside.',
    description:
      'Answers common employee questions about policies, benefits, and processes — reducing the HR team\'s load on repetitive internal queries.',
    capabilities: [
      'Answer HR policy questions instantly',
      'Guide employees through processes',
      'Handle leave and attendance queries',
      'Provide onboarding information',
      'Route escalations to the HR team',
    ],
    icon: '👥',
  },
  {
    id: 'custom',
    role: 'Custom AI Employee',
    tagline: 'Built specifically for your business.',
    description:
      'Don\'t see an exact fit? We design and build AI Employees around your specific business workflows, tasks, and requirements.',
    capabilities: [
      'Designed around your actual processes',
      'Custom conversation flows',
      'Integrate with your existing tools',
      'Tailored to your industry and team',
      'Scales with your business needs',
    ],
    icon: '⚡',
    badge: 'Custom Build',
  },
];
