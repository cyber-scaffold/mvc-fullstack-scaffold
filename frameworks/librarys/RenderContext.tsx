import propTypes from "prop-types";
import React, { useContext } from "react";

export const RenderContext = React.createContext({});

export function RenderContextProvider(props) {
  const { seo, content, children } = props;
  return (
    <RenderContext.Provider value={{ seo, content }}>
      {children}
    </RenderContext.Provider>
  )
};

export function useRenderContext(): { seo: any, content: any } {
  const renderContext: any = useContext(RenderContext);
  return renderContext;
};

RenderContextProvider.propTypes = {
  seo: propTypes.any,
  content: propTypes.any,
  children: propTypes.node
};