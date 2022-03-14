class EventEmitter {
  constructor() {
    this.events = {};
  }

  /**
   * 注册事件
   * @param name String 事件名称
   * @param callback Function 事件处理程序
   * @param data
   */
  on(name, callback, data) {
    registerEvent.call(this, false, name, callback, data);
  }

  once(name, callback, data) {
    registerEvent.call(this, true, callback, data);
  }



  /**
   * 注销事件
   * @param name 事件名称
   * @param callback 事件处理程序
   */
  off(name, callback) {
    if(!this.events[name]) {
      console.warn(`off: ${name} event not exist`);
      return;
    }

    if (typeof callback === "function") {
      this.events[name] = this.events[name].filter((event) => event.callback !== callback);
    }

    if (!callback || this.events[name].length === 0) {
      delete this.events[name];
    }

  }

  /**
   * 触发事件
   * @param {String} name 事件名称
   * @param {*} params 事件参数
   */
  trigger(name, ...params) {
    if(!this.events[name]) {
      console.warn(`trigger: ${name} event not exist`);
      return;
    }
    this.events[name].forEach(event => {
      event.callback.call(this, ...params, event.data);
      // 如果once为true, 代表只执行一次事件.
      if (event.once) {
        this.off(name, event.callback);
      }
    })

  }

  /**
   * 舍弃方案1的原因是, 这样做或形成闭包, 存储的是一个闭包函数, 如果注册数量很多的话, 内存方面会有影响.
   * 方案1:
   * 只执行一次事件就自动注销
   * @param name
   * @param callback
   * @param data
   */
  // once(name, callback, data) {
  //   const onceCallback = (...args) => {
  //     callback.call(this, ...args);
  //     this.off(name, onceCallback);
  //   };
  //   this.on(name, onceCallback, data);
  // }



}

/**
 * (写在EventEmitter类外面, 是不想对使用者暴露这个函数.)
 * 注册事件处理函数
 * @param {Boolean} once 是否一次性执行
 * @param {String} name 事件名称
 * @param {Function} callback 事件回调函数
 * @param {*} [data] 注册事件时绑定的数据
 */
function registerEvent(once, name, callback, data) {
  if (typeof name !== "string") {
    throw new Error("Invalid name: not string");
  }
  if (typeof callback !== "function") {
    throw new Error("Invalid callback: not function")
  }
  if (!this.events[name]) {
    this.events.name = [];
  }
  this.events[name].push({callback, data, once});
}
