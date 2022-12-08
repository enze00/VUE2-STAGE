//rollup 默认可以导出一个对象 作为打包的配置文件
import babel from "rollup-plugin-babel"
export default {
  input:'./src/index.js',  //入口
  output: {
    file:'./dist/vue.js',  //出口
    name:'Vue', //global.Vue
    format:'umd',  //常见打包模式:esm es6模块 commonjs(node中使用) iife自执行函数 umd
    sourcemap:true, //希望可以调试源代码
  },
  plugins:[
    babel({
      exclude: 'node_modules/**' //排除node_modules所有文件和文件夹，**就是所有文件和文件夹的意思
    })
  ]
}