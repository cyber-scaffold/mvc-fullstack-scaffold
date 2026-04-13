import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/compilation/cores/IOCContainer";

import { CompilationConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";
import { CompilationMaterielResourceDatabaseManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationMaterielResourceDatabaseManager";

import { CompilerActionService } from "@/frameworks/mpa-ssr-tool-box/compilation/actions/CompilerActionService";

import { materielsSummaryTransformer } from "@/frameworks/mpa-ssr-tool-box/compilation/utils/materielsSummaryTransformer";

import type { CustmerInputCompilationConfigType } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";

export async function setCompileConfiguration(inputCustmerConfig?: CustmerInputCompilationConfigType): Promise<void> {
  /** 初始化配置文件 **/
  const $CompilationConfigManager = IOCContainer.get(CompilationConfigManager);
  await $CompilationConfigManager.initialize(inputCustmerConfig);
  /** 初始化工程环境 **/
  const $CompilerActionService = IOCContainer.get(CompilerActionService);
  await $CompilerActionService.initialize();
  /** 初始化物料数据库 **/
  const $CompilationMaterielResourceDatabaseManager = IOCContainer.get(CompilationMaterielResourceDatabaseManager);
  await $CompilationMaterielResourceDatabaseManager.initialize();
  /** 获取物料概览管理数据库 **/
  const summaryDatabase = $CompilationMaterielResourceDatabaseManager.getSummaryDatabase();
  const { materielArrayList } = $CompilationConfigManager.getRuntimeConfig();
  /** 在概览数据库中保存物料的类型信息 **/
  summaryDatabase.data = materielsSummaryTransformer(materielArrayList);
  await summaryDatabase.write();
};