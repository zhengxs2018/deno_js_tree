# deno_js_tree

![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)

> 注意：当前模块是 [@zhengxs2018/js.tree@0.1.2][js.tree] 模块的包装，使用 `unpkg.com` 引入。

快速，轻量，无依赖的树结构数据处理函数库。

## 特点

- 一个循环解决行转树的问题
- 转树除了添加 `children` 属性，不会修改任何数据
- 支持任意关系字段，如：id，parentId, children 字段
- 支持动态导出树节点
- 内置 `filter/map` 树遍历快捷方法

## 使用

**行转树**

```js
import { ROOT_ID, toTree } from "https://deno.land/x/js_tree@0.1.2/mod.ts";

const data = [
  { id: 2, parentId: null },
  { id: 3, parentId: 1 },
  { id: 1, parentId: null },
];

const result = toTree(data, {
  // 只有 null 或 undefined 才会将 root 改成 ROOT_ID
  // 如果根ID不是 null 或 undefined，那就需要手动指定
  // 支持函数，动态返回
  root: ROOT_ID,

  // 不是所有的关系字段都叫这个
  // 这时就可以手动指定
  idKey: "id", // 默认: id
  parentKey: "parentId", // 默认：parentId

  // 挂载子级的属性名称，默认：children
  childrenKey: "children",

  // 数据添加进 children 数组前的处理，默认：undefined
  transform(data) {
    // 可以通过 Object.create 创建
    // 这样可以避免修改原始数据，同时又能共享原型
    return Object.create(data);
  },
});
// ->
// [
//   { id: 2, parentId: null, children: [] },
//   {
//     id: 1,
//     parentId: null,
//     children: [{ id: 3, parentId: 1, children: [] }]
//   }
// ]
```

**树转行**

```js
import { toRows } from "https://deno.land/x/js_tree@0.1.2/mod.ts";

const data = [
  { id: 2, parentId: null, children: [] },
  {
    id: 1,
    parentId: null,
    children: [{ id: 3, parentId: 1, children: [] }],
  },
];

// 如果不是 children 属性，可以通过第二个参数指定，可选
const result = toRows(data, "children");
// ->
// [
//   { id: 2, parentId: null },
//   { id: 3, parentId: 1 },
//   { id: 1, parentId: null }
// ]
```

**内容过滤**

```js
import { filter } from "https://deno.land/x/js_tree@0.1.2/mod.ts";

const data = [
  {
    title: "财务",
    children: [{ title: "收入流失" }, { title: "财务设置" }],
  },
  {
    title: "站点设置",
    children: [{ title: "菜单维护" }, { title: "角色维护" }],
  },
];

// 如果不是 children 属性，可以通过第二个参数指定，可选
const result = filter(data, (node, index, parents) => {
  return node.title.indexOf("设置") > -1;
});
// ->
// [
//   {
//     title: '财务',
//     children: [
//       { title: '财务设置' }
//     ]
//   },
//   {
//     title: '站点设置',
//     children: [
//       { title: '菜单维护' },
//       { title: '角色维护' }
//     ]
//   }
// ]

// 如果不是 children 属性，可以通过第三个参数指定，可选
const result = filter(data, callback, "items");
```

**修改内容**

```js
import { map } from "https://deno.land/x/js_tree@0.1.2/mod.ts";

const data = [
  {
    title: "财务",
    children: [{ title: "收入流失" }, { title: "财务设置" }],
  },
  {
    title: "站点设置",
    children: [{ title: "菜单维护" }, { title: "角色维护" }],
  },
];

const result = map(data, (node, index, parents) => {
  if (node.title === "财务") {
    // 可以返回空的子节点，停止处理子级
    // 注意：参数浅拷贝，修改不会改变原始对象
    node.children = [];
    return node;
  }

  // 注意：参数浅拷贝，修改不会改变原始对象
  node.title = node.title + "测试";

  // 必须返回内容
  return node;
});
// ->
// [
//   {
//     title: '财务',
//     children: []
//   },
//   {
//     title: '站点设置测试',
//     children: [{ title: '菜单维护测试' }, { title: '角色维护测试' }]
//   }
// ]

// 如果不是 children 属性，可以通过第三个参数指定，可选
const result = map(data, callback, "items");
```

## License

- MIT

[js.tree]: https://github.com/zhengxs2018/js.tree
