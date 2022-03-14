# React 源码

## 初次渲染过程


```js
ReactDom.render(React.createElement(AppClass, null, null), doucment.getElementId("root"));
```

1. 首先 执行React.createElement函数创建出一个ReactElement类型的对象。注意，此时AppClass并没有被执行，仅作为一个实例对象存储在ReactElement类型对象中。
2. 开始执行ReactDom.render方法

### 执行ReactDom.render 方法

首先根据容器元素root创建FiberRoot对象



-------


setState 引起的更新
useState 引起的更新

props 引起的更新

context

ref


commit提交过程

如何中断和恢复

生命周期执行的阶段

Hook执行的阶段



## 数据结构

ReactElement

FiberRoot

Fiber

Update

UpdateQueue


## 文件目录

### react-dom

ReactDOM.js

ReactDOMHostConfig.js 与 ReactFiberHostConfig.js文件有关。 是HostConfig 的具体环境的实现。

### react-reconciler

ReactReconciler.js

	ReactFiberRoot.js  和 FiberRoot类型的对象有关

ReactFiberScheduler.js

	计算优先级，过期时间
	
	构建Fiber树 render阶段
		workLoop 函数循环调用 performUnitOfWork 函数 创建Fiber节点，构造Fiber树。
			performUnitOfWork 函数内部根据是否有子元素判断是调用beginWork 还是completeWork
		ReactFiberBeginWork.js
			beginWork方法： ReactFiberBeginWork.js 文件
				根据workInProgress.tag代表的不同类型，执行不同的方法创建Fiber。
				比如HostRoot类型，ClassComponent类型需要创建实例， FunctionComponent类型等。
				
				如果workProgree.stateNode为null，那么说明需要
					（ReactFiberClassComponent.js ）
					 构造类实例
							在构造类实例的过程中会注入 updater更新器(classComponentUpdater)。
							workInProgress.stateNode = instance
							instance._reactInternalFiber = workInProgress.
					构造完成后，挂载实例
						需要根据workInProgress.updateQueue 计算新的state。
						调用了 static getDerivedStateFromProps() 生命周期方法
					   instance.state = workInProgress.memoizedState;
					   
  			如果workProgress.stateNode 不为null， 说明已经存在一个对应的实例 （这个实例可能是在根据current创建workProgress时存在的）					如果 current === null
  			  			resumeMountClassInstance
  			  		否则
  			  			updateClassInstance
  			  最终调用finishClassComponent方法
  			  		调用了类实例的**render方法**
  			  			nextChildren = **instance.render()**;
					开发创建workInProgress的**child Fiber**节点：调用reconcileChildren（current, workInProgress, nextChildren, // 调用instance.render()生成的ReactElement）方法
			如果是一个尚未渲染的新组件（比如 初始渲染），通过**不跟踪副作用来优化这个调节过程**， 调用mountChildFibers（）方法 创建workInProgress.child Fiber节点
			（ReactChildFiber.js文件）
					reconcileChildFibers（）方法, 在这个方法内会根据 Object，String， Number， Array类型分别调用不同的方法。
					
			createFiberFromElement（）方法会根据 ReactElement的type、key、props创建Fiber节点并返回。
				
				 
		ReactFiberCompleteWork.js
			completeWork
				
		diff算法：
			ReactChildFiber.js
		
		创建Fiber节点
			ReactFiber.js	
				ReactSideEffectTags.js Fiber节点中effetTag的值。

	commit 提交阶段
		ReactFiberCommitWork.js





