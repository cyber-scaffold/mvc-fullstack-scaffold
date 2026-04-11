import vm from "vm";
import fs from "fs";
import path from "path";
import Module from "module";
import { promisify } from "util";
import { getWindow, getDocument } from "ssr-window";

import { IOCContainer } from "@/library/runtime/cores/IOCContainer";
import { RuntimeConfigManager } from "@/library/runtime/commons/RuntimeConfigManager";

/**
 * 基于nodejs的vm模块加载脱水渲染函数
 * **/
export async function renderDehydratedResourceWithSandbox(resourceFilePath: string, content?: any) {
  const $RuntimeConfigManager = IOCContainer.get(RuntimeConfigManager);
  const { projectDirectoryPath, dehydrationResourceDirectoryPath } = $RuntimeConfigManager.getRuntimeConfig();
  /** 由于脱水物料的路径信息使用的是相对路径,最终的真实路径需要在运行时进行实时计算 **/
  const realDehydratedResourceFilePath = path.resolve(dehydrationResourceDirectoryPath, resourceFilePath);
  const resourceFileCode = await promisify(fs.readFile)(realDehydratedResourceFilePath, "utf-8");
  const requireProject: NodeJS.Require = Module.createRequire(path.resolve(projectDirectoryPath, "./package.json"));
  const sandbox = {
    module: { exports: {} },
    exports: {},
    process: process,
    window: getWindow(),
    document: getDocument(),
    require: requireProject,
    __dirname: path.dirname(realDehydratedResourceFilePath),
    __filename: realDehydratedResourceFilePath,
    console
  };
  vm.createContext(sandbox);
  vm.runInContext(resourceFileCode, sandbox, { filename: realDehydratedResourceFilePath });
  const moduleExportInfo = (sandbox.module.exports as any);
  if (moduleExportInfo.default) {
    return moduleExportInfo.default(content);
  };
  throw new Error(`module error ${resourceFilePath} "export default ..." statement not exist`);
};