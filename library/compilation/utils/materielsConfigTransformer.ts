import { fromPairs, isUndefined } from "lodash";
import type { MaterielCompilationInfoType } from "@/library/compilation/commons/CompilationConfigManager";

/**
 * 基于alias进行索引的物料信息字典
 * **/
export type MaterielInfoByAliasDictionaryType = {
  [alias: string]: MaterielCompilationInfoType
};

export type MaterielsConfigTransformerRetuenType = {
  hydrate: MaterielInfoByAliasDictionaryType
  dehydrate: MaterielInfoByAliasDictionaryType
};

/**
 * 对用户输入的物料清单进行转换,转换出需要编译的脱水和注水文件的字典类型
 * **/
export function materielsConfigTransformer(materielsConfig: MaterielCompilationInfoType[]): MaterielsConfigTransformerRetuenType {

  const hydrateModuleList: [string, MaterielCompilationInfoType][] = [];

  const dehydrateModuleList: [string, MaterielCompilationInfoType][] = [];

  materielsConfig.forEach((everyMaterielInfo: MaterielCompilationInfoType) => {
    if (isUndefined(everyMaterielInfo.hydrate)) {
      everyMaterielInfo.hydrate = true;
    };
    if (Boolean(everyMaterielInfo.hydrate)) {
      hydrateModuleList.push([everyMaterielInfo.alias, everyMaterielInfo]);
    };
    if (isUndefined(everyMaterielInfo.dehydrate)) {
      everyMaterielInfo.dehydrate = true;
    };
    if (Boolean(everyMaterielInfo.dehydrate)) {
      dehydrateModuleList.push([everyMaterielInfo.alias, everyMaterielInfo]);
    };
  });

  return { hydrate: fromPairs(hydrateModuleList), dehydrate: fromPairs(dehydrateModuleList) };

};