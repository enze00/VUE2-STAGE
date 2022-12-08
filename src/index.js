import {initMixin} from "./init";

function Vue(options){ // options 就是用户的选项
  this._init(options)
}

initMixin(Vue); // 拓展了init()

export default Vue