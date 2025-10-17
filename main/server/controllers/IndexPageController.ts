import path from "path";
import { Router, Request } from "express";
import { injectable, inject } from "inversify";

import { responseHtmlWrapper } from "@/frameworks/librarys/responseHtmlWrapper";

import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";
import { RenderHTMLContentService } from "@/main/server/services/RenderHTMLContentService";
import { compileDehydratedRenderMethod, compileHydrationResource } from "@/library";


@injectable()
export class IndexPageController {

  constructor(
    @inject(RenderHTMLContentService) private readonly $RenderHTMLContentService: RenderHTMLContentService
  ) { };

  public async getRenderResource() {
    const dehydratedRenderMethod = compileDehydratedRenderMethod({
      source: path.resolve(process.cwd(), "./main/views/pages/IndexPage/index.tsx")
    });
    const hydrationResource = compileHydrationResource({
      source: path.resolve(process.cwd(), "./main/views/pages/IndexPage/index.tsx")
    });
    await Promise.all([dehydratedRenderMethod, hydrationResource]);
    return { dehydrated: dehydratedRenderMethod, hydration: hydrationResource };
  };

  public getRouter() {
    return Router().get("/", responseHtmlWrapper(async (request: Request) => {
      return await this.execute(request);
    }));
  };

  public async execute(request: Request): Promise<any> {
    // const renderContent = await this.$RenderHTMLContentService.getContentString({
    //   title: "主页",
    //   assets: {
    //     stylesheet: "/pages/IndexPage/index.css",
    //     javascript: "/pages/IndexPage/index.js"
    //   },
    //   component: IndexPage,
    //   content: { list: Array(10).fill(1).map((fill, index) => fill + index) }
    // });
    // return renderContent;
  };

};

IOCContainer.bind(IndexPageController).toSelf().inRequestScope();