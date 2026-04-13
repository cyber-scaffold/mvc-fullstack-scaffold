#!/usr/bin/env node
import { IOCContainer } from "@/frameworks/mpa-ssr-build-tool/cores/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/mpa-ssr-build-tool/commons/FrameworkConfigManager";

// import { MakePublicDLLFile } from "@/frameworks/mpa-ssr-build-tool/actions/MakePublicDLLFile";
import { MakeMaterielResource } from "@/frameworks/mpa-ssr-build-tool/actions/MakeMaterielResource";
import { MakeServerApplication } from "@/frameworks/mpa-ssr-build-tool/actions/MakeServerApplication";
import { CompilerActionService } from "@/frameworks/mpa-ssr-build-tool/services/CompilerActionService";

setImmediate(async () => {
  try {
    await IOCContainer.get(FrameworkConfigManager).initialize();
    await IOCContainer.get(CompilerActionService).cleanDestnation();
    /** 编译DLL文件 **/
    // await IOCContainer.get(MakePublicDLLFile).execute();
    /** 开发模式SSR物料编译 **/
    await IOCContainer.get(MakeMaterielResource).buildMaterielResourceByDevelopmentAndWatch();
    /** 开发模式Express主服务应用编译 **/
    await IOCContainer.get(MakeServerApplication).bootstrapByDevelopmentMode();
  } catch (error) {
    console.log("error", error);
    process.exit(0);
  };
});