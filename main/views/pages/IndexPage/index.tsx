import React, { useCallback } from "react";

import { BasicLayout } from "@/main/views/layouts/BasicLayout";
import hq2 from "./assets/hq2.jpg";

// console.log("导入模块之前的NODE_ENV", process.env.NODE_ENV);
// console.log("window", window);

export default function IndexPage({ content, meta }) {
  // console.log("运行时的NODE_ENV", process.env.NODE_ENV);
  // console.log({ content, meta });

  const handleClick = useCallback(() => {
    const txet = "asdadas";
    console.log(txet);
  }, []);

  return (
    <BasicLayout>
      <div style={{ textAlign: "center", color: "#FFFFFF" }}>
        <div>这是主页</div>
        <div>渲染注水数据</div>
        <div style={{ textAlign: "center" }}>
          <div>{JSON.stringify(content, null, 2)}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <img width={480} height={360} src={hq2} alt="test.png" onClick={handleClick} />
        </div>
      </div>
    </BasicLayout>
  )
};