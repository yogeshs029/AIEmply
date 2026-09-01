import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { CustomerEnquiryPayload } from '@/types/enquiry';

// ─────────────────────────────────────────────────────────────
//  Database Layer with PostgreSQL + Local Fallback Storage
// ─────────────────────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

const isPostgresConfigured = Boolean(process.env.DATABASE_URL);

let pool: Pool | null = null;

if (isPostgresConfigured) {
  try {
    pool = global.__pgPool ?? new Pool({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 3000,
    });
    if (process.env.NODE_ENV !== 'production') {
      global.__pgPool = pool;
    }
  } catch (err) {
    console.warn('[DB] Failed to initialize PostgreSQL pool:', err);
    pool = null;
  }
}

// ── Fallback local JSON storage ──────────────────────────────
const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'sessions.json');
const CHAT_FILE = path.join(DATA_DIR, 'demo_chat_messages.json');
const LEADS_FILE = path.join(DATA_DIR, 'demo_leads.json');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'customer_enquiries.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}), 'utf-8');
  }
  if (!fs.existsSync(CHAT_FILE)) {
    fs.writeFileSync(CHAT_FILE, JSON.stringify({}), 'utf-8');
  }
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify({}), 'utf-8');
  }
  if (!fs.existsSync(ENQUIRIES_FILE)) {
    fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify({}), 'utf-8');
  }
}

function getJsonFile<T>(filePath: string): T {
  try {
    ensureDataFile();
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content || '{}');
  } catch {
    return {} as T;
  }
}

function saveJsonFile(filePath: string, data: any) {
  try {
    ensureDataFile();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`[DB Fallback] Failed to save ${filePath}:`, err);
  }
}

function arraysEqual(a?: string[] | null, b?: string[] | null): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
}

export const db = {
  isPostgres: () => Boolean(pool),

  // ── Session Operations ──────────────────────────────────────

  async getSession(sessionId: string) {
    if (pool) {
      try {
        const { rows } = await pool.query(
          'SELECT * FROM ai_emply_sessions WHERE session_id = $1 LIMIT 1',
          [sessionId]
        );
        return rows[0] || null;
      } catch (err) {
        console.warn('[DB] Postgres query failed, falling back to local file:', (err as Error).message);
      }
    }
    const local = getJsonFile<Record<string, any>>(DATA_FILE);
    return local[sessionId] || null;
  },

  async createSession(sessionId: string) {
    if (pool) {
      try {
        await pool.query(
          `INSERT INTO ai_emply_sessions (session_id, current_step, status, demo_completed, updated_at)
           VALUES ($1, 1, 'in_progress', false, NOW())
           ON CONFLICT (session_id) DO NOTHING`,
          [sessionId]
        );
        const { rows } = await pool.query(
          'SELECT * FROM ai_emply_sessions WHERE session_id = $1 LIMIT 1',
          [sessionId]
        );
        return rows[0] || null;
      } catch (err) {
        console.warn('[DB] Postgres insert failed, falling back to local file:', (err as Error).message);
      }
    }

    const local = getJsonFile<Record<string, any>>(DATA_FILE);
    if (!local[sessionId]) {
      local[sessionId] = {
        id: crypto.randomUUID(),
        session_id: sessionId,
        business_type: null,
        business_description: null,
        selected_needs: null,
        recommended_agent: null,
        recommendation_source: null,
        demo_completed: false,
        full_name: null,
        business_name: null,
        email: null,
        phone: null,
        workflow_details: null,
        dynamic_answers: null,
        current_step: 1,
        status: 'in_progress',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      saveJsonFile(DATA_FILE, local);
    }
    return local[sessionId];
  },

  async updateStep1(sessionId: string, businessType: string, businessDescription?: string) {
    if (pool) {
      try {
        const { rows: currRows } = await pool.query(
          'SELECT business_type FROM ai_emply_sessions WHERE session_id = $1 LIMIT 1',
          [sessionId]
        );
        const prevBiz = currRows[0]?.business_type;
        const bizChanged = prevBiz !== businessType;

        // Downstream Invalidation Rule: Changing business type invalidates needs, agent, and demo
        const resetFields = bizChanged
          ? ', selected_needs = NULL, recommended_agent = NULL, recommendation_source = NULL, demo_completed = false'
          : '';

        const { rows } = await pool.query(
          `UPDATE ai_emply_sessions
           SET business_type = $1, business_description = $2, current_step = 2, updated_at = NOW() ${resetFields}
           WHERE session_id = $3
           RETURNING *`,
          [businessType, businessDescription || null, sessionId]
        );

        if (bizChanged) {
          // Clear previous demo chat messages when business type changes
          await pool.query('DELETE FROM demo_chat_messages WHERE session_id = $1', [sessionId]);
        }

        if (rows.length > 0) return rows[0];
      } catch (err) {
        console.warn('[DB] Postgres updateStep1 failed, falling back to local file:', (err as Error).message);
      }
    }

    const local = getJsonFile<Record<string, any>>(DATA_FILE);
    const existing = local[sessionId] || {
      id: crypto.randomUUID(),
      session_id: sessionId,
      created_at: new Date().toISOString(),
    };

    const bizChanged = existing.business_type !== businessType;

    local[sessionId] = {
      ...existing,
      business_type: businessType,
      business_description: businessDescription || null,
      ...(bizChanged ? { selected_needs: null, recommended_agent: null, recommendation_source: null, demo_completed: false } : {}),
      current_step: 2,
      updated_at: new Date().toISOString(),
    };
    saveJsonFile(DATA_FILE, local);

    if (bizChanged) {
      const localChat = getJsonFile<Record<string, any[]>>(CHAT_FILE);
      delete localChat[sessionId];
      saveJsonFile(CHAT_FILE, localChat);
    }

    return local[sessionId];
  },

  async updateStep2(sessionId: string, selectedNeeds: string[]) {
    if (pool) {
      try {
        const { rows: currRows } = await pool.query(
          'SELECT selected_needs FROM ai_emply_sessions WHERE session_id = $1 LIMIT 1',
          [sessionId]
        );
        const prevNeeds = currRows[0]?.selected_needs;
        const needsChanged = !arraysEqual(prevNeeds, selectedNeeds);

        // Downstream Invalidation Rule: Changing needs invalidates recommended agent and demo
        const resetFields = needsChanged
          ? ', recommended_agent = NULL, recommendation_source = NULL, demo_completed = false'
          : '';

        const { rows } = await pool.query(
          `UPDATE ai_emply_sessions
           SET selected_needs = $1::jsonb, current_step = 3, updated_at = NOW() ${resetFields}
           WHERE session_id = $2
           RETURNING *`,
          [JSON.stringify(selectedNeeds), sessionId]
        );
        if (rows.length > 0) return rows[0];
      } catch (err) {
        console.warn('[DB] Postgres updateStep2 failed, falling back to local file:', (err as Error).message);
      }
    }

    const local = getJsonFile<Record<string, any>>(DATA_FILE);
    const existing = local[sessionId] || {
      id: crypto.randomUUID(),
      session_id: sessionId,
      created_at: new Date().toISOString(),
    };

    const needsChanged = !arraysEqual(existing.selected_needs, selectedNeeds);

    local[sessionId] = {
      ...existing,
      selected_needs: selectedNeeds,
      ...(needsChanged ? { recommended_agent: null, recommendation_source: null, demo_completed: false } : {}),
      current_step: 3,
      updated_at: new Date().toISOString(),
    };
    saveJsonFile(DATA_FILE, local);
    return local[sessionId];
  },

  async updateStep3(
    sessionId: string,
    recommendedAgent: string,
    recommendationSource: 'automatic' | 'manual' = 'automatic'
  ) {
    if (pool) {
      try {
        const { rows } = await pool.query(
          `UPDATE ai_emply_sessions
           SET recommended_agent = $1, recommendation_source = $2, current_step = 4, updated_at = NOW()
           WHERE session_id = $3
           RETURNING *`,
          [recommendedAgent, recommendationSource, sessionId]
        );
        if (rows.length > 0) return rows[0];
      } catch (err) {
        console.warn('[DB] Postgres updateStep3 failed, falling back to local file:', (err as Error).message);
      }
    }

    const local = getJsonFile<Record<string, any>>(DATA_FILE);
    const existing = local[sessionId] || {
      id: crypto.randomUUID(),
      session_id: sessionId,
      created_at: new Date().toISOString(),
    };

    local[sessionId] = {
      ...existing,
      recommended_agent: recommendedAgent,
      recommendation_source: recommendationSource,
      current_step: 4,
      updated_at: new Date().toISOString(),
    };
    saveJsonFile(DATA_FILE, local);
    return local[sessionId];
  },

  async updateDemoCompleted(sessionId: string, nextStep: number = 5) {
    if (pool) {
      try {
        const { rows } = await pool.query(
          `UPDATE ai_emply_sessions
           SET demo_completed = true, current_step = $1, updated_at = NOW()
           WHERE session_id = $2
           RETURNING *`,
          [nextStep, sessionId]
        );
        if (rows.length > 0) return rows[0];
      } catch (err) {
        console.warn('[DB] Postgres updateDemoCompleted failed:', (err as Error).message);
      }
    }

    const local = getJsonFile<Record<string, any>>(DATA_FILE);
    if (local[sessionId]) {
      local[sessionId].demo_completed = true;
      local[sessionId].current_step = nextStep;
      local[sessionId].updated_at = new Date().toISOString();
      saveJsonFile(DATA_FILE, local);
      return local[sessionId];
    }
    return null;
  },

  // ── Demo Chat Messages Operations ────────────────────────────

  async saveDemoChatMessage(
    sessionId: string,
    agentId: string,
    role: string,
    content: string,
    intent?: string,
    metadata?: Record<string, any>
  ) {
    const msgId = crypto.randomUUID();
    const now = new Date().toISOString();

    if (pool) {
      try {
        await pool.query(
          `INSERT INTO demo_chat_messages (id, session_id, agent_id, role, content, intent, metadata, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, NOW())`,
          [msgId, sessionId, agentId, role, content, intent || null, metadata ? JSON.stringify(metadata) : null]
        );
      } catch (err) {
        console.warn('[DB] Postgres saveDemoChatMessage failed, saving locally:', (err as Error).message);
      }
    }

    const local = getJsonFile<Record<string, any[]>>(CHAT_FILE);
    if (!local[sessionId]) local[sessionId] = [];
    local[sessionId].push({
      id: msgId,
      session_id: sessionId,
      agent_id: agentId,
      role,
      content,
      intent,
      metadata,
      created_at: now,
    });
    saveJsonFile(CHAT_FILE, local);

    return { id: msgId, created_at: now };
  },

  async getDemoChatMessages(sessionId: string) {
    if (pool) {
      try {
        const { rows } = await pool.query(
          'SELECT * FROM demo_chat_messages WHERE session_id = $1 ORDER BY created_at ASC',
          [sessionId]
        );
        if (rows.length > 0) return rows;
      } catch (err) {
        console.warn('[DB] Postgres getDemoChatMessages failed, reading locally:', (err as Error).message);
      }
    }

    const local = getJsonFile<Record<string, any[]>>(CHAT_FILE);
    return local[sessionId] || [];
  },

  // ── Demo Leads Operations ────────────────────────────────────

  async saveDemoLead(
    sessionId: string,
    agentId: string,
    businessType: string,
    leadData: { name?: string; phone?: string; email?: string; interest?: string },
    conversationSummary?: string
  ) {
    const leadId = crypto.randomUUID();
    const now = new Date().toISOString();

    if (pool) {
      try {
        await pool.query(
          `INSERT INTO demo_leads (id, session_id, agent_id, business_type, name, phone, email, interest, conversation_summary, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
          [
            leadId,
            sessionId,
            agentId,
            businessType,
            leadData.name || null,
            leadData.phone || null,
            leadData.email || null,
            leadData.interest || null,
            conversationSummary || null,
          ]
        );
      } catch (err) {
        console.warn('[DB] Postgres saveDemoLead failed, saving locally:', (err as Error).message);
      }
    }

    const local = getJsonFile<Record<string, any[]>>(LEADS_FILE);
    if (!local[sessionId]) local[sessionId] = [];
    local[sessionId].push({
      id: leadId,
      session_id: sessionId,
      agent_id: agentId,
      business_type: businessType,
      name: leadData.name || null,
      phone: leadData.phone || null,
      email: leadData.email || null,
      interest: leadData.interest || null,
      conversation_summary: conversationSummary || null,
      created_at: now,
    });
    saveJsonFile(LEADS_FILE, local);

    return { id: leadId, created_at: now };
  },

  async getDemoLeadBySessionId(sessionId: string) {
    if (pool) {
      try {
        const { rows } = await pool.query(
          'SELECT * FROM demo_leads WHERE session_id = $1 ORDER BY created_at DESC LIMIT 1',
          [sessionId]
        );
        if (rows.length > 0) return rows[0];
      } catch (err) {
        console.warn('[DB] Postgres getDemoLeadBySessionId failed, reading locally:', (err as Error).message);
      }
    }

    const local = getJsonFile<Record<string, any[]>>(LEADS_FILE);
    const leads = local[sessionId] || [];
    return leads.length > 0 ? leads[leads.length - 1] : null;
  },

  // ── Customer Enquiries Operations (Step 5) ───────────────────

  async createCustomerEnquiry(payload: CustomerEnquiryPayload) {
    const {
      sessionId,
      fullName,
      businessName,
      email,
      phone,
      businessType,
      businessDescription,
      selectedNeeds,
      recommendedAgent,
      additionalDetails,
      dynamicAnswers,
      demoCompleted,
    } = payload;

    // 1. Duplicate Prevention Check
    const existing = await this.getCustomerEnquiry(sessionId);
    if (existing) {
      return { enquiry: existing, isDuplicate: true };
    }

    const enquiryId = crypto.randomUUID();
    const now = new Date().toISOString();

    if (pool) {
      try {
        const { rows } = await pool.query(
          `INSERT INTO customer_enquiries (
            id, session_id, full_name, business_name, email, phone,
            business_type, business_description, selected_needs, recommended_agent,
            additional_details, dynamic_answers, demo_completed, status, source, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11, $12::jsonb, $13, 'new', 'ai_emply_website', NOW(), NOW()
          ) RETURNING *`,
          [
            enquiryId,
            sessionId,
            fullName,
            businessName,
            email,
            phone,
            businessType || null,
            businessDescription || null,
            selectedNeeds ? JSON.stringify(selectedNeeds) : null,
            recommendedAgent || null,
            additionalDetails || null,
            dynamicAnswers ? JSON.stringify(dynamicAnswers) : null,
            demoCompleted ?? true,
          ]
        );

        // Also update session to status = 'completed'
        await pool.query(
          `UPDATE ai_emply_sessions
           SET full_name = $1, business_name = $2, email = $3, phone = $4,
               workflow_details = $5, dynamic_answers = $6::jsonb, demo_completed = true, current_step = 5,
               status = 'completed', updated_at = NOW()
           WHERE session_id = $7`,
          [fullName, businessName, email, phone, additionalDetails || null, dynamicAnswers ? JSON.stringify(dynamicAnswers) : null, sessionId]
        );

        return { enquiry: rows[0], isDuplicate: false };
      } catch (err) {
        console.warn('[DB] Postgres createCustomerEnquiry failed, saving locally:', (err as Error).message);
      }
    }

    // Local fallback
    const localEnquiries = getJsonFile<Record<string, any>>(ENQUIRIES_FILE);
    const enquiryRecord = {
      id: enquiryId,
      session_id: sessionId,
      full_name: fullName,
      business_name: businessName,
      email,
      phone,
      business_type: businessType || null,
      business_description: businessDescription || null,
      selected_needs: selectedNeeds || null,
      recommended_agent: recommendedAgent || null,
      additional_details: additionalDetails || null,
      dynamic_answers: dynamicAnswers || null,
      demo_completed: demoCompleted ?? true,
      status: 'new',
      source: 'ai_emply_website',
      created_at: now,
      updated_at: now,
    };
    localEnquiries[sessionId] = enquiryRecord;
    saveJsonFile(ENQUIRIES_FILE, localEnquiries);

    // Update local session
    const localSessions = getJsonFile<Record<string, any>>(DATA_FILE);
    if (localSessions[sessionId]) {
      localSessions[sessionId] = {
        ...localSessions[sessionId],
        full_name: fullName,
        business_name: businessName,
        email,
        phone,
        workflow_details: additionalDetails || null,
        dynamic_answers: dynamicAnswers || null,
        demo_completed: true,
        current_step: 5,
        status: 'completed',
        updated_at: now,
      };
      saveJsonFile(DATA_FILE, localSessions);
    }

    return { enquiry: enquiryRecord, isDuplicate: false };
  },

  async getCustomerEnquiry(sessionId: string) {
    if (pool) {
      try {
        const { rows } = await pool.query(
          'SELECT * FROM customer_enquiries WHERE session_id = $1 LIMIT 1',
          [sessionId]
        );
        if (rows.length > 0) return rows[0];
      } catch (err) {
        console.warn('[DB] Postgres getCustomerEnquiry failed, reading locally:', (err as Error).message);
      }
    }

    const local = getJsonFile<Record<string, any>>(ENQUIRIES_FILE);
    return local[sessionId] || null;
  },
};

export default pool;
