import { CompilationMaterielResourceDatabaseManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationMaterielResourceDatabaseManager";

import type { Compiler } from "webpack";

export enum CompilerProgressStatus {
  COMPILE = "compile",
  EMIT = "emit",
  DONE = "done"
};

export type CompilerProgressPluginType = {
  type: "hydration" | "dehydration",
  materielResourceDatabaseManager: CompilationMaterielResourceDatabaseManager
};

export class CompilerProgressPlugin {

  private params: CompilerProgressPluginType;

  constructor (params: CompilerProgressPluginType) {
    // 接收外部传入的参数
    this.params = params;
  };

  // apply方法是Webpack插件的入口
  public apply(compiler: Compiler) {
    // 在编译开始时触发
    compiler.hooks.compile.tap("CompilerProgressPlugin", async (params) => {
      if (this.params.type === "hydration") {
        const hydrationCompileDatabase = this.params.materielResourceDatabaseManager.getHydrationCompileDatabase();
        hydrationCompileDatabase.data["status"] = CompilerProgressStatus.COMPILE;
        await hydrationCompileDatabase.write();
      };
      if (this.params.type === "dehydration") {
        const dehydrationCompileDatabase = this.params.materielResourceDatabaseManager.getDehydrationCompileDatabase();
        dehydrationCompileDatabase.data["status"] = CompilerProgressStatus.COMPILE;
        await dehydrationCompileDatabase.write();
      };
      // console.log(this.params.alias, "compile");
    });

    // 在资源即将输出前触发
    compiler.hooks.emit.tapAsync("CompilerProgressPlugin", async (compilation, callback) => {
      if (this.params.type === "hydration") {
        const hydrationCompileDatabase = this.params.materielResourceDatabaseManager.getHydrationCompileDatabase();
        hydrationCompileDatabase.data["status"] = CompilerProgressStatus.EMIT;
        await hydrationCompileDatabase.write();
      };
      if (this.params.type === "dehydration") {
        const dehydrationCompileDatabase = this.params.materielResourceDatabaseManager.getDehydrationCompileDatabase();
        dehydrationCompileDatabase.data["status"] = CompilerProgressStatus.EMIT;
        await dehydrationCompileDatabase.write();
      };
      callback();
      // console.log(this.params.alias, "emit");
    });

    // 在编译完成时触发
    compiler.hooks.done.tap("CompilerProgressPlugin", async (stats) => {
      if (this.params.type === "hydration") {
        const hydrationCompileDatabase = this.params.materielResourceDatabaseManager.getHydrationCompileDatabase();
        hydrationCompileDatabase.data["status"] = CompilerProgressStatus.DONE;
        // await this.clearHistoryResource(hydrationCompileDatabase.data[this.params.alias]);
        await hydrationCompileDatabase.write();
      };
      if (this.params.type === "dehydration") {
        const dehydrationCompileDatabase = this.params.materielResourceDatabaseManager.getDehydrationCompileDatabase();
        dehydrationCompileDatabase.data["status"] = CompilerProgressStatus.DONE;
        // await this.clearHistoryResource(dehydrationCompileDatabase.data[this.params.alias]);
        await dehydrationCompileDatabase.write();
      };
      // console.log(this.params.alias, "done");
    });
  };

};