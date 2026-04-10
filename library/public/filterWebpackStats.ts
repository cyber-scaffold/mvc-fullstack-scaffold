import type { StatsCompilation, StatsAsset } from "webpack";

export interface ICompileAssetsList {
  javascript: string[]
  stylesheet: string[],
  statics: string[]
};

export function filterWebpackStats(statsJson: StatsCompilation): ICompileAssetsList {
  const { assets } = statsJson;
  const composeAssetsList: ICompileAssetsList = {
    "javascript": [],
    "stylesheet": [],
    "statics": []
  };
  assets.forEach((everyAssetsFileName: StatsAsset) => {
    /** 过滤掉sourcemap文件 **/
    if (everyAssetsFileName.name.match(/\.(map)$/ig)) {
      return false;
    };
    /** 分析出javascript文件 **/
    if (everyAssetsFileName.name.match(/\.(js)$/ig)) {
      composeAssetsList["javascript"].push(everyAssetsFileName.name);
    };
    /** 分析出css文件 **/
    if (everyAssetsFileName.name.match(/\.(css)$/ig)) {
      composeAssetsList["stylesheet"].push(everyAssetsFileName.name);
    };
    /** 分析出css文件 **/
    if (everyAssetsFileName.name.match(/\.(ico|png|jpg|jpeg|gif|mp3|mp4|avi|svg|ttf|eot|otf|fon|ttc|woff|woff2)$/ig)) {
      composeAssetsList["statics"].push(everyAssetsFileName.name);
    };
    return false;
  });
  return composeAssetsList;
};