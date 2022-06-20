/**
 * 多入口打包时，使用此地址可以访问源码根目录和打包后的app.asar文件的dist目录
 * 如果需要动态打包，就使用 esbuild watch自动打包。
 */
export const inputPath =  `${__dirname}${__dirname.endsWith("dist") ? '' : '/..'}`;