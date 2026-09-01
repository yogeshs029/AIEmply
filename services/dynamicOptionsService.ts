import { industriesConfig, IndustryConfig, getIndustryConfig } from '@/config/industries';
import { businessNeedsCatalog, BusinessNeed, getNeedsForIndustry } from '@/config/businessNeeds';
import { getDynamicQuestionsForIndustry, DynamicQuestion } from '@/config/step5Questions';

export class DynamicOptionsService {
  /** Returns all available industries */
  getAllIndustries(): IndustryConfig[] {
    return industriesConfig;
  }

  /** Returns configuration for a specific industry */
  getIndustry(industryId: string): IndustryConfig {
    return getIndustryConfig(industryId);
  }

  /** Returns dynamic business needs for the given industry */
  getNeedsForIndustry(industryId: string): BusinessNeed[] {
    return getNeedsForIndustry(industryId);
  }

  /** Returns dynamic Step 5 questions tailored to the industry */
  getStep5Questions(industryId: string): DynamicQuestion[] {
    return getDynamicQuestionsForIndustry(industryId);
  }

  /**
   * Validates if the selected needs are valid for the given industry.
   * Returns filtered list of valid needs.
   */
  filterValidNeedsForIndustry(industryId: string, needs: string[]): string[] {
    const validNeedIds = new Set(this.getNeedsForIndustry(industryId).map((n) => n.id));
    return needs.filter((id) => validNeedIds.has(id));
  }
}

export const dynamicOptionsService = new DynamicOptionsService();
