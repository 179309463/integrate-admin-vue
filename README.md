# integrate-admin-vue
基于 Vue 和 Element 开发的后台系统 (多iframe式)<br>
* 工程化采用 gulp + webpack 搭建
* 模块合并用 webpack 完成，充分利用了 webpack 万物皆模块的优秀特性
* 代码压缩用 gulp-uglify 完成，很好的避开了 webpack 压缩代码效率低下的问题
* common 是公共目录代码，app 是应用代码目录
* src/app 里，以 "[name].main.js" 结尾的脚本是入口脚本，作为 webpack 的入口文件，最终编译成 "[name].bundle.js"
* dev 是开发目录，里面的代码是经过编译合并，但未压缩的代码
* dist 是发布目录，里面的代码是经过编译合并，已压缩的代码
