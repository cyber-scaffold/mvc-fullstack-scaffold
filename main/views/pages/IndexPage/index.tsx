/** 基于JavaScript序言指令将该文件输出为指定的客户端渲染文件 **/
// "client-assets-filename=home";

import React from "react";
import { getWindow } from "ssr-window";

// import { renderToDocument } from "@/frameworks/librarys/renderToDocument";
import { BasicLayout } from "./layouts/BasicLayout";

import hq2 from "./assets/hq2.jpg";

export function IndexPage(props) {
  return (
    <BasicLayout>
      <div>这是主页</div>
      <pre>{JSON.stringify(getWindow().content, null, 2)}</pre>
      <img width={480} height={360} src={hq2} alt="test.png" />
    </BasicLayout>
  )
};

// renderToDocument(IndexPage);