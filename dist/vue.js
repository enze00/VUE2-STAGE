(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  class Observe {
    constructor(data) {
      // Object.defineProperty只能劫持已经存在的属性（vue2里面会为此单独写一些api $set $delete）

      if (Array.isArray(data)) {
        // 可以重写数组中的方法 7个变异方法 是可以修改数组本身的
        // 需要保留数组原有的特性，并且可以重写部分方法
        data.__proto__ = this.observeArray(data);
      } else {
        this.walk(data);
      }
    }
    walk(data) {
      // 循环对象 对属性依次劫持

      // "重新定义"属性     Vue2的性能瓶颈在这也有原因
      Object.keys(data).forEach(key => defineReactive(data, key, data[key]));
    }
    observeArray(data) {
      // 观测数组
      data.forEach(item => observe(item));
    }
  }
  function defineReactive(target, key, value) {
    // 闭包 属性劫持
    observe(value); // 深度属性劫持——》对所有的对象都进行属性劫持    如果value仍是对象，用observe递归操作
    Object.defineProperty(target, key, {
      get() {
        // 取值的时候 会执行get
        console.log('key', key);
        return value;
      },
      set(newValue) {
        // 修改的时候 会执行set
        if (newValue === value) return;
        value = newValue;
      }
    });
  }
  function observe(data) {
    // 对这个对象进行劫持

    if (typeof data !== 'object' || data == null) {
      return; // 只对对象进行劫持
    }

    // 如果一个对象被劫持过了，那就不需要再被劫持了 （要判断一个对象是否被劫持过，可以增添一个实例，用实例来判断是否被劫持）

    return new Observe(data);
  }

  function initState(vm) {
    const opts = vm.$options; // 劫持所有的选项
    if (opts.data) {
      initData(vm);
    }
  }
  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      // vm.name
      get() {
        console.log("触发get-proxy");
        return vm[target][key]; // vm._data.name
      },

      set(newValue) {
        console.log("触发set-proxy");
        vm[target][key] = newValue;
      }
    });
  }
  function initData(vm) {
    let data = vm.$options.data; //data 可能是函数也可能是对象
    data = typeof data === "function" ? data.call(vm) : data; // data 是用户返回的对象

    vm._data = data; // 将返回的对象放到了_data
    // 对数据进行劫持 vue2 里采用了一个api defineProperty
    observe(data);

    // 将vm._data 用vm来代理即可
    for (let key in data) {
      proxy(vm, '_data', key);
    }
  }

  function initMixin(Vue) {
    // 就是给Vue增加init方法的
    Vue.prototype._init = function (options) {
      //用于初始化操作
      // vue vm.$options 获取用户的配置

      //加 $ 表示这是Vue里的一些变量
      const vm = this;
      vm.$options = options; // 将用户的选项挂载到实例上

      // 初始化状态
      initState(vm);
      // todo...编译模板 创建虚拟DOM
    };
  }

  function Vue(options) {
    // options 就是用户的选项
    this._init(options);
  }
  initMixin(Vue); // 拓展了init()

  return Vue;

}));
//# sourceMappingURL=vue.js.map
