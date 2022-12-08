class Observe{
  constructor(data) {
    // Object.defineProperty只能劫持已经存在的属性（vue2里面会为此单独写一些api $set $delete）

    if (Array.isArray(data)){
      // 可以重写数组中的方法 7个变异方法 是可以修改数组本身的
      // 需要保留数组原有的特性，并且可以重写部分方法
      // data.__proto__ =

      this.observeArray(data) //如果数组中放的是对象 可以监控到对象的变化
    }else{
      this.walk(data)
    }
  }
  walk(data){ // 循环对象 对属性依次劫持

    // "重新定义"属性     Vue2的性能瓶颈在这也有原因
    Object.keys(data).forEach(key=>defineReactive(data,key,data[key]))
  }
  observeArray(data){ // 观测数组
    data.forEach(item=>observe(item))
  }
}

export function defineReactive(target,key,value){ // 闭包 属性劫持
  observe(value); // 深度属性劫持——》对所有的对象都进行属性劫持    如果value仍是对象，用observe递归操作
  Object.defineProperty(target,key,{
    get() { // 取值的时候 会执行get
      console.log('key',key)
      return value
    },
    set(newValue) { // 修改的时候 会执行set
      if (newValue === value) return
      value = newValue
    }
  })
}

export function observe(data){

  // 对这个对象进行劫持

  if(typeof data !== 'object' || data == null){
    return; // 只对对象进行劫持
  }

  // 如果一个对象被劫持过了，那就不需要再被劫持了 （要判断一个对象是否被劫持过，可以增添一个实例，用实例来判断是否被劫持）

  return new Observe(data);
}