import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/runtime/cores/IOCContainer";
import { ResourceSummaryManagement } from "@/frameworks/mpa-ssr-tool-box/runtime/services/ResourceSummaryManagement";

import type { MaterielsSummaryQueryResult } from "@/frameworks/mpa-ssr-tool-box/runtime/services/ResourceSummaryManagement";

/**
 * 获取脱水物料资源的入口函数
 * **/
export async function getResourceSummary(alias: string): Promise<MaterielsSummaryQueryResult> {
  const $ResourceSummaryManagement = IOCContainer.get(ResourceSummaryManagement);
  const summaryDetail = await $ResourceSummaryManagement.getSummaryDetailByAlias(alias);
  if (!summaryDetail) {
    return false;
  }
  return summaryDetail;
};