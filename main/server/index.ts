import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";
import { ExpressHttpServer } from "@/main/server/commons/Application/ExpressHttpServer";


declare global {
  namespace NodeJS {
    interface Process {
      isClient: boolean,
      isServer: boolean
    }
  }
  interface Window {
    seo: any,
    content: any,
    process: any
  }
};


const serverApplicationInstance = IOCContainer.get(ExpressHttpServer);

setImmediate(async () => {
  await serverApplicationInstance.beforeBootstrap();
  await serverApplicationInstance.bootstrap();
});