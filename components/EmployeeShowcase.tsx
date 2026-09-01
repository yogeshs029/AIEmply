'use client';

import { aiEmployees } from '@/data/employees';
import AIEmployeeCard from '@/components/AIEmployeeCard';

export default function EmployeeShowcase() {
  return (
    <section id="employees" style={{ background: 'var(--bg-subtle)', padding: 'var(--section-pad) 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-eyebrow">The AI Workforce</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            Meet the AI Workforce.
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Specialized AI Employees designed for specific business roles.
            Each one built to perform a focused set of tasks with precision.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {aiEmployees.map((employee) => (
            <AIEmployeeCard key={employee.id} employee={employee} compact={true} />
          ))}
        </div>
      </div>
    </section>
  );
}
