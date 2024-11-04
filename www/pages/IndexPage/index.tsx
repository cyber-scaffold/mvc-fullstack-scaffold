/** 基于JavaScript序言指令将该文件输出为指定的客户端渲染文件 **/
"client-assets-filename=home";

import React from "react";
import { getWindow } from "ssr-window";
import { renderToDocument } from "@/www/utils/renderToDocument";

import css from "./style.module.less";
import hq2 from "./assets/hq2.jpg";

export function IndexPage(props) {
  return (
    <div className={css.container}>
      <div>这是主页</div>
      <div>{JSON.stringify(getWindow().content)}</div>
      <img width={480} height={360} src={hq2} alt="test.png" />
    </div>
  )
};

IndexPage.propTypes = {

};

// renderToDocument(IndexPage);