# 防抖和节流

[TOC]



## 为什么会使用到防抖或节流？
某些事件会被频繁的触发，也就会频繁的执行事件函数，导致页面卡顿，浪费性能和内存。
比如 scroll，input输入，resize这些事件。

总结：在某些场景和需求下，需要监控变化， 一旦发生变化就执行某种操作。但由于变化过于频繁，导致操作频繁执行，造成内存和性能的低效，甚至页面的卡顿。

### 在项目中使用到的情况

#### Node环境下的I/O操作
在ydap-transpiler项目中 实现文件删除后，要更改manifest.json中存储的键值对。多个文件删除就要有多次写入的操作。所以针对写入操作 使用了延迟触发方式的防抖，达到减少写入操作的次数。

## 防抖和节流对比
![](./images/debounce&throttle.jpg)

## 防抖实现

### 应用场景
1.	**登录、发短信**等按钮避免用户点击太快，以致于发送了多次请求，需要防抖
2.	调整浏览器窗口大小时，**resize** 次数过于频繁，造成计算过多，此时需要一次到位，就用到了防抖
3.	文本编辑器**实时保存**，当无任何更改操作一秒后进行保存


### 延迟触发
#### 方案1

```js
function debounce(func, wait) {
  let timeout;
  return function () { // 注意此处不要使用箭头函数，避免this指向了调用debounce的实例，而不是真正调用func的对象。
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      // 使用箭头函数, 避免func函数体中使用到this时，造成的this指向错误问题。
      func.apply(this, arguments);
    }, wait)
  }
}
```

#### 方案2：

```js
function debounce(func, wait) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(function() {
      // 在闭包中要特别注意this和arguments
      func.apply(context, args);
    }, wait)
  }
}
```

### 立即触发

```js
function debounce(func, wait) {
  let timeout;
  return function () {
    if (timeout) clearTimeout(timeout);
    else func.apply(this, arguments);
    // 开始计时 或者 重新计时
    timeout = setTimeout(() => {
      timeout = null;
    }, wait);
  }
}
```

## 节流实现

### 应用场景
1.	scroll 事件，每隔一秒计算一次位置信息等
2.	浏览器播放事件，每个一秒计算一次进度信息等
3.	input 框实时搜索并发送请求展示下拉列表，每隔一秒发送一次请求 (也可做防抖)


### 时间戳实现

```js
function throttle(func, wait) {
  let start = Date.now();
  return function() { 
    const now = Date.now();
    if (now - start > wait) { //利用时间戳计算, 延迟到设定的时间后才执行真正的操作.
      func.apply(this, arguments);
      // 重置起始时间戳
      start = now;
    }
  }
}
```


### setTimeout实现

```js
function throttle(func, wait) {
  let timeout;
  return function () {
    // timeout不为空说明已经开始计时
    if (timeout) return;
    // 否则开启定时
    timeout = setTimeout(() => {
      func.apply(this, arguments);
      timeout = null;
    }, wait);
  }
}
```




