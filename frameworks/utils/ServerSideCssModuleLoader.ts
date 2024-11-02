
/**
 * 针对css-module的服务器渲染,在css-loader之后直接返回css-module的结果
 * 不会经过 MiniCssExtractPlugin 不然服务端渲染会报错
 * **/
export function ServerSideCssModuleLoader(content) {
  return content;
};