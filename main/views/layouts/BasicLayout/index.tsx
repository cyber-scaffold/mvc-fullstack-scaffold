/* eslint-disable react/prop-types */
import React from "react";
// import propTypes from "prop-types";
// import classnames from "classnames";

import css from "./style.module.less";

export function BasicLayout(props) {
  const { children } = props;
  return (
    <div className={css.container}>
      <ul>
        <li>
          <a href="/">home</a>
        </li>
        <li>
          <a href="/detail">detail</a>
        </li>
      </ul>
      {children}
    </div>
  )
};


BasicLayout.propTypes = {

};