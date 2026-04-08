import path from "path";
import React from "react";
import pretty from "pretty";
import { get } from "dot-prop";
import { renderToString } from "react-dom/server";

import { getRuntimeConfiguration, getDehydratedResource, getHydrationResource, renderDehydratedResourceWithSandbox } from "@/library/runtime";


interface IParmas {
  resourceAlias: string,
  meta: {
    title: string,
    keywords?: string[],
    description?: string,
  },
  content?: any
};

export async function renderHTMLContent(params: IParmas) {
  const resourceAlias = params.resourceAlias;
  const { assetsDirectoryPath, hydrationResourceDirectoryPath } = await getRuntimeConfiguration();

  const hydrationResourceTask = getHydrationResource({ alias: resourceAlias });
  const dehydratedRenderMethodTask = getDehydratedResource({ alias: resourceAlias });
  const [dehydratedAssets, hydrationAssets] = await Promise.all([dehydratedRenderMethodTask, hydrationResourceTask]);

  const content = params.content;
  const metaInfoFromParam = params.meta;
  const metaInfo = {
    /** title信息必须存在 **/
    title: metaInfoFromParam.title,
    /** description信息如果不存在的话默认使用标题作为description **/
    description: metaInfoFromParam.description || metaInfoFromParam.title,
    /** keyword信息需要进行合成操作 **/
    keywords: [get(metaInfoFromParam, "keywords", [])].join(",")
  };
  const applicationInjectContent = { content, meta: metaInfo };
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
      </head>
      <body>
        <div id="root"
          dangerouslySetInnerHTML={{
            __html: `${await renderDehydratedResourceWithSandbox(dehydratedAssets.javascript[0], applicationInjectContent)}`
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window._ROOT_ELEMENT_=document.getElementById("root");
              window._CONTENT_FROM_SERVER_=${JSON.stringify(applicationInjectContent)};
              window._INJECT_RUNTIME_FROM_SERVER_={env:{NODE_ENV:${JSON.stringify(process.env.NODE_ENV)}}};
            `
          }}
        />
        {get(hydrationAssets, "javascript", []).map((javascriptResourceRelativePath: string) => (
          <script key={javascriptResourceRelativePath} src={path.join(hydrationResourceDirectoryPath, javascriptResourceRelativePath).replace(assetsDirectoryPath, "")} />
        ))}
      </body>
    </html>
  );
  return pretty(contentString);
};