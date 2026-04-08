import { Router, Request } from "express";
import { injectable, inject } from "inversify";
import { getDehydratedResource, getHydrationResource } from "@/library/runtime";

import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";
import { responseHtmlWrapper } from "@/main/server/utils/responseHtmlWrapper";
import { renderHTMLContent } from "@/main/server/utils/renderHTMLContent";


@injectable()
export class IndexPageController {

  /** 获取脱水和注水资源的方法可以用于预处理和运行时渲染 **/
  public async getRenderResource() {
    const dehydratedRenderMethodTask = getDehydratedResource({ alias: "IndexPage" });
    const hydrationResourceTask = getHydrationResource({ alias: "IndexPage" });
    const [dehydratedRenderMethod, hydrationResource] = await Promise.all([dehydratedRenderMethodTask, hydrationResourceTask]);
    return { dehydrated: dehydratedRenderMethod, hydration: hydrationResource };
  };

  /** 注册路由的方法 **/
  public getRouter() {
    return Router().get("/", responseHtmlWrapper(async (request: Request) => {
      return await this.execute(request);
    }));
  };

  /** 路由的业务逻辑 **/
  public async execute(request: Request): Promise<any> {
    const content = { list: Array(10).fill(1).map((fill, index) => fill + index) };
    const { dehydrated, hydration }: any = await this.getRenderResource();
    return await renderHTMLContent({
      hydrationAssets: hydration,
      dehydratedAssets: dehydrated,
      meta: {
        title: "主页",
        keywords: [],
        description: "",
      },
      content: content
    });
  };

};

IOCContainer.bind(IndexPageController).toSelf().inRequestScope();