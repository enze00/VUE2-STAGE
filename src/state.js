import {observe} from "./observe/index";

export function initState(vm){
  const  opts = vm.$options; // 劫持所有的选项
  if (opts.data){
    initData(vm);
  }
}

function proxy(vm,target,key){
  Object.defineProperty(vm,key,{ // vm.name
    get(){
      console.log("触发get-proxy")
      return vm[target][key]; // vm._data.name
    },
    set(newValue){
      console.log("触发set-proxy")
      vm[target][key] = newValue
    }
  })
}


function initData(vm){
  let data = vm.$options.data; //data 可能是函数也可能是对象
  data = typeof data === "function"? data.call(vm) : data; // data 是用户返回的对象

  vm._data = data // 将返回的对象放到了_data
  // 对数据进行劫持 vue2 里采用了一个api defineProperty
  observe(data)

  // 将vm._data 用vm来代理即可
  for (let key in data){
    proxy(vm,'_data',key);
  }
}