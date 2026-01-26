import { IOCContainer } from "@/library/commons/IOCContainer";
import { DehydrationResourceManagement } from "@/library/services/mechanism/DehydrationResourceManagement";


export type getDehydratedResourceParamsType = {
  /** 脱水物料的别名 **/
  alias: string
};

/**
 * 获取脱水物料资源的入口函数
 * **/
export async function getDehydratedResource(params: getDehydratedResourceParamsType) {
  const $DehydrationResourceManagement = IOCContainer.get(DehydrationResourceManagement);

};