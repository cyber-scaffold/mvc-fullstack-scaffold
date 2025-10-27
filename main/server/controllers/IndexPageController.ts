import path from "path";
import { Router, Request } from "express";
import { injectable, inject } from "inversify";

import { responseHtmlWrapper } from "@/frameworks/librarys/responseHtmlWrapper";

import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";
import { renderHTMLContent } from "@/main/server/utils/renderHTMLContent";
import { compileDehydratedRenderMethod, compileHydrationResource, renderDehydratedResourceWithSandbox } from "@/library";

@injectable()
export class IndexPageController {

  public async getRenderResource() {
    const dehydratedRenderMethodTask = compileDehydratedRenderMethod({
      source: path.resolve(process.cwd(), "./main/views/pages/IndexPage/index.tsx")
    });
    const hydrationResourceTask = compileHydrationResource({
      source: path.resolve(process.cwd(), "./main/views/pages/IndexPage/index.tsx")
    });
    const [dehydratedRenderMethod, hydrationResource] = await Promise.all([dehydratedRenderMethodTask, hydrationResourceTask]);
    return { dehydrated: dehydratedRenderMethod, hydration: hydrationResource };
  };

  public getRouter() {
    return Router().get("/", responseHtmlWrapper(async (request: Request) => {
      return await this.execute(request);
    }));
  };

  public async execute(request: Request): Promise<any> {
    const content = { list: Array(10).fill(1).map((fill, index) => fill + index) };
    const { dehydrated, hydration }: any = await this.getRenderResource();
    const dehydratedViewContent = await renderDehydratedResourceWithSandbox(dehydrated.javascript[0], content);
    return renderHTMLContent({
      hydrationAssets: hydration,
      dehydrationViewContent: dehydratedViewContent,
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