
function deepCloneOfRecursion(source, hashMap=new WeakMap()) {
  // 第一步：如果不是对象类型或者为null，直接返回。
  if (!isObject(source)) return source;
  // 第二步：如果hashMap中存在source，直接返回哈希表中对应的值。可以解决循环引用和引用丢失问题。
  if (hashMap.has(source)) return hashMap.get(source);

  // 第三步：根据source类型设置target
  const target = Array.isArray(source) ? [] : {};

  // 第四步：在hashMap中存入新的拷贝关系。
  hashMap.set(source, target);

  // 第五步：获取source的自身可枚举属性，包括Symbol属性。
  const keys = getEnumerablePropertyKeys(source);
  // 第六步：遍历keys，递归拷贝属性。
  keys.forEach(key => {
    target[key] = deepCloneOfRecursion(source[key], hashMap);
    // 这块没有进行isObject的判断, 是因为deepCloneOfRecursion递归的第一步就进行了判断.
    // 因为不想写很多的if判断, 但不知道这样多了一层递归, 对性能是否有大的影响.
  });

  return target;

}

function isObject(value) {
  return typeof value === "object" && value !== null;
}

function getEnumerablePropertyKeys(obj) {
  return [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)];
}

/**
 * 测试
 */
var a = {
  name: "muyiy",
  book: {
    title: "You Don't Know JS",
    price: "45"
  },
  a1: undefined,
  a2: null,
  a3: 123
};

a.circleRef = a;

var b = deepCloneOfRecursion(a);
a.book.title = "9999";
console.log(b);
console.log(b.circleRef === b);
