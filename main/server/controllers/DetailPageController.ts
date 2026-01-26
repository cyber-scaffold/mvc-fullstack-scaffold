import path from "path";
import { Router, Request } from "express";
import { injectable, inject } from "inversify";
import { makeDehydratedResource, makeHydrationResource, renderDehydratedResourceWithSandbox } from "@/library";

import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";
import { responseHtmlWrapper } from "@/main/server/utils/responseHtmlWrapper";
import { renderHTMLContent } from "@/main/server/utils/renderHTMLContent";


@injectable()
export class DetailPageController {

  /** 获取脱水和注水资源的方法可以用于预处理和运行时渲染 **/
  public async getRenderResource() {
    const projectDirectoryPath = path.resolve(path.dirname(__filename), "../");
    const dehydratedRenderMethodTask = makeDehydratedResource({
      alias: "DetailPage",
      source: path.resolve(projectDirectoryPath, "./main/views/pages/DetailPage/index.tsx")
    });
    const hydrationResourceTask = makeHydrationResource({
      alias: "DetailPage",
      source: path.resolve(projectDirectoryPath, "./main/views/pages/DetailPage/index.tsx")
    });
    const [dehydratedRenderMethod, hydrationResource] = await Promise.all([dehydratedRenderMethodTask, hydrationResourceTask]);
    return { dehydrated: dehydratedRenderMethod, hydration: hydrationResource };
  };

  /** 注册路由的方法 **/
  public getRouter() {
    return Router().get("/detail", responseHtmlWrapper(async (request: Request) => {
      return await this.execute(request);
    }));
  };

  /** 路由的业务逻辑 **/
  public async execute(request: Request): Promise<any> {
    const { dehydrated, hydration }: any = await this.getRenderResource();
    const dehydratedViewContent = await renderDehydratedResourceWithSandbox(dehydrated.javascript[0]);
    return renderHTMLContent({
      hydrationAssets: hydration,
      dehydrationViewContent: dehydratedViewContent,
      meta: {
        title: "详情页",
        keywords: [],
        description: "这是详情页",
      },
      content: {}
    });
  };

};

IOCContainer.bind(DetailPageController).toSelf().inRequestScope();