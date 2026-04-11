import { fromPairs } from "lodash";

import type { IMaterielInfo } from "@/library/compilation/commons/CompilationConfigManager";

export function flatMaterielInfo(materiels: IMaterielInfo[]) {
  const objectFromPairs = fromPairs(materiels.map((everyMaterielInfo) => {
    return [everyMaterielInfo.alias, everyMaterielInfo]
  }));
  // console.log("objectFromPairs", objectFromPairs);
  return objectFromPairs;
};