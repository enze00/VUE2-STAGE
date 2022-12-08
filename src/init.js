import {initState} from "./state";

export function initMixin(Vue){ // 就是给Vue增加init方法的
  Vue.prototype._init = function (options){ //用于初始化操作
    // vue vm.$options 获取用户的配置

    //加 $ 表示这是Vue里的一些变量
    const vm = this;
    vm.$options = options; // 将用户的选项挂载到实例上

    // 初始化状态
    initState(vm);
    // todo...编译模板 创建虚拟DOM
  }

}

