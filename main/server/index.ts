import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";
import { ExpressHttpServer } from "@/main/server/commons/Application/ExpressHttpServer";


setImmediate(async () => {
  const serverApplicationInstance = IOCContainer.get(ExpressHttpServer);
  await serverApplicationInstance.beforeBootstrap();
  await serverApplicationInstance.bootstrap();
});