/** 基于JavaScript序言指令将该文件输出为指定的客户端渲染文件 **/
"client-assets-filename=detail";

import React from "react";
import { renderToDocument } from "@/www/utils/renderToDocument";

export function DetailPage(props) {
  return (
    <div>
      <div>这是详情页</div>
      <div>asdadas</div>
      <form action="/search" method="get" encType="application/x-www-form-urlencoded">
        <input type="text" name="keyword" defaultValue="test word" />
        <input type="submit" defaultValue="submit" />
      </form>
    </div>
  )
};

DetailPage.propTypes = {

};

// renderToDocument(DetailPage);