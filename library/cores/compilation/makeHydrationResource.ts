import { IOCContainer } from "@/library/commons/IOCContainer";
import { HydrationResourceManagement } from "@/library/services/mechanism/HydrationResourceManagement";

export type makeHydrationResourceParamsType = {
  /** 注水物料的别名,在后期获取物料的时候需要使用到,建议全局唯一 **/
  alias: string
  /** 注水物料指向的原文件 **/
  source: string
  /** 运行模式 **/
  mode: "development" | "production" | "none"
  /** 是否使用watch模式监听文件的改变 **/
  watch: boolean
};

/**
 * 编译注水物料的入口函数
 * **/
export async function makeHydrationResource({ alias, source, mode, watch }: makeHydrationResourceParamsType) {
  const $HydrationResourceManagement = IOCContainer.get(HydrationResourceManagement);
  /** 检查原代码路径并进行关联 **/
  await $HydrationResourceManagement.checkSourceCodeAndRelation(source);
  /** 根据不同的模式和参数对物料进行编译  **/
  await $HydrationResourceManagement.buildResourceWithUniqueAlias({ alias, mode, watch });
};