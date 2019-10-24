/*
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description: 公共组件
 * @Date: 2019-02-18 17:21:10
 * @LastEditTime: 2019-03-01 09:44:25
 */

let directives = {};

let startTime = new Date();
//自动化扫描store
const directiveContext = require.context("./", true, /index\.js$/);

directiveContext.keys().forEach(directivePath => {
  if (directivePath.startsWith("./index")) return;
  const directive = directiveContext(directivePath);
  const directiveName = directivePath
    .replace("./", "")
    .replace("/index.js", "")
    .trim();
  directives[directiveName] = directive.default;
});

console.log("扫描directives耗时", new Date() - startTime);
console.log("directives", directives);

export default Vue => {
  Object.keys(directives).forEach(directiveName => {
    Vue.directive(directiveName, directives[directiveName]);
  });
};
