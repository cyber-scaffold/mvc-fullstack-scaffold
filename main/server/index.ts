import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";

import { ApplicationConfigManager } from "@/main/server/commons/Application/ApplicationConfigManager";
import { ExpressHttpServer } from "@/main/server/commons/Application/ExpressHttpServer";


setImmediate(async () => {
  await IOCContainer.get(ApplicationConfigManager).initialize();
  const serverApplicationInstance = IOCContainer.get(ExpressHttpServer);
  await serverApplicationInstance.beforeBootstrap();
  await serverApplicationInstance.bootstrap();
});