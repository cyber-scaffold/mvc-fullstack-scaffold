import { IOCContainer } from "@/main/commons/Application/IOCContainer";
import { ExpressHttpServer } from "@/main/commons/Application/ExpressHttpServer";

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
  await IOCContainer.get(ExpressHttpServer).bootstrap();
});
