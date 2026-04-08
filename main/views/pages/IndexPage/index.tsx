import React from "react";

import { BasicLayout } from "@/main/views/layouts/BasicLayout";
import hq2 from "./assets/hq2.jpg";

console.log("导入模块之前的NODE_ENV", process.env.NODE_ENV);

export default function IndexPage({ content, meta }) {
  console.log("运行时的NODE_ENV", process.env.NODE_ENV);
  console.log({ content, meta });
  return (
    <BasicLayout>
      <div>这是主页</div>
      <pre>{JSON.stringify(content, null, 2)}</pre>
      <img width={480} height={360} src={hq2} alt="test.png" />
    </BasicLayout>
  )
};