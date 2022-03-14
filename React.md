# React

## 说一下前端路由，他们的实现原理分别是什么？

> https://juejin.cn/post/6844903906024095751#heading-3

前端路由主要有以下两种实现方案：
	•	Hash
	•	History

### Hash
#### 原理
早期的前端路由的实现就是基于 location.hash 来实现的
location.hash 的值就是 URL 中 # 后面的内容。
hash 也存在下面几个特性：

* URL 中 hash 值只是客户端的一种状态，也就是说当向服务器端发出请求时，hash 部分不会被发送。
* hash 值的改变，都会在浏览器的访问历史中增加一个记录。因此我们能通过浏览器的回退、前进按钮控制hash 的切换。
* 我们可以使用 hashchange 事件来监听 hash 的变化。

两种方式触发 hash 变化:

* 一种是通过 a 标签，并设置 href 属性，当用户点击这个标签后，URL 就会发生改变，也就会触发 hashchange 事件了：
* 直接使用 JavaScript来对 loaction.hash 进行赋值，从而改变 URL，触发 hashchange 事件：

#### 实现
先定义一个父类 BaseRouter，用于实现 Hash 路由和 History 路由的一些共有方法
```js
export class BaseRouter { // list 表示路由表 
  constructor(list) {
    this.list = list;
  } // 页面渲染函数 
  render(state) {
    let ele = this.list.find(ele => ele.path === state);
    ele = ele ? ele : this.list.find(ele => ele.path === '*');
    ELEMENT.innerText = ele.component;
  }
}
```

简单实现了 push 压入功能、go 前进/后退功能

```js
export class HashRouter extends BaseRouter {
  constructor(list) {
    super(list);
    this.handler();
    // 监听 hashchange 事件
    window.addEventListener('hashchange', e => {
      this.handler();
    });
  }
  // hash 改变时，重新渲染页面
  handler() {
    this.render(this.getState());
  }
  // 获取 hash 值
  getState() {
    const hash = window.location.hash;
    return hash ? hash.slice(1) : '/';
  }
  // push 新的页面
  push(path) {
    window.location.hash = path;
  }
  // 获取 默认页 url
  getUrl(path) {
    const href = window.location.href;
    const i = href.indexOf('#');
    const base = i >= 0 ? href.slice(0, i) : href;
    return base +'#'+ path;
  }
  // 替换页面
  replace(path) {
    window.location.replace(this.getUrl(path));
  }
  // 前进 or 后退浏览历史
  go(n) {
    window.history.go(n);
  }
}

```

----

### History
#### 原理
因此到了 HTML5，又提供了 History API 来实现 URL 的变化。
其中做最主要的 API 有以下两个：history.pushState() 和 history.repalceState()。

这两个 API可以在**不进行刷新**的情况下，操作浏览器的历史纪录。
唯一不同的是，前者是新增一个历史记录，后者是直接替换当前的历史记录，如下所示：

```js
window.history.pushState(null, null, path);
window.history.replaceState(null, null, path);
```

history 存在下面几个特性：
	•	pushState 和 repalceState 的标题（title）：一般浏览器会忽略，最好传入 null ；
	•	我们可以使用 popstate  事件来监听 url 的变化；
	•	history.pushState() 或 history.replaceState() 不会触发 popstate 事件，这时我们需要手动触发页面渲染；

```js
export class HistoryRouter extends BaseRouter {
  constructor(list) {
    super(list);
    this.handler();
    // 监听 popstate 事件
    window.addEventListener('popstate', e => {
      console.log('触发 popstate。。。');
      this.handler();
    });
  }
  // 渲染页面
  handler() {
    this.render(this.getState());
  }
  // 获取 url 
  getState() {
    const path = window.location.pathname;
    return path ? path : '/';
  }
  // push 页面
  push(path) {
    history.pushState(null, null, path);
    this.handler();
  }
  // replace 页面
  replace(path) {
    history.replaceState(null, null, path);
    this.handler();
  }
   // 前进 or 后退浏览历史
  go(n) {
    window.history.go(n);
  }
}

```


### 区别


  对比点 		|Hash 模式|    History 模式
-------|-------|-----
美观性：|带着 # 字符，较丑 | 简洁美观
兼容性：| >= ie 8，其它主流浏览器 |  >= ie 10，其它主流浏览器

实用性：| 不需要对服务端做改动    | 需要服务端对路由进行相应配合设置

