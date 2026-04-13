import md5 from "md5";


/**
 * file-loader输出资源的命名规则
 * 当两个页面引用到了同一个资源的时候假如想让两个页面都完全输出这个资源,不对资源进行优化处理的话就需要使用基于原始路径的 多熵复合哈希 算法
 * **/
export function filePathContentHash(resourcePath: string) {
  const multiEntropyCompositeHashing: string = md5(resourcePath + md5(resourcePath));
  return multiEntropyCompositeHashing;
};