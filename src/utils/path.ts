/**
 * 多入口打包时，使用此地址可以访问源码根目录和打包后的app.asar文件的dist目录
 * 如果需要动态打包，就使用 esbuild watch自动打包。
 */
export const asarPath =  `${__dirname}${__dirname.endsWith("dist") ? '' : '/..'}`;


/**
 * 主程序目录地址，开发时是项目根目录
 */
export const appPath = `${__dirname}${__dirname.endsWith("electron-preload") ? '/../..' : '/../../..'}`;

/**
 * 附带的一些可执行文件目录地址
 */
export const binPath = `${appPath}/bin`;


/**
 * Electron 静态资源目录
 */
export const staticPath = `${appPath}/resources/static`;