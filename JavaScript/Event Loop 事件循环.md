# Event Loop 事件循环
[TOC]

> 通过阅读参考资料后的自己总结，不会是很细致的翻译。涉及到浏览器的事件循环会多写一写。
> 欢迎大家一起讨论。
> 规范比较难读，可以先看MDN的资料
> 参考资料 
> [HTML 规范文档](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)
>  [MDN 在 JavaScript 中通过 queueMicrotask() 使用微任务](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide)
> [MDN 深入：微任务与Javascript运行时环境](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth)
> [深入解析 EventLoop 和浏览器渲染、帧动画、空闲回调的关系](https://zhuanlan.zhihu.com/p/142742003)


## 个人理解的总结：
  
  * 一个事件循环会有一个或多个任务队列，并且这些任务队列中的任务也会有一定的优先级。会在3/4的时间内先处理 鼠标键盘类的任务，然后再处理其他类型任务，保证用户交互的流畅。
  
  * 微任务的执行优先级比较高，
  		* 从每次事件循环过程中都要清空微任务队列，以及在更新动画之前也要判断是否有微任务需要执行看出来的。
  	* 规范中没有 宏任务的词汇和定义。
  	* 网上有些资料中会提到 消息队列，也没看到这个词汇和定义。
  	* 我现在知道 所谓的宏任务是指 task，微任务是指 microtask， microtask是一种特殊算法计算得出的。
  	* [MDN 深入：微任务与Javascript运行时环境](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth)
中有描述什么是宏任务， 什么是微任务
  	* 

目前通过阅读规范和MDN，我的理解是 在window event loop中，每次循环有四个主要阶段：

* 宏任务阶段：从一个或多个task queue中取出 task 并执行
	* 浏览器会在保持任务顺序的前提下，可能分配四分之三的优先权给鼠标和键盘事件，保证用户的输入得到最高优先级的响应
* 微任务阶段： 从 microtask queue中取出 microtask 并执行， 并且直到microtask queue队列为空，才会到下一个阶段
* UI 渲染阶段
	* 在其中 更新动画和发送事件 步骤中，会再次检查是否有可执行的微任务。如果有就执行，没有才会更新动画。也就是说**在更新动画之前会把 microtask queue 清空**。 
	* requestAnimationFrame()方法的回调函数参数是在这个阶段执行的。
* requestIdleCallback()

在一次循环中，这四个阶段都有可能不会执行，如果 task queue中没有可执行的task，那么就会跳过宏任务阶段，查看 microtask queue中是否有可执行的microtask，没有就继续下一个阶段。



我认为每次的循环中，都会清空task queue中的可执行任务，而不是只执行一个宏任务，与microtask 不同的是在执行过程中新加入task queue的宏任务不会被执行，只能等待下一次的循环。
而每次循环中都会尽量清空microtask queue。不会等到下一次循环再执行microtask

以下代码的输出顺序
```js
setTimeout(() => {
  console.log("sto")
  requestAnimationFrame(() => console.log("rAF"))
})
setTimeout(() => {
  console.log("sto888888")
})
setTimeout(() => {
  console.log("sto")
  requestAnimationFrame(() => console.log("rAF"))
})

queueMicrotask(() => console.log("mic"))
queueMicrotask(() => console.log("mic"))
```

```
输出顺序
mic
mic
sto
sto888888
sto
rAF
rAF
```
第一次循环时 宏任务中执行三个setTimeout，它们的回调将会放到task queue中，但本次循环不会执行，微任务输出两个mic，没有UI渲染。第二次循环时，执行了task queue中的3个setTimeout的回调函数。输出 sto sto888888 sto, requestAnimationFrame中的回调会在UI渲染阶段执行，所以输出 rAF rAF



--------

## 浏览器事件循环中的宏任务和微任务

### 宏任务 (task)
* 同步代码 (MDN)
* 事件的回调函数 （MDN）
* setTimeout和setInterval的回调函数参数 （MDN）
* postMessage、MessageChannel
* setImmediate、I/O（Node.js）

### 微任务（microtask）

* MutaionObserver （MDN）
* Promise.then、Promise.catch、 Promise.finally，await （MDN）
* queueMicrotask()可以创建微任务 （MDN）
* 	process.nextTick（Node.js）

### 为什么要有微任务？
> 使用微任务的最主要原因简单归纳为：确保任务顺序的一致性，即便当结果或数据是同步可用的，也要同时减少操作中用户可感知到的延迟而带来的风险。

> 微任务的执行时机：
晚于一段 JavaScript 执行上下文主体的退出，但早于任何事件处理函数、timeouts 或 intervals 及其他回调被执行。

## 事件循环是干什么用的？

事件循环是用来协调事件、用户交互、脚本、渲染、网络I/O等 的一种机制（模型）。

```
# HTML规范
To coordinate events, user interaction, scripts, rendering, networking, and so forth,
```
-----

## 有几种事件循环
* Window 事件循环
	* 我理解就是平时最常使用和谈及的 浏览器的事件循环。 
* Worker 事件循环
	* worker 事件循环顾名思义就是驱动 worker 的事件循环 
* Worklet 事件循环
	* worklet 事件循环用于驱动运行 worklet 的代理。 

```
# HTML规范
The event loop of a similar-origin window agent is known as a window event loop. The event loop of a dedicated worker agent, shared worker agent, or service worker agent is known as a worker event loop. And the event loop of a worklet agent is known as a worklet event loop.
```
-----

## 先了解一下HTML规范中涉及到的主要词汇
> 规范中并未出现 Macro task(宏任务)词汇。

### Task
我理解`task`是可以最终被执行的代码。 （具体细节有很多，可以查阅HTML规范）
网上资料普遍说的**宏任务**应该就是指的 `task`

### Task Queue

一个 `task queue` 是 task的集合，不是队列。 这是因为 事件循环 的第一步是从**所选队列**中获取第一个**可运行**任务，而不是将第一个任务出队。

```
# HTML规范
A task queue is a set of tasks.
Task queues are sets, not queues, because step one of the event loop processing model grabs the first runnable task from the chosen queue, instead of dequeuing the first task.
```


### Microtask

`microtask` 是通过 一个特定算法(`queue a microtask algorithm`) 创建出来的 任务。

```
A microtask is a colloquial way of referring to a task that was created via the queue a microtask algorithm.
```


### Microtask Queue
微任务队列, 用来存放微任务的。
microtask queue 不是一个 task queue 

```
# HTML规范
The microtask queue is not a task queue.
```

### performing a microtask checkpoint
代表是否执行微任务， 以及如何执行微任务。


### Task Source




个人理解：
 
 * task source的作用是对task进行排队，然后放到 task queue 或 microtask queue 中。之后event loop会从task queue 或 microtask queue中取出任务执行。
 
 * task Source 不属于 event loop 的一部分。
 
 * 每个task queue 或 microtask queue 都必须与一个task source相关联。
 * task queue 和 microtask queue 可能会关联同一个 task source 

```
To queue a task on a task source source, which performs a series of steps steps, optionally given an event loop event loop and a document document


8.1.6.3 Processing model
 However, a task queue to which the microtask task source is associated might be chosen in this step

```


### Event Loop
事件循环

* 一个 `event loop` 有一个或多个`task queue`。
* 一个 `event loop` 有一个 `currently running task` 。 我理解就是当前正在主线程中运行的代码。它的值是一个`task` 或者 `null`。 
* 一个 `event loop` 有一个 `microtask queue` ，初始时为空。
* 一个 `event loop` 有一个 ` performing a microtask checkpoint` 的布尔值，初始值为false。 


```
# HTML 规范
An event loop has one or more task queues. 

Each event loop has a currently running task, which is either a task or null. Initially, this is null. It is used to handle reentrancy.

Each event loop has a microtask queue, which is a queue of microtasks, initially empty. A microtask is a colloquial way of referring to a task that was created via the queue a microtask algorithm.

Each event loop has a performing a microtask checkpoint boolean, which is initially false. It is used to prevent reentrant invocation of the perform a microtask checkpoint algorithm.

```




一个微任务可能会被放到task queue中，而不是 microtask queue中
```
It is possible for a microtask to be moved to a regular task queue, if, during its initial execution, it spins the event loop. This is the only case in which the source, document, and script evaluation environment settings object set of the microtask are consulted; they are ignored by the perform a microtask checkpoint algorithm.
```


-----

## 事件循环执行的步骤
> 具体的执行顺序细节查看HTML规范
> [8.1.6.3 Processing model](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)

让 taskQueue 是事件循环的任务队列之一，以实现定义的方式选择，约束条件是所选任务队列必须包含至少一个可运行任务。如果没有这样的任务队列，则跳转到下面的微任务步骤。

### 1. 从task queue中获取第一个可运行的task，然后运行。[步骤1~6]

网上资料普遍说的运行宏任务，应该就是指的这个阶段。

如果 task queue中没有可运行的task，则跳转到微任务的步骤。
中间的具体实现细节可以查阅规范。

### 2. 运行微任务 [步骤7] 
Microtasks: Perform a microtask checkpoint. 
### 3. 计算任务运行时间并上报 [步骤4、8、9、10] 

### 4. 更新渲染阶段 [步骤11]
>前提：这是一个 window event loop。其他类型event loop 没有这个阶段 

>步骤11.1 ~ 11.5 大概是说明了一下执行这个渲染阶段需要的一些条件。也就是说只有满足了某些条件的时候才会执行下面的步骤。（条件没咋看懂，欢迎交流讨论）

#### 4.1 和表单自动填充属性 autofocus 有关 [步骤11.6]
#### 4.2 执行resize事件 [步骤11.7]
#### 4.3 执行scroll事件 [步骤11.8]
#### 4.4 和[媒体查询](https://drafts.csswg.org/cssom-view/#evaluate-media-queries-and-report-changes)有关，涉及到 [MediaQueryList](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaQueryList)
#### 4.5 [更新动画，并发送事件](https://drafts.csswg.org/web-animations/#update-animations-and-send-events)
> 在更新之前会执行 Perform a microtask checkpoint。这是为了确保在上一步中作为更新时间线的一部分resolve或reject结果的Promise 对象而排队的任何微任务，在调度动画事件之前运行它们的回调。

> 只是更新动画帧，不新建动画帧

#### 4.6 [处理全屏上的事件](https://fullscreen.spec.whatwg.org/#run-the-fullscreen-steps)
#### 4.7 执行 传入 requestAnimationFrame方法的回调函数参数。
#### 4.8 [run the update intersection observations steps](https://w3c.github.io/IntersectionObserver/#run-the-update-intersection-observations-steps)
#### 4.9 绘制计算
#### 4.10 执行渲染，更新页面状态 

### 5. 满足以下条件后，执行传入 `requestIdleCallback`方法的回调参数
* 这是一个 `window event loop`
* `task queue` 中没有 `task`
* `microtask queue` 是空的 (也没有要执行的微任务)
* `hasARenderingOpportunity` 的值是`false`

### 6. 这步是 worker event loop 的步骤

-------




3/4的时间内先处理鼠标键盘事件。

```js
For example, a user agent could have one task queue for mouse and key events (to which the user interaction task source is associated), and another to which all other task sources are associated. Then, using the freedom granted in the initial step of the event loop processing model, it could give keyboard and mouse events preference over other tasks three-quarters of the time, keeping the interface responsive but not starving other task queues. Note that in this setup, the processing model still enforces that the user agent would never process events from any one task source out of order.

例如，用户代理可以有一个鼠标和按键事件的任务队列（与用户交互任务源相关联），另一个任务队列与所有其他任务源相关联。然后，使用在事件循环处理模型的初始步骤中授予的自由，它可以在四分之三的时间内给予键盘和鼠标事件优先于其他任务的优先权，保持界面响应但不会使其他任务队列挨饿。请注意，在此设置中，处理模型仍然强制用户代理永远不会无序处理来自任何一个任务源的事件。

```



来源于网上的测试题

```js

// 执行下面这段代码，执行后，在 5s 内点击两下，过一段时间（>5s）后，再点击两下，整个过程的输出结果是什么？

setTimeout(function () {
  for (var i = 0; i < 100000000; i++) {
  }
  console.log('timer a');
}, 0)
for (var j = 0; j < 5; j++) {
  console.log(j); // 第一次循环，宏任务阶段输出： 0 1 2 3 4
}
setTimeout(function () {
  console.log('timer b');
}, 0)

function waitFiveSeconds() {
  var now = (new Date()).getTime();
  while (((new Date()).getTime() - now) < 5000) {
  }
  console.log('finished waiting');
}

document.addEventListener('click', function () {
  console.log('click');
})
console.log('click begin'); // 第一次循环，宏任务阶段输出： click begin
waitFiveSeconds(); // 第一次循环，宏任务阶段输出： 根据代码会执行5秒的循环后再输出 finished waiting

// 第一次循环时，宏任务阶段执行了两个setTimeout方法，间隔时间为0，那么会立即将两个回调函数放入和setTimeout相关的task queue中。
// 根据题目【在 5s 内点击两下】，表示在第一次循环的宏任务阶段没有结束的时候，会触发Click事件，将Click事件的回调函数放入和鼠标键盘相关的task queue中（和setTimeout相关的task queue不是同一个task queue）. 此时window evnet loop 中有两个task queue.

// 第二次循环的时候，由于鼠标键盘相关的task queue中的任务优先级比其他task queue中的高，所以会先执行 在5s内触发的两次Click事件的回调函数，输出两次 click，然后再执行setTimeout相关的task queue中的任务，输出 timer a 和 timer b

// 在5s后再次触发click事件，在第一次循环的宏任务执行阶段之后触发的，也会被放入和鼠标键盘相关的task queue中，虽然这个task queue的优先级更高，但规范中也提出 不会饿死其他类型的task。所以我认为这是在timer b之后输出click的原因。

 it could give keyboard and mouse events preference over other tasks three-quarters of the time, keeping the interface responsive but not starving other task queues.


```
输出顺序
```

0
1
2
3
4
click begin
finished waiting
click
click
timer a
timer b
click
click
```


------














