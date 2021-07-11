# Web性能
> [MDN Web 性能](https://developer.mozilla.org/zh-CN/docs/Web/Performance)

[TOC]

Web 性能包含了服务器请求和响应、加载、执行脚本、渲染、布局和绘制每个像素到屏幕上。

## Web性能最佳实践

•	优化CRP
•	使用resource hints例如rel=preconnect, rel=dns-prefetch, rel=prefetch, and rel=preload
•	压缩Js代码至最小。只为当前页面加载需要使用到的js代码，type="module"
•	CSS性能因素 ：使用媒体类型和查询实现非阻塞渲染
•	在你的服务器（或者CDN）上使用 HTTP/2协议
•	 使用CDN托管静态资源，这样可以显著减少加载时间
•	 使用gzip, Brotli 或者 Zopfli压缩您的资源
•	 图片优化（如果可以，尽可能使用css动画或者svg）
•	 在超出应用视口范围的部分使用懒加载，如果你这么做了，为SEO制定一个后备计划（例如为bot traffic 渲染整个页面）



## CSS和JavaScript的动画性能

* CSS使用 transitions和animations实现动画

* JavaScript使用 requestAnimationFrame()实现动画

### 性能差异
* 二者都是在主 UI 线程创建的动画，那它们在性能方面没有差异.

* 只要动画涉及的属性不引起reflow（重新布局），我们可以把采用操作移出主线程。
	* 最常见的属性是CSS transform。如果一个元素被提升为一个layer，transform属性动画就可以在GPU中进行。这意味着更好地性能。
	* 特别是在移动设备上。

浏览器可以优化渲染流程。总是可以尽可能通过CSS过渡/动画创建动画。

-------

## dns-prefetch

* DNS预获取是尝试在请求资源之前解析域名。
* DNS预获取仅对跨域地址的DNS查找有效。
	* 避免使用它来指向您的站点或域。这是因为，到浏览器看到提示时，您站点域背后的IP已经被解析。 

### 作用：
DNS预获取之后可以将IP地址缓存起来，这样可以帮助减少DNS解析造成的请求延迟，提高加载性能。

### 实现
#### 方案1： HTML <link>元素
> [MDN <link>](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link)
> [MDN rel属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel)

 HTML <link>元素 通过 dns-prefetch的 rel 属性值提供此功能。然后在 href属性中指要跨域的域名：
 ```js
 <link rel="dns-prefetch" href="https://fonts.googleapis.com/"> 
 ```
 
#### 与 preconnect(预连接)配对使用
 preconnect会提前连接到第三方域。如果第三方域是HTTPS服务的，那么就可以提前进行TCP连接和SSL协商过程，减少真正请求的延时。
 
 ```js
 <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>
 <link rel="dns-prefetch" href="https://fonts.gstatic.com/">
 ```
 
 

#### 方案2： HTTP 的实体头部字段 Link
> [MDN Link](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Link)

```js
Link: <https://fonts.gstatic.com/>; rel=dns-prefetch
```
	

-----

## 懒加载（Lazy loading）
> 可以对浏览器第一次渲染（首页渲染）进行优化，提高页面显示速度。

懒加载是一种将资源标识为**非阻塞（非关键）资源**，并仅在需要时加载它们的策略。
这是一种缩短**关键渲染路径**长度的方法，**可以缩短页面加载时间。**

### 策略: 拆分
入口点(静态)拆分：在应用程序中按入口点分隔代码

动态拆分：分离使用动态 import() 语句的代码

#### JavaScript
任何类型为 `type="module"` 的<script>标签都被视为一个 JavaScript 模块，并且默**认情况下会被延迟**。

#### CSS

默认情况下，CSS被视为渲染阻塞资源。在 CSSOM 被构造完成之前，浏览器不会渲染任何已处理的内容
**建议使用媒体类型和查询实现非阻塞渲染**
```html
<link href="style.css"    rel="stylesheet" media="all">
<link href="portrait.css" rel="stylesheet" media="orientation:portrait">
<link href="print.css"    rel="stylesheet" media="print">

```

#### Fonts
默认情况下，字体请求会延迟到构造渲染树之前，这可能会导致文本渲染延迟。

可以使用 <link rel="preload">、CSS font-display 属性和[字体加载 API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API) 来覆盖默认行为**并预加载 Web 字体资源**。

#### Images 和 iframes

超出屏幕可视范围外的图片

方案1： 
<img> 元素上的 **loading 属性**（或 <iframe> 上的 loading 属性）可用于指示浏览器推迟加载屏幕外的图像/iframe，直到用户滚动到它们附近。

```html
<img src="image.jpg" alt="..." loading="lazy">
<iframe src="video-player.html" title="..." loading="lazy"></iframe>
```

方案2： 交叉观察者 API

可以使用 Intersection Observers 观察到的元素何时进入或退出浏览器的视口。

------

## 关键渲染路径 Critical rendering path

### DOM （文档对象模型）
* DOM构建是增量的 
* 节点数量越多，关键渲染路径中的后续事件将花费的时间就越长，性能越差

### CSSOM （CSS对象模型）

* CSS 是渲染阻塞的：浏览器会阻塞页面渲染直到它接收和执行了所有的 CSS
	* CSS 是渲染阻塞是因为规则可以被覆盖，所以内容不能被渲染直到 CSSOM 的完成。
* 从选择器性能的角度，更少的特定选择器是比更多的要快。例如，.foo {} 是比 .bar .foo {} 更快。
	* 构建CSSOM非常快，从选择器的角度可以优化的价值不高。
	* 建议从 压缩和使用媒体查询来异步处理 CSS 为非阻塞的请求。 
	
### Render Tree （渲染树）

* DOM 和 CSSOM 树结合为渲染树。
* 为了构造渲染树，浏览器检查每个节点，从 DOM 树的根节点开始，并且决定哪些 CSS 规则被添加。
* 渲染树只包含了可见内容。
	* 头部（通常）不包含任何可见信息，因此不会被包含在渲染树种。
	* 如果有元素上有 display: none;，它本身和其后代都不会出现在渲染树中。


### Layout （布局）

布局性能受 DOM 影响 -- 节点数越多，布局就需要更长的时间。
为了减小布局事件的频率和时长，批量更新或者避免改动盒模型属性。

#### 什么会造成重排（回流）？
任何渲染树改变的时候

* 添加节点
* 改变内容
* 在一个节点更新盒模型样式

### Paint(绘制)

浏览器被优化为只重绘需要绘制的最小区域
绘制是一个非常快的过程，所以聚焦在提升性能时这大概不是最有效的部分


### 优化CRP
提升页面加载速度需要通过
	* 被加载资源的优先级
	* 控制加载的顺序
	* 减小这些资源的体积。
	
性能提示包含 
1）通过异步重要资源的下载来**减小请求数量**
2）优化**必须的**请求数量和每个请求的文件体积
3）通过区分关键资源的优先级来优化被加载关键资源的顺序，来缩短关键路径长度。




