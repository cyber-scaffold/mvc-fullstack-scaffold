import type { MaterielCompilationInfoType } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";

export type PublicPathWithRuntimeType = "/hydration/" | "/dehydration/";

/**
 * 计算运行时的 __webpack_public_path__ 变量
 * 因为有些资源的类型不同,比如有些资源仅仅只做了 脱水编译 或者 仅仅只做了 注水编译
 * 这个时候就不能无脑的让publicPath指向 注水资源的文件夹
 * 所以这个publicPath是需要在物料编译阶段通过用户具体的配置文件计算出来的
 * @description
 * 具体的逻辑如下:
 * 如果仅仅只编译了注水资源的话,那么publicPath就应该指向 注水资源 输出的文件夹
 * 如果仅仅只编译了脱水资源的话,那么publicPath就应该指向 脱水资源 输出的文件夹
 * 如果两种资源都编译了的话,那么publicPath就应该优先使用 注水资源 输出的文件夹
 * **/
export function computedPublicPathWithRuntime(materielDetailInfo: MaterielCompilationInfoType): PublicPathWithRuntimeType {
  let publicPathWithRuntime: PublicPathWithRuntimeType;
  if (materielDetailInfo.hydrate) {
    publicPathWithRuntime = "/hydration/";
    return publicPathWithRuntime;
  };
  if (materielDetailInfo.dehydrate) {
    publicPathWithRuntime = "/dehydration/";
    return publicPathWithRuntime;
  };
  throw new Error(`hydrate or dehydrate is undefined`);
};