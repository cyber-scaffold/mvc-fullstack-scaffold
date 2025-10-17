import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";
import { ExpressHttpServer } from "@/main/server/commons/Application/ExpressHttpServer";

import { compileConfiguration } from "@/library";

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

/** 获取应用启动类,然后执行启动 **/
setImmediate(async () => {
  await compileConfiguration();
  await IOCContainer.get(ExpressHttpServer).bootstrap();
});