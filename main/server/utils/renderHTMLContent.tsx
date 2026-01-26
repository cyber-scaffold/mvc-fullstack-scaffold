import path from "path";
import React from "react";
import pretty from "pretty";
import { get } from "dot-prop";
import { renderToString } from "react-dom/server";

import type { ICompileAssetsList } from "@/library";
import { getRuntimeConfiguration } from "@/library";

interface IParmas {
  dehydrationViewContent: string
  hydrationAssets?: ICompileAssetsList
  meta: {
    title: string,
    keywords?: string[],
    description?: string,
  },
  content?: any
};

export async function renderHTMLContent(params: IParmas) {
  const { assetsDirectoryPath, hydrationResourceDirectoryPath } = await getRuntimeConfiguration();
  const dehydrationViewContent = params.dehydrationViewContent;
  const hydrationAssets = params.hydrationAssets;
  const hydrationContent = params.content;
  const metaInfoFromParam = params.meta;
  const metaInfo = {
    /** title信息必须存在 **/
    title: metaInfoFromParam.title,
    /** description信息如果不存在的话默认使用标题作为description **/
    description: metaInfoFromParam.description || metaInfoFromParam.title,
    /** keyword信息需要进行合成操作 **/
    keywords: [get(metaInfoFromParam, "keywords", [])].join(",")
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
        {get(hydrationAssets, "stylesheet", []).map((stylesheetResourceRelativePath: string) => (
          <link key={stylesheetResourceRelativePath} rel="stylesheet" href={path.join(hydrationResourceDirectoryPath, stylesheetResourceRelativePath).replace(assetsDirectoryPath, "")} />
        ))}
        <script dangerouslySetInnerHTML={{ __html: `window.process=${JSON.stringify({ env: { NODE_ENV: process.env.NODE_ENV } })};` }}></script>
        <script dangerouslySetInnerHTML={{ __html: `window.content=${JSON.stringify(hydrationContent, null, "")};` }}></script>
        <script dangerouslySetInnerHTML={{ __html: `window.meta=${JSON.stringify(metaInfo, null, "")};` }}></script>
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: dehydrationViewContent }} />
        {get(hydrationAssets, "javascript", []).map((javascriptResourceRelativePath: string) => (
          <script key={javascriptResourceRelativePath} src={path.join(hydrationResourceDirectoryPath, javascriptResourceRelativePath).replace(assetsDirectoryPath, "")}></script>
        ))}
        <script dangerouslySetInnerHTML={{ __html: `window.renderHydration(document.getElementById("root"),{meta:window.meta,process:window.process,content:window.content})` }}></script>
      </body>
    </html>
  );
  return pretty(contentString);
};