#!/usr/bin/env node
import { IOCContainer } from "@/frameworks/cores/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";

// import { MakePublicDLLFile } from "@/frameworks/actions/MakePublicDLLFile";
import { MakeMaterielResource } from "@/frameworks/actions/MakeMaterielResource";
import { MakeServerApplication } from "@/frameworks/actions/MakeServerApplication";
import { CompilerActionService } from "@/frameworks/services/CompilerActionService";

setImmediate(async () => {
  try {
    await IOCContainer.get(FrameworkConfigManager).initialize();
    await IOCContainer.get(CompilerActionService).cleanDestnation();
    /** 编译DLL文件 **/
    // await IOCContainer.get(MakePublicDLLFile).execute();
    /** 开发模式SSR物料编译 **/
    await IOCContainer.get(MakeMaterielResource).startDevelopmentMode();
    /** 开发模式Express主服务应用编译 **/
    await IOCContainer.get(MakeServerApplication).startDevelopmentMode();
  } catch (error) {
    console.log("error", error);
    process.exit(0);
  };
});