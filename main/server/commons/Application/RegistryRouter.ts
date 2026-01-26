import { Express } from "express";
import { injectable, inject } from "inversify";
import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";

import { DetailPageController } from "@/main/server/controllers/DetailPageController";
import { IndexPageController } from "@/main/server/controllers/IndexPageController";
import { UserPageController } from "@/main/server/controllers/UserPageController";
import { SearchController } from "@/main/server/controllers/SearchController";

@injectable()
export class RegistryRouter {

  constructor(
    @inject(DetailPageController) private readonly $DetailPageController: DetailPageController,
    @inject(IndexPageController) private readonly $IndexPageController: IndexPageController,
    @inject(UserPageController) private readonly $UserPageController: UserPageController,
    @inject(SearchController) private readonly $SearchController: SearchController,
  ) { }

  /** 执行路由注册 **/
  public async execute(expressInstance: Express) {
    expressInstance.use(this.$DetailPageController.getRouter());
    expressInstance.use(this.$IndexPageController.getRouter());
    expressInstance.use(this.$UserPageController.getRouter());
    expressInstance.use(this.$SearchController.getRouter());
  };

};

IOCContainer.bind(RegistryRouter).toSelf().inRequestScope();