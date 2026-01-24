/* eslint-disable react/prop-types */
import propTypes from "prop-types";
import { useState, useEffect } from "react";

export function NoSSR(props) {
  const { children } = props;
  const [readyStatus, setReadyStatus] = useState(false);

  useEffect(() => {
    setReadyStatus(true);
  }, []);

  return readyStatus ? children : null;
};


NoSSR.propTypes = {
  children: propTypes.node
};