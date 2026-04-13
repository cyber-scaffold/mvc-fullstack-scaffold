import path from "path";
import React from "react";
import pretty from "pretty";
import { get } from "dot-prop";
import { injectable } from "inversify";
import { renderToString } from "react-dom/server";

import { getRuntimeConfiguration, getDehydratedResource, getHydrationResource, renderDehydratedResourceWithSandbox } from "@/frameworks/mpa-ssr-tool-box/runtime";
import { IOCContainer } from "@/main/server/cores/IOCContainer";
import { version } from "@/package.json";

import type { ReactNode } from "react";

export type PlatformType = "mobile" | "desktop" | "other" | string;

export type ServerSiderRenderParamsType = {
  alias: string,
  title: string,
  keywords?: string[],
  description?: string,
  content?: any
  platform?: PlatformType
  version?: string
};

export type MetaInfoType = {
  title: string
  keywords: string
  description: string
  platform: PlatformType
  version: string
};

export type ApplicationInjectContentType = {
  meta: MetaInfoType
  content: any
};

@injectable()
export class ServerSiderRenderService {

  /** 服务端脱水视图 **/
  private dehydrateContent: ReactNode = null;

  /** 前端注水渲染脚本 **/
  private hydrateScriptTags: ReactNode = null;

  /** 前端注水渲染样式 **/
  private hydrateStyleSheetTags: ReactNode = null;

  /** 渲染时提供的信息 **/
  private applicationInjectContent: ApplicationInjectContentType;

  /** 生成脱水视图 **/
  private async generateDehydrateContent({ alias }): Promise<void | false> {
    const dehydrateAssets = await getDehydratedResource({ alias });
    /** 没有脱水渲染物料时的操作 **/
    if (!dehydrateAssets) {
      this.dehydrateContent = (<div id="root" style={{ height: "100%" }} />);
      return false;
    };
    if (!dehydrateAssets.javascript) {
      this.dehydrateContent = (<div id="root" style={{ height: "100%" }} />);
      return false;
    };
    if (!dehydrateAssets.javascript[0]) {
      this.dehydrateContent = (<div id="root" style={{ height: "100%" }} />);
      return false;
    };
    /** 如果存在脱水渲染脚本的话就需要进行脱水视图的渲染 **/
    const dehydrateHTMLContent = await renderDehydratedResourceWithSandbox(dehydrateAssets.javascript[0], this.applicationInjectContent);
    this.dehydrateContent = (<div id="root" style={{ height: "100%" }} dangerouslySetInnerHTML={{ __html: dehydrateHTMLContent }} />);
  };

  /** 生成前端的注水标签 **/
  private async generateHydrationTags({ alias }): Promise<void | false> {
    const { assetsDirectoryPath, fileResourceDirectoryPath, hydrationResourceDirectoryPath } = await getRuntimeConfiguration();
    const hydrateAssets = await getHydrationResource({ alias });
    if (!hydrateAssets) {
      return false;
    };
    this.hydrateStyleSheetTags = get(hydrateAssets, "stylesheet", []).map((stylesheetResourceRelativePath: string) => (
      <link key={stylesheetResourceRelativePath} rel="stylesheet" href={path.join(fileResourceDirectoryPath, stylesheetResourceRelativePath).replace(assetsDirectoryPath, "")} />
    ));
    this.hydrateScriptTags = get(hydrateAssets, "javascript", []).map((javascriptResourceRelativePath: string) => (
      <script key={javascriptResourceRelativePath} src={path.join(hydrationResourceDirectoryPath, javascriptResourceRelativePath).replace(assetsDirectoryPath, "")} />
    ));
  };

  /** 整理数据 **/
  private async generateApplicationInjectContent(params: ServerSiderRenderParamsType): Promise<void> {
    const content = params.content;
    const metaInfo: MetaInfoType = {
      /** title信息必须存在 **/
      title: params.title,
      /** description信息如果不存在的话默认使用标题作为description **/
      description: params.description || params.title,
      /** keyword信息需要进行合成操作 **/
      keywords: [get(params, "keywords", [])].join(","),
      /** 设备信息 **/
      platform: params.platform || "desktop",
      /** 项目版本信息 **/
      version: params.version || version
    };
    this.applicationInjectContent = { content, meta: metaInfo };
  };

  public async computedHTMLContent(params: ServerSiderRenderParamsType): Promise<string> {
    const alias = params.alias;
    await this.generateApplicationInjectContent(params);
    await this.generateDehydrateContent({ alias });
    await this.generateHydrationTags({ alias });
    const contentString = renderToString(
      <html lang="zh-CN">
        <head>
          <meta charSet="UTF-8" />
          <title>{this.applicationInjectContent.meta.title}</title>
          <meta name="keywords" content={this.applicationInjectContent.meta.keywords} />
          <meta name="description" content={this.applicationInjectContent.meta.description} />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" />
          <link href="favicon.ico" rel="icon" type="image/x-icon" />
          {this.hydrateStyleSheetTags}
        </head>
        <body style={{ height: "100%" }}>
          {this.dehydrateContent}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window._ROOT_ELEMENT_=document.getElementById("root");
                window._CONTENT_FROM_SERVER_=${JSON.stringify(this.applicationInjectContent)};
                window._INJECT_RUNTIME_FROM_SERVER_={env:{NODE_ENV:${JSON.stringify(process.env.NODE_ENV)}}};
              `
            }}
          />
          {/* <script src="/dll/hydration.dll.js"></script> */}
          {this.hydrateScriptTags}
        </body>
      </html>
    );
    return pretty(contentString);
  };

};

IOCContainer.bind(ServerSiderRenderService).toSelf().inRequestScope();