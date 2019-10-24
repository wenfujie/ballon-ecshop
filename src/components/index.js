/*
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description: 公共组件
 * @Date: 2019-02-18 17:21:10
 * @LastEditTime: 2019-04-04 17:17:25
 */

//文件扫描函数
function scanner() {
    let files = {};
    const context = require.context(__dirname, true, /index\.js$/);
    context.keys().forEach(filePath => {
        if (filePath.startsWith('./index')) return;
        const file = context(filePath);
        const fileName = filePath
            .replace('./', '')
            .replace('/index.js', '')
            .trim();
        files[fileName] = file.default;
    });
    return files;
}

//扫描计时开始
let startTime = new Date();

let components = scanner();

console.log('扫描components耗时', new Date() - startTime);

export default {
    install(Vue) {
        Object.keys(components).forEach(componentName => {
            Vue.component(componentName, components[componentName]);
        });
    }
};
