/* eslint-disable react/prop-types */
import React from "react";
import { getWindow } from "ssr-window";
// import propTypes from "prop-types";
// import classnames from "classnames";

import hq2 from "./assets/hq2.jpg";

export function IndexPage(props) {
  return (
    <div>
      <div>这是主页</div>
      <div>{JSON.stringify(getWindow().content)}</div>
      <img width={480} height={360} src={hq2} alt="test.png" />
    </div>
  )
};

IndexPage.propTypes = {

};