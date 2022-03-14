# 闭包

## What

### 什么是闭包？
* 闭包是由函数以及声明该函数的词法环境组合而成的。
* 可以在内层函数访问外层函数的作用域
* 每当创建一个函数，闭包就会在函数创建的同时被创建出来

### 闭包普遍的表现形式
在函数A中定义函数B， 并且函数B中访问了函数A作用域中的变量。这时，**函数B维持了对它的词法环境的引用，形成了闭包**

## Why

### 简单说一下闭包的使用场景

* 函数柯里化
* 实现单例设计模式
* 实现迭代器
* 立即执行函数
	* 立即执行函数是指声明完之后便直接执行的函数，这类函数通常是一次性使用的，因此没必要给这类函数命名，直接为匿名函数让它执行就好了； 
	* **立即执行函数就是： 声明一个匿名函数，马上调用这个匿名函数**
	
	* 把一个匿名函数并立即执行它的方法称为 IIFE(Immediately-Invoked Function Expression,立即执行函数表达式)。
	* 主要目的是做的一些封装，**防止变量全局污染，以及保证内部变量的安全**；
		* 只有一个作用：**创建一个独立的作用域**。 
		* 可以解决在for循环中var定义的i最后输出的都是同一个值的问题。
		* 实际上就是用函数传参，在新的函数作用域中新建参数变量，保证了变量的值不受外界影响。 而现在可以使用let语法的块作用域做到。
	

## How

### 闭包引起的内存泄露
* 未及时清除监听的事件

### 在闭包中需要注意 this的引用问题


由于内外层函数arguments变量同名的原因， 在内层函数中无法直接访问外层函数中的arguments变量。需要在外层函数中 将arguments变量赋值给另一个变量A后， 在内层函数中通过访问变量A来访问外层的arguments变量

### 闭包在处理速度和内存消耗方面对脚本性能具有负面影响
以下代码不适合使用闭包
原因： 每次new MyObject()的时候， 都会重新定义函数赋值给this.getName。 而这个函数只需要与实例对象（this)相关联， 并不需要对定义函数的词法环境进行引用

```js
function MyObject(name, message) {
  this.name = name.toString();
  this.message = message.toString();
  this.getName = function() {
    return this.name;
  };

  this.getMessage = function() {
    return this.message;
  };
}
```

优化

```js
function MyObject(name, message) {
  this.name = name.toString();
  this.message = message.toString();
}
MyObject.prototype.getName = function() {
  return this.name;
};
MyObject.prototype.getMessage = function() {
  return this.message;
};
```


