import React from "react";

import { BasicLayout } from "@/main/views/layouts/BasicLayout";

export default function SearchPage({ content }) {
  return (
    <BasicLayout>
      <div style={{ textAlign: "center", color: "#FFFFFF" }}>
        <div>这是搜索的结果页</div>
        <div>
          {(content.list || []).map((fill, index) => {
            return <div key={fill + index}>index</div>
          })}
        </div>
        <a href="/" style={{ display: "inline-block", margin: "50px auto", fontSize: "48px" }}>回到主页</a>
      </div>
    </BasicLayout>
  )
};