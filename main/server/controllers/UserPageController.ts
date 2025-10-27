import path from "path";
import { Router, Request } from "express";
import { injectable, inject } from "inversify";

import { responseHtmlWrapper } from "@/frameworks/librarys/responseHtmlWrapper";

import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";
import { renderHTMLContent } from "@/main/server/utils/renderHTMLContent";
import { compileDehydratedRenderMethod, compileHydrationResource, renderDehydratedResourceWithSandbox } from "@/library";

@injectable()
export class UserPageController {

  public async getRenderResource() {
    const dehydratedRenderMethodTask = compileDehydratedRenderMethod({
      source: path.resolve(process.cwd(), "./main/views/pages/UserPage/index.tsx")
    });
    const hydrationResourceTask = compileHydrationResource({
      source: path.resolve(process.cwd(), "./main/views/pages/UserPage/index.tsx")
    });
    const [dehydratedRenderMethod, hydrationResource] = await Promise.all([dehydratedRenderMethodTask, hydrationResourceTask]);
    return { dehydrated: dehydratedRenderMethod, hydration: hydrationResource };
  };

  public getRouter() {
    return Router().get("/user", responseHtmlWrapper(async (request: Request) => {
      return await this.execute(request);
    }));
  };

  public async execute(request: Request): Promise<any> {
    const { dehydrated, hydration }: any = await this.getRenderResource();
    const dehydratedViewContent = await renderDehydratedResourceWithSandbox(dehydrated.javascript[0], {});
    return renderHTMLContent({
      hydrationAssets: hydration,
      dehydrationViewContent: dehydratedViewContent,
      meta: {
        title: "用户中心",
        keywords: [],
        description: "",
      },
      content: {}
    });
  };

};

IOCContainer.bind(UserPageController).toSelf().inRequestScope();