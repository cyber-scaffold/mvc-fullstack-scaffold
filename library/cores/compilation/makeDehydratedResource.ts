import { IOCContainer } from "@/library/commons/IOCContainer";
import { DehydrationResourceManagement } from "@/library/services/mechanism/DehydrationResourceManagement";

export type makeDehydratedResourceParamsType = {
  /** 脱水物料的别名,在后期获取物料的时候需要使用到,建议全局唯一 **/
  alias: string
  /** 脱水物料指向的原文件 **/
  source: string
  /** 运行模式 **/
  mode: "development" | "production" | "none"
  /** 是否使用watch模式监听文件的改变 **/
  watch: boolean
};

/**
 * 编译脱水物料的入口函数
 * **/
export async function makeDehydratedResource({ alias, source, mode, watch }: makeDehydratedResourceParamsType) {
  const $DehydrationResourceManagement = IOCContainer.get(DehydrationResourceManagement);
  /** 检查原代码路径并进行关联 **/
  await $DehydrationResourceManagement.checkSourceCodeAndRelation(source);
  /** 根据唯一的alis别名智能判定是否进行编译 **/
  await $DehydrationResourceManagement.smartDecideWithUniqueAlias(alias);
  const compileAssetsInfo = await $DehydrationResourceManagement.getResourceListWithAlias(alias);
  return compileAssetsInfo.assets;
};