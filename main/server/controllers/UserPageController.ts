import path from "path";
import { Router, Request } from "express";
import { injectable, inject } from "inversify";

import { responseHtmlWrapper } from "@/frameworks/librarys/responseHtmlWrapper";

import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";
import { RenderHTMLContentService } from "@/main/server/services/RenderHTMLContentService";
import { compileDehydratedRenderMethod, compileHydrationResource } from "@/library";

@injectable()
export class UserPageController {

  constructor(
    @inject(RenderHTMLContentService) private readonly $RenderHTMLContentService: RenderHTMLContentService
  ) { };

  private async getRenderResource() {
    const dehydratedRenderMethod = compileDehydratedRenderMethod({
      source: path.resolve(process.cwd(), "./main/views/pages/UserPage/index.tsx")
    });
    const hydrationResource = compileHydrationResource({
      source: path.resolve(process.cwd(), "./main/views/pages/UserPage/index.tsx")
    });
    await Promise.all([dehydratedRenderMethod, hydrationResource]);
    return { dehydrated: dehydratedRenderMethod, hydration: hydrationResource };
  };

  public async getRouter() {
    await this.getRenderResource();
    return Router().get("/user", responseHtmlWrapper(async (request: Request) => {
      return await this.execute(request);
    }));
  };

  public async execute(request: Request): Promise<any> {
    // const renderContent = await this.$RenderHTMLContentService.getContentString({
    //   title: "用户中心",
    //   assets: {
    //     stylesheet: "/pages/UserPage/index.css",
    //     javascript: "/pages/UserPage/index.js"
    //   },
    //   component: UserPage,
    //   content: {}
    // });
    // return renderContent;
  };

};

IOCContainer.bind(UserPageController).toSelf().inRequestScope();