import { MaterielResourceDatabaseManager } from "@/library/commons/MaterielResourceDatabaseManager";

type CompilerProgressPluginType = {
  alias?: string
  type?: "hydration" | "dehydration",
  materielResourceDatabaseManager?: MaterielResourceDatabaseManager
};

export class CompilerProgressPlugin {

  private params: CompilerProgressPluginType = {};

  constructor(params: CompilerProgressPluginType) {
    // 接收外部传入的参数
    this.params = params;
  }

  // apply方法是Webpack插件的入口
  apply(compiler) {
    // 在编译开始时触发
    compiler.hooks.compile.tap("CompilerProgressPlugin", async (params) => {
      if (this.params.type === "hydration") {
        const hydrationCompileDatabase = this.params.materielResourceDatabaseManager.getHydrationCompileDatabase();
        hydrationCompileDatabase.data[this.params.alias].status = "compile";
        await hydrationCompileDatabase.write();
      };
      if (this.params.type === "dehydration") {
        const dehydrationCompileDatabase = this.params.materielResourceDatabaseManager.getDehydrationCompileDatabase();
        dehydrationCompileDatabase.data[this.params.alias].status = "compile";
        await dehydrationCompileDatabase.write();
      };
      // console.log(this.params.alias, "compile");
    });

    // 在资源即将输出前触发
    compiler.hooks.emit.tapAsync("CompilerProgressPlugin", async (compilation, callback) => {
      if (this.params.type === "hydration") {
        const hydrationCompileDatabase = this.params.materielResourceDatabaseManager.getHydrationCompileDatabase();
        hydrationCompileDatabase.data[this.params.alias].status = "emit";
        await hydrationCompileDatabase.write();
      };
      if (this.params.type === "dehydration") {
        const dehydrationCompileDatabase = this.params.materielResourceDatabaseManager.getDehydrationCompileDatabase();
        dehydrationCompileDatabase.data[this.params.alias].status = "emit";
        await dehydrationCompileDatabase.write();
      };
      callback();
      // console.log(this.params.alias, "emit");
    });

    // 在编译完成时触发
    compiler.hooks.done.tap("CompilerProgressPlugin", async (stats) => {
      if (this.params.type === "hydration") {
        const hydrationCompileDatabase = this.params.materielResourceDatabaseManager.getHydrationCompileDatabase();
        hydrationCompileDatabase.data[this.params.alias].status = "done";
        await hydrationCompileDatabase.write();
      };
      if (this.params.type === "dehydration") {
        const dehydrationCompileDatabase = this.params.materielResourceDatabaseManager.getDehydrationCompileDatabase();
        dehydrationCompileDatabase.data[this.params.alias].status = "done";
        await dehydrationCompileDatabase.write();
      };
      // console.log(this.params.alias, "done");
    });
  };

};