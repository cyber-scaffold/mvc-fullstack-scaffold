/* eslint-disable react/prop-types */
import React from "react";
// import propTypes from "prop-types";
// import classnames from "classnames";

// import css from "./style.scss";
// import css from "./style.less";

export function DetailPage(props) {
  return (
    <div>
      <div>这是详情页</div>
      <form action="/search" method="post" encType="application/x-www-form-urlencoded">
        <input type="text" name="keyword" defaultValue="test word" />
        <input type="submit" defaultValue="submit" />
      </form>
    </div>
  )
};


DetailPage.propTypes = {

};