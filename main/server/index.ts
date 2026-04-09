import { setAndInitializeRuntimeConfig } from "@/library/runtime";
import { IOCContainer } from "@/main/server/cores/IOCContainer";

import { ApplicationConfigManager } from "@/main/server/commons/Application/ApplicationConfigManager";
import { ExpressHttpServer } from "@/main/server/commons/Application/ExpressHttpServer";


setImmediate(async () => {
  await setAndInitializeRuntimeConfig();
  await IOCContainer.get(ApplicationConfigManager).initialize();
  const serverApplicationInstance = IOCContainer.get(ExpressHttpServer);
  await serverApplicationInstance.bootstrap();
});