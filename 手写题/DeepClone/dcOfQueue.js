function deepCloneOfQueue(source) {
  if (!isObject(source)) return source;
  const node = {
    target: Array.isArray(source) ? [] : {}, // 克隆出来的新对象
    cloned: source // cloned是被克隆的意思,指向被克隆的对象.
  };
  // 初始化队列和哈希表
  const queue = [node];
  const hashMap = new WeakMap([[node.cloned,node.target]]);

  while(queue.length > 0) {
    const {target, cloned } = queue.pop();
    const keys = getEnumerablePropertyKeys(cloned);

    keys.forEach(key => {
      const value = cloned[key];
      if (isObject(value)) {
        if (hashMap.has(value)) {
          target[key] = hashMap.get(value);
        } else {
          target[key] = Array.isArray(value) ? [] : {};
          hashMap.set(value, target[key]);
          queue.push({target: target[key], cloned: value});
        }
      } else {
        target[key] = value;
      }
    });
  }

  return node.target;
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

var b = deepCloneOfQueue(a);
a.book.title = "9999";
console.log(b);
console.log(b.circleRef === b);
