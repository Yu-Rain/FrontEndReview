# Node.js事件循环

> [Node.js 事件循环，定时器和 process.nextTick](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/)

* 事件循环是Node.js处理非阻塞I/O的机制
* libuv（实现 Node.js 事件循环和平台的所有异步行为的 C 函数库）
* Node.js 的工作线程池是通过 libuv（相关文档）来实现的，它对外提供了一个通用的任务处理 API。


## 阶段概述
> * 每个阶段都有一个 FIFO 队列来执行回调 
> 		* 这一点和浏览器中的window event loop不同，window event loop 的 task queue本质上是一个集合（Set），不是一个队列，并不会完全按照FIFO原则执行task。
> * 当该队列已用尽或达到系统相关的回调数量限制，事件循环将移动到下一阶段

* timers(计时器)
	* 执行setTimeout()和setINterval()的回调参数 
* pending callbacks(等待(挂起)回调)
	* 执行延迟到下一个循环迭代的I/O回调？？？？？ 
* idle,prepare：仅系统内部使用 
* poll(轮询)
	* 检索新的I/O事件
	* 执行与I/O相关的回调
		* ？？？？（几乎所有情况下，除了关闭的回调函数，那些由计时器和 setImmediate() 调度的之外），其余情况 node 将在适当的时候在此阻塞。  
* check(检测)
	* 执行setImmediate()的回调参数 
* close callbacks(关闭的回调函数)
	* 一些关闭的回调函数，如：socket.on('close', ...)。 


## Node.js事件循环机制的个人理解

Node.js启动后，初始化事件循环，执行入口文件的代码，遇到异步API，定时器等代码，会把相关事件放到上述对应的阶段队列中。之后开始第一次的循环。

### 执行timers队列任务

首先确认**timers队列**中是否有可以执行的事件。如果有则执行。 

如果在执行timers队列的事件时，又加入了新的timer事件， 那么新加入的事件不会执行。需要等到下一次循环。
	
### 执行 pending callbacks阶段的队列任务
	
### 执行轮询队列中的任务
首先判断轮询队列是否为空。
如果不为空，则执行轮询队列中的任务。

如果为空，则查看 **check阶段**的队列中是否有setImmediate事件的回调任务，如果有则执行。


### 执行close阶段的队列任务

### 特殊的process.nextTick()
通过process.nextTick()执行的事件会将任务放到**nextTickQueue**中。
在当前任务执行完成后，会立即执行nextTickQueue中的任务，不会等到这个阶段结束。

```
process.nextTick()在有些文章中被称为 微任务。首先在Node的官方文档中并没有微任务的概念。我认为之所以这么称呼，是因为process.nextTick()的执行时机 与 window event loop中的微任务执行时机类似，并不是完全相同。

相似之处在于 process.nextTick()的回调任务和微任务都会在 本次循环中执行完成，不会延迟到下一次循环。

```
<!--

```
 在每次运行的事件循环之间，Node.js 检查它是否在等待任何异步 I/O 或计时器，如果没有的话，则完全关闭。
```

个人理解：

根据官网举例和说明理解如下：

轮询阶段队列为空后，要先看timers阶段的队列里是否有需要执行的任务，如果有那么就去timers阶段执行；如果没有就在轮询阶段继续判断

（这样是不是就保证了，事件循环进入了轮询阶段时，timers阶段的队列一定是空的？）

timers阶段队列为空的时候，进入轮询阶段的两种情况之一：

* 轮询队列不是空的
	* 那就一直同步执行队列中的任务，直到队列为空或到达系统的最大限制。

* 轮询队列是空的
	* 查看check阶段是否有setImmediate()的相关任务，
		* 有就去check阶段执行。
		* 没有就在轮询阶段等待新的任务加入轮询队列并立即执行。
		* 在轮询队列为空，等待新任务加入的时候，如果有新的定时器达到定时时间，timers阶段的队列有了新任务，那么就会去timers阶段执行。-->


### 测试代码

```js
const fs = require("fs");
console.log("main start");
setTimeout(function(){
  console.log("setTimeout 1");

  setTimeout(function () {
    console.log("setTimeout 2-1");
  }, 0);

  setTimeout(function() {
    console.log("setTimeout 2-2")
  }, 1000);

}, 0);

console.log("file I/O start");
fs.readFile("./package.json", function(err, state){
  console.log("file I/O end");
});

setImmediate(function(){
  console.log("setImmediate start");

  const start = Date.now();
  while(Date.now() - start < 2000) {
    // 手动延迟2秒钟
  }
  console.log("setImmediate end");
  });

console.log("main end");
```

输出顺序

```js
// Node.js开始执行，事件循环初始化的时候输出的。
main start
file I/O start
main end

// 第一次循环，timer队列中已经存在到期的定时器事件，所以执行并输出。同时开启另外两个定时器。
setTimeout 1
// 由于文件读取没有结束，轮询队列为空，所以查看check队列中是否有可以执行的任务。
setImmediate start
// 2秒后输出， setImmediate任务执行完成，check队列为空。
//（我理解到这一步，由于没有close阶段，所以第一次循环结束了）
setImmediate end
// 此时轮询队列中已经存在文件I/O的回调任务了，但同时timer队列中已经存在定时任务了，所以先执行了timer队列中的任务。
//（我理解这相当于第二次循环的开始，要先检查timer队列中是否存在任务）
setTimeout 2-1
setTimeout 2-2
// 执行完timer队列，然后来到了轮询阶段，此时轮询队列中已经存在文件I/O任务，所以执行任务
file I/O end
```


## 其他总结
### setTimeout 和 setImmediate
<!--在每次循环中，timer队列中的可以被执行的任务都是初始化或上一次事件循环时加入的。

但是如果在执行轮询队列中的任务时， 有新加入 check队列中的setImmediate事件的回调任务， 会在本次循环时执行，不会延迟到下一次循环。-->

在同一个I/O任务（轮询队列中的任务）中调用，setImmediate事件的回调任务比setTimeout事件的回调任务早执行

```js
const fs = require("fs");
console.log("main start");
setTimeout(function(){
  console.log("setTimeout 1");
}, 0);

setImmediate(function() {
  console.log("setImmediate 1");
});

console.log("[初始化] file I/O start");
fs.readFile("./package.json", function(err, state){
  console.log("file I/O end");
  setImmediate(function () {
    console.log("file I/O setImmediate");
  });
  setTimeout(function () {
    console.log("file I/O setTimeout");
  })

});
console.log("[初始化] main end");
```

输出顺序

```js
main start
[初始化] file I/O start
[初始化] main end
setTimeout 1
setImmediate 1
file I/O end
file I/O setImmediate
file I/O setTimeout
```






