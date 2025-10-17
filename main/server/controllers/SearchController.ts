import path from "path";
import { Router, Request } from "express";
import { injectable, inject } from "inversify";

import { responseHtmlWrapper } from "@/frameworks/librarys/responseHtmlWrapper";

import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";
import { RenderHTMLContentService } from "@/main/server/services/RenderHTMLContentService";
import { compileDehydratedRenderMethod, compileHydrationResource } from "@/library";

@injectable()
export class SearchController {

  constructor(
    @inject(RenderHTMLContentService) private readonly $RenderHTMLContentService: RenderHTMLContentService
  ) { };

  private async getRenderResource() {
    const dehydratedRenderMethod = compileDehydratedRenderMethod({
      source: path.resolve(process.cwd(), "./main/views/pages/SearchPage/index.tsx")
    });
    const hydrationResource = compileHydrationResource({
      source: path.resolve(process.cwd(), "./main/views/pages/SearchPage/index.tsx")
    });
    await Promise.all([dehydratedRenderMethod, hydrationResource]);
    return { dehydrated: dehydratedRenderMethod, hydration: hydrationResource };
  };

  public async getRouter() {
    await this.getRenderResource();
    return Router().get("/search", responseHtmlWrapper(async (request: Request) => {
      return await this.execute(request);
    }));
  };

  public async execute(request: Request): Promise<any> {
    // console.log("request.query", request.query);
    // console.log("request.body", request.body);
    // const renderContent = await this.$RenderHTMLContentService.getContentString({
    //   title: "搜索结果页",
    //   assets: {
    //     stylesheet: "/pages/SearchPage/index.css",
    //     javascript: "/pages/SearchPage/index.js"
    //   },
    //   component: SearchPage,
    //   content: { list: Array(10).fill(1) }
    // });
    // return renderContent;
  };

};

IOCContainer.bind(SearchController).toSelf().inRequestScope();