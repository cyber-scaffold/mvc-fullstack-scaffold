import path from "path";
import React from "react";
import pretty from "pretty";
import { get } from "dot-prop";
import { renderToString } from "react-dom/server";
import { getRuntimeConfiguration, getDehydratedResource, getHydrationResource, renderDehydratedResourceWithSandbox } from "@/library/runtime";

import { version } from "@/package.json";

interface IParmas {
  resource: string,
  title: string,
  keywords?: string[],
  description?: string,
  content?: any
  platform?: "mobile" | "desktop" | "other" | string,
  version?: string
};

export async function renderHTMLContent(params: IParmas) {
  const resource = params.resource;
  const { assetsDirectoryPath, hydrationResourceDirectoryPath } = await getRuntimeConfiguration();

  const hydrationResourceTask = getHydrationResource({ alias: resource });
  const dehydratedRenderMethodTask = getDehydratedResource({ alias: resource });
  const [dehydratedAssets, hydrationAssets] = await Promise.all([dehydratedRenderMethodTask, hydrationResourceTask]);

  const content = params.content;
  const metaInfo = {
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
  const applicationInjectContent = { content, meta: metaInfo };
  /** 如果存在脱水渲染脚本的话就需要进行脱水视图的渲染 **/
  let dehydratedContent = null;
  if (dehydratedAssets) {
    dehydratedContent = dehydratedAssets.javascript && (dehydratedAssets.javascript[0] ? (
      <div id="root" style={{ height: "100%" }} dangerouslySetInnerHTML={{
        __html: `${await renderDehydratedResourceWithSandbox(dehydratedAssets.javascript[0], applicationInjectContent)}`
      }} />
    ) : (
      <div id="root" style={{ height: "100%" }} />
    ));
  } else {
    dehydratedContent = (<div id="root" style={{ height: "100%" }} />);
  };

  let hydrationStyleSheetTags = null;
  if (hydrationAssets) {
    hydrationStyleSheetTags = get(hydrationAssets, "stylesheet", []).map((stylesheetResourceRelativePath: string) => (
      <link key={stylesheetResourceRelativePath} rel="stylesheet" href={path.join(hydrationResourceDirectoryPath, stylesheetResourceRelativePath).replace(assetsDirectoryPath, "")} />
    ));
  };

  let hydrationScriptTags = null;
  if (hydrationAssets) {
    hydrationScriptTags = get(hydrationAssets, "javascript", []).map((javascriptResourceRelativePath: string) => (
      <script key={javascriptResourceRelativePath} src={path.join(hydrationResourceDirectoryPath, javascriptResourceRelativePath).replace(assetsDirectoryPath, "")} />
    ));
  };

  const contentString = renderToString(
    <html lang="zh-CN">
      <head>
        <meta charSet="UTF-8" />
        <title>{metaInfo.title}</title>
        <meta name="keywords" content={metaInfo.keywords} />
        <meta name="description" content={metaInfo.description} />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" />
        <link href="/statics/favicon.ico" rel="icon" type="image/x-icon" />
        {hydrationStyleSheetTags}
      </head>
      <body style={{ height: "100%" }}>
        {dehydratedContent}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window._ROOT_ELEMENT_=document.getElementById("root");
              window._CONTENT_FROM_SERVER_=${JSON.stringify(applicationInjectContent)};
              window._INJECT_RUNTIME_FROM_SERVER_={env:{NODE_ENV:${JSON.stringify(process.env.NODE_ENV)}}};
            `
          }}
        />
        {/* <script src="/dll/hydration.dll.js"></script> */}
        {hydrationScriptTags}
      </body>
    </html>
  );
  return pretty(contentString);
};