import path from "path";
import { Router, Request } from "express";
import { injectable, inject } from "inversify";
import { compileDehydratedResource, compileHydrationResource, renderDehydratedResourceWithSandbox } from "@/library";

import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";
import { responseHtmlWrapper } from "@/main/server/utils/responseHtmlWrapper";
import { renderHTMLContent } from "@/main/server/utils/renderHTMLContent";

@injectable()
export class SearchController {

  /** 获取脱水和注水资源的方法可以用于预处理和运行时渲染 **/
  public async getRenderResource() {
    const projectDirectoryPath = path.resolve(path.dirname(__filename), "../");
    const dehydratedRenderMethodTask = compileDehydratedResource({
      source: path.resolve(projectDirectoryPath, "./main/views/pages/SearchPage/index.tsx")
    });
    const hydrationResourceTask = compileHydrationResource({
      source: path.resolve(projectDirectoryPath, "./main/views/pages/SearchPage/index.tsx")
    });
    const [dehydratedRenderMethod, hydrationResource] = await Promise.all([dehydratedRenderMethodTask, hydrationResourceTask]);
    return { dehydrated: dehydratedRenderMethod, hydration: hydrationResource };
  };

  /** 注册路由的方法 **/
  public getRouter() {
    return Router().get("/search", responseHtmlWrapper(async (request: Request) => {
      return await this.execute(request);
    }));
  };

  /** 路由的业务逻辑 **/
  public async execute(request: Request): Promise<any> {
    console.log("request.query", request.query);
    console.log("request.body", request.body);
    const content = { list: Array(10).fill(1) };
    const { dehydrated, hydration }: any = await this.getRenderResource();
    const dehydratedViewContent = await renderDehydratedResourceWithSandbox(dehydrated.javascript[0], content);
    return renderHTMLContent({
      hydrationAssets: hydration,
      dehydrationViewContent: dehydratedViewContent,
      meta: {
        title: "搜索结果页",
        keywords: [],
        description: "",
      },
      content: content
    });
  };

};

IOCContainer.bind(SearchController).toSelf().inRequestScope();