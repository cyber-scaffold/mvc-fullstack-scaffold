import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";


/**
 * 脱水和注水物料的构建
 * **/
@injectable()
export class MaterielResourceBuildController {

};

IOCContainer.bind(MaterielResourceBuildController).toSelf().inRequestScope();