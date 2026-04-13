import { fromPairs } from "lodash";

import type { MaterielCompilationInfoType } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";

export function flatMaterielInfo(materiels: MaterielCompilationInfoType[]) {
  const objectFromPairs = fromPairs(materiels.map((everyMaterielInfo) => {
    return [everyMaterielInfo.alias, everyMaterielInfo]
  }));
  // console.log("objectFromPairs", objectFromPairs);
  return objectFromPairs;
};