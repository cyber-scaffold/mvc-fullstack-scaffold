import { fromPairs, isUndefined } from "lodash";
import type { MaterielRenderType, MaterielCompilationInfoType } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";

export type MaterielsSummaryPairs = [alias: string, detail: MaterielRenderType][];

export type MaterielsSummaryDictionary = {
  [alias: string]: MaterielRenderType
};

export function materielsSummaryTransformer(materielsConfig: MaterielCompilationInfoType[]): MaterielsSummaryDictionary {
  const materielsSummaryPairs: MaterielsSummaryPairs = materielsConfig.map((everyMaterielInfo: MaterielCompilationInfoType) => {
    const { alias, source, ...otherDetailInfo } = everyMaterielInfo;
    return [alias, otherDetailInfo];
  });
  return fromPairs(materielsSummaryPairs);
};