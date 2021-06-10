# JS基础

## 数据类型

### 基本类型
* string
* number
* bigInt
	* ES2020新类型，任意精度的整数
	* 可以安全地存储和操作大整数，甚至超过数字的安全整数限制 （2的23次方）
* boolean
	* 只有 true 和 false两个值
* symbol
	* ES6新类型，表示独一无二的值
* undefined
	* 全局对象的值属性
	* 不是关键字，可以作为变量名。
* null
	* 关键字
	* 不是全局变量的属性         
### 引用类型
* object

-----
## 简述 null 和 undefined 的区别

* null 表示缺少的标识，代表变量未指向任何对象
* undefined 表示未定义，是全局对象的一个属性。
	* 一个没有被赋值的变量类型是undefined
	* 函数内没有用return指定返回值，那么返回的就是undefined 

### 区别

null | undefined
-----| -------
`typeOf null` // object | `typeOf undefined` // undefined
`isNaN(null + 1)` // false | `isNaN(undefined + 1)` // true
null === undefined // false | null == undefined // true 


-----

## Javascript 中 == 与 === 的区别是什么？

在严格模式下， `==` 不判断变量类型，会进行隐式的类型转换。比如 0、空字符串、undefined、null可以转换成false。

`===` 会判断变量类型。只要变量类型不一致就会判断为不等于
	* NaN === NaN 结果为false
	* +0 === -0 结果为 true


Object.is()方法可以进行变量相等的判断。 与 `===`的区别主要在数学概念上。
 * Object.is(NaN, NaN) 结果为 true
 * Object.is(+0, -0) 结果为 false	
------

## 简述 Javascript 中 this 的指向有哪些?
* 在全局作用域下，调用函数或者使用变量，内部this指向window（浏览器）或者 gloable（Node）
* 在构造函数或者类中，this指向实例对象
* 在箭头函数中，this指向定义箭头函数的上下文。
* 在以function关键字声明的函数中，this指向调用函数的上下文。

-----


## 简述 map 与 foreach 的区别
> 待补充

## 为什么 0.1 + 0.2 会丢失精度？
> 待补充

