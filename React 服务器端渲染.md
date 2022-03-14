# React 服务器端渲染

资料：
https://chinese.freecodecamp.org/news/demystifying-reacts-server-side-render/

## 为什么使用服务器端渲染

* SEO 优化
* 首屏渲染速度

## HOW

### 渲染组件

#### 同构
运行代码，刷新页面，我们会发现并没有执行对应的点击事件，这是由于renderToString只渲染了组件的内容，而不会绑定事件，**为了能够给页面上的组件绑定事件，我们需要将React代码在服务端执行一遍，在客户端再执行一遍**，这种服务器端和客户端共用一套代码的方式就称之为**同构**。


### 使用路由

### 使用redux


## SSR框架
成熟的SSR 框架，如 Next.JS

