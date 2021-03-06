import { assertEquals } from "deno/testing/asserts.ts";

import { toTree } from "../mod.ts";
import type { Node } from "../mod.ts";

Deno.test("test toTree()", function () {
  const result = toTree([
    { id: 2, parentId: null },
    { id: 3, parentId: 1 },
    { id: 1, parentId: null },
  ]);

  const expected = [
    {
      id: 1,
      parentId: null,
      children: [
        { id: 3, parentId: 1, children: [] },
      ],
    },
    { id: 2, parentId: null, children: [] },
  ];

  assertEquals(result, expected);
});

Deno.test("test toTree(root = 0)", function () {
  const result = toTree(
    [
      { id: 2, parentId: 0 },
      { id: 3, parentId: 1 },
      { id: 1, parentId: 0 },
    ],
    { root: 0 },
  );

  const expected = [
    { id: 1, parentId: 0, children: [{ id: 3, parentId: 1, children: [] }] },
    { id: 2, parentId: 0, children: [] },
  ];

  assertEquals(result, expected);
});

Deno.test("test toTree(root = fn)", function () {
  const result = toTree(
    [
      { id: 2, parentId: 0 },
      { id: 3, parentId: 1 },
      { id: 1, parentId: 0 },
    ],
    { root: (nodes: Record<string, Node[]>) => nodes[1] || [] },
  );

  const expected = [{ id: 3, parentId: 1, children: [] }];

  assertEquals(result, expected);
});

Deno.test("test toTree(idKey=sub)", function () {
  const result = toTree(
    [
      { sub: 2, parentId: null },
      { sub: 3, parentId: 1 },
      { sub: 1, parentId: null },
    ],
    { idKey: "sub" },
  );

  const expected = [
    {
      sub: 1,
      parentId: null,
      children: [{ sub: 3, parentId: 1, children: [] }],
    },
    { sub: 2, parentId: null, children: [] },
  ];

  assertEquals(result, expected);
});

Deno.test("test toTree(parentKey=pid)", function () {
  const result = toTree(
    [
      { id: 2, pid: null },
      { id: 3, pid: 1 },
      { id: 1, pid: null },
    ],
    { parentKey: "pid" },
  );

  const expected = [
    { id: 1, pid: null, children: [{ id: 3, pid: 1, children: [] }] },
    { id: 2, pid: null, children: [] },
  ];

  assertEquals(result, expected);
});

Deno.test("test toTree(childrenKey=items)", function () {
  const result = toTree(
    [
      { id: 2, parentId: null },
      { id: 3, parentId: 1 },
      { id: 1, parentId: null },
    ],
    { childrenKey: "items" },
  );

  const expected = [
    { id: 1, parentId: null, items: [{ id: 3, parentId: 1, items: [] }] },
    { id: 2, parentId: null, items: [] },
  ];

  assertEquals(result, expected);
});

Deno.test("test toTree(transform)", function () {
  type Row = { id: number; parentId: number | null };

  const transform = (row: Row) => {
    if (row.id === 2) return;
    return { ...row, test: true };
  };
  const result = toTree(
    [
      { id: 2, parentId: null },
      { id: 3, parentId: 1 },
      { id: 1, parentId: null },
    ],
    { transform },
  );

  const expected = [
    {
      id: 1,
      parentId: null,
      test: true,
      children: [{ id: 3, parentId: 1, children: [], test: true }],
    },
  ];

  assertEquals(result, expected);
});
