/* eslint-disable react/prop-types */
import React from "react";
import { getWindow } from "ssr-window";
// import propTypes from "prop-types";
// import classnames from "classnames";

import test from "./assets/test.png";

export function IndexPage(props) {
  return (
    <div>
      <div>这是主页</div>
      <div>{JSON.stringify(getWindow().content)}</div>
      <img width={1920} height={1080} src={test} alt="test.png" />
    </div>
  )
};

IndexPage.propTypes = {

};