import React from "react";
import { createRoot } from "react-dom/client";

declare global {
  interface Window {
    meta: {
      title: string;
      description: string;
      keywords: string;
    };
    process: any
    content: any
  }
};

export function renderToDocument(RenderElement: React.Element) {
  /** 一定要记得屏蔽服务端渲染,不然会报document对象不存在的错误 **/
  if (process.isServer) {
    return false;
  };
  createRoot(document.getElementById("root")).render(
    <RenderElement meta={window.meta} process={window.process} content={window.content} />
  );
};