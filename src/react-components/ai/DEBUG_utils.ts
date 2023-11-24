import { Message } from 'ai/react';

export const DEBUG_MESSAGE: Message[] = [
  {
    content: '你好',
    role: 'user',
    id: 'bEWVuuR'
  },
  {
    id: '8E4w1pz',
    content: '你好! 我是AI语言模型，有什么可以帮助您的吗？',
    role: 'assistant'
  },
  {
    content: '使用 TS 编写二分查找并解释',
    role: 'user',
    id: 'BDv0BBt'
  },
  {
    id: 'xqmdBiD',
    content:
      '二分查找（Binary Search）是一种高效的查找算法，也称为折半查找。该算法的实现需要数据排好序，它首先在数组中间查找元素，如果这个元素不是要查找的元素，那么就根据大小关系可以排除数组的一半，再在剩下一半的元素中查找，依此类推，直到找到要查找的元素或者确定该元素不存在为止。\n\n以下是用 TypeScript 实现二分查找的代码示例:\n\n```typescript\nfunction binarySearch(arr: number[], target: number): number {\n  let left = 0;\n  let right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) {\n      return mid;\n    } else if (arr[mid] > target) {\n      right = mid - 1;\n    } else {\n      left = mid + 1;\n    }\n  }\n  return -1;\n}\n```\n\n该函数接收两个参数，一个已排序的数字数组 `arr`，和要查找的目标数字 `target`。变量 `left` 和 `right` 分别为已排序数组的左右边界，初始化 `left` 为0， `right` 为 `arr.length-1`。接下来就是一个循环，根据中间元素与目标数字的大小关系，不断缩小范围。如果找到目标数字，函数返回它出现的下标，否则返回 -1。\n\n以上就是二分查找算法的 TypeScript 实现及其解释。',
    role: 'assistant'
  },
  {
    content: '使用 TS 编写二分查找并解释',
    role: 'user',
    id: 'BDv0BBt'
  },
  {
    id: 'xqmdBiD',
    content:
      '二分查找（Binary Search）是一种高效的查找算法，也称为折半查找。该算法的实现需要数据排好序，它首先在数组中间查找元素，如果这个元素不是要查找的元素，那么就根据大小关系可以排除数组的一半，再在剩下一半的元素中查找，依此类推，直到找到要查找的元素或者确定该元素不存在为止。\n\n以下是用 TypeScript 实现二分查找的代码示例:\n\n```typescript\nfunction binarySearch(arr: number[], target: number): number {\n  let left = 0;\n  let right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) {\n      return mid;\n    } else if (arr[mid] > target) {\n      right = mid - 1;\n    } else {\n      left = mid + 1;\n    }\n  }\n  return -1;\n}\n```\n\n该函数接收两个参数，一个已排序的数字数组 `arr`，和要查找的目标数字 `target`。变量 `left` 和 `right` 分别为已排序数组的左右边界，初始化 `left` 为0， `right` 为 `arr.length-1`。接下来就是一个循环，根据中间元素与目标数字的大小关系，不断缩小范围。如果找到目标数字，函数返回它出现的下标，否则返回 -1。\n\n以上就是二分查找算法的 TypeScript 实现及其解释。',
    role: 'assistant'
  },
  {
    content: '编写 Javascript 入门 文档大纲',
    role: 'user',
    id: 'ECTry5L'
  },
  {
    id: '8oqGiR5',
    content:
      '下面是一份Javascript入门文档的大纲，供参考：\n\n## 1. 前言\n- 什么是Javascript？\n- Javascript的历史和版本\n- 为什么学习Javascript？\n\n## 2. 基础语法\n- 认识Javascript注释\n- 声明变量\n- 数据类型\n    - 字符串\n    - 数字\n    - 布尔值\n    - undefined\n    - null\n    - 对象\n    - 数组\n- 运算符\n- 常见的流程控制语句\n    - if语句\n    - switch语句\n    - for语句\n    - while语句\n    - do-while语句\n\n## 3. 函数\n- 学习什么是函数\n- 如何定义一个函数\n- 学习函数返回值\n- 函数的参数\n    - 有参数函数\n    - 无参数函数\n    - 默认参数\n    - 剩余参数\n\n## 4. 对象和数组\n- 学习Javascript中的对象\n    - 什么是对象\n    - 定义对象\n    - 访问对象的属性\n    - 删除对象的属性\n    - 对象中方法的调用\n- 学习Javascript中的数组\n    - 什么是数组\n    - 如何定义数组\n    - 如何访问数组的元素\n    - 其他有用的数组方法\n\n## 5. DOM操作\n- 认识DOM\n- 如何获取DOM元素\n- 如何操作DOM元素\n- 认识事件\n- 如何处理事件\n\n## 6. 异步请求\n- 如何发起异步请求\n- 如何处理异步请求返回的数据\n\n## 7. 模块化编程\n- 什么是模块化编程\n- 如何使用ES6模块\n- 如何使用CommonJS模块\n\n## 8. JavaScript框架和库\n- JQuery 简介（选学）\n- Vue.js 简介（选学）\n- React 简介（选学）\n\n## 9. 最佳实践\n- 学习 JavaScript 开发规范\n- 代码注释\n- 编写可读性高的代码\n\n## 10. 总结\n- 对JavaScript有了全面的认识\n- 为何要多练习\n- 推荐一些优秀的学习素材\n\n以上是Javascript入门文档的大纲，希望对你有所帮助！',
    role: 'assistant'
  }
];
