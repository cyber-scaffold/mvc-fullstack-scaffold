import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";

/**
 * 将视图层的入口文件包装成可以渲染到网页上的模块并返回临时文件的路径给webpack作为编译入口
 * **/
@injectable()
export class WapperClientService {



};


IOCContainer.bind(WapperClientService).toSelf().inRequestScope();