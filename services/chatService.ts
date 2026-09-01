import {
  ChatProvider,
  ChatProviderHealth,
  ChatGenerateParams,
  ChatGenerateResult,
} from '@/types/chat';
import { openAIChatService } from './openAIChatService';
import { ollamaChatService } from './ollamaChatService';
import { defaultChatEngine } from './demoChatEngine';

export class UnifiedChatService implements ChatProvider {
  /**
   * Health check: Checks OpenAI first, then Ollama, otherwise returns mock
   */
  async healthCheck(): Promise<ChatProviderHealth> {
    const openaiHealth = await openAIChatService.healthCheck();
    if (openaiHealth.online) {
      return openaiHealth;
    }

    const ollamaHealth = await ollamaChatService.healthCheck();
    if (ollamaHealth.online) {
      return ollamaHealth;
    }

    return {
      online: true,
      provider: 'mock',
      model: 'built-in-demo-engine',
    };
  }

  /**
   * Generates response using the highest priority available provider:
   * 1. OpenAI (if OPENAI_API_KEY is configured)
   * 2. Ollama (if local daemon is running)
   * 3. MockDemoChatEngine (structured offline fallback)
   */
  async generateResponse(params: ChatGenerateParams): Promise<ChatGenerateResult> {
    // 1. Check if OpenAI is configured
    const openaiHealth = await openAIChatService.healthCheck();
    if (openaiHealth.online) {
      try {
        return await openAIChatService.generateResponse(params);
      } catch (err) {
        console.warn('[UnifiedChatService] OpenAI call failed, trying Ollama/fallback:', (err as Error).message);
      }
    }

    // 2. Check if Ollama is available
    const ollamaHealth = await ollamaChatService.healthCheck();
    if (ollamaHealth.online) {
      try {
        return await ollamaChatService.generateResponse(params);
      } catch (err) {
        console.warn('[UnifiedChatService] Ollama call failed, falling back to mock:', (err as Error).message);
      }
    }

    // 3. Structured fallback
    const fallbackRes = await defaultChatEngine.generateResponse({
      sessionId: params.sessionId,
      businessType: params.businessType,
      selectedNeeds: params.selectedNeeds,
      agent: params.agent,
      userMessage: params.userMessage,
      chatHistory: params.chatHistory,
    });

    return {
      reply: fallbackRes.reply,
      intent: fallbackRes.intent,
      actionTaken: fallbackRes.actionTaken,
      leadCaptured: fallbackRes.leadCaptured,
      leadData: fallbackRes.leadData,
      source: 'mock',
    };
  }
}

export const chatService = new UnifiedChatService();
