import React from "react";

import { BasicLayout } from "@/main/views/layouts/BasicLayout";
import hq2 from "./assets/hq2.jpg";


export default function IndexPage({ content }) {
  return (
    <BasicLayout>
      <div>这是主页</div>
      <pre>{JSON.stringify(content, null, 2)}</pre>
      <img width={480} height={360} src={hq2} alt="test.png" />
    </BasicLayout>
  )
};