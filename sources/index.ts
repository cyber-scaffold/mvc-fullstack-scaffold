import { IOCContainer } from "@/sources/applications/IOCContainer";
import { ExpressHttpServer } from "@/sources/applications/ExpressHttpServer";


/** 获取应用启动类,然后执行启动 **/
setImmediate(async () => {
  await IOCContainer.get(ExpressHttpServer).bootstrap();
});
