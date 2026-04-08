import { Router, Request } from "express";
import { injectable, inject } from "inversify";
import { getDehydratedResource, getHydrationResource } from "@/library/runtime";

import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";
import { responseHtmlWrapper } from "@/main/server/utils/responseHtmlWrapper";
import { renderHTMLContent } from "@/main/server/utils/renderHTMLContent";

@injectable()
export class SearchController {

  /** 获取脱水和注水资源的方法可以用于预处理和运行时渲染 **/
  public async getRenderResource() {
    const dehydratedRenderMethodTask = getDehydratedResource({ alias: "SearchPage" });
    const hydrationResourceTask = getHydrationResource({ alias: "SearchPage" });
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
    return await renderHTMLContent({
      hydrationAssets: hydration,
      dehydratedAssets: dehydrated,
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