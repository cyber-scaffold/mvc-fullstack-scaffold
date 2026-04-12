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
    /** 编译DLL **/
    // await IOCContainer.get(DLLBuildController).execute();
    /** 编译SSR物料 **/
    await IOCContainer.get(MakeMaterielResource).buildMaterielResource();
    /** 编译Express主服务应用 **/
    await IOCContainer.get(MakeServerApplication).startBuild();
  } catch (error) {
    console.log("error", error);
    process.exit(0);
  };
});
