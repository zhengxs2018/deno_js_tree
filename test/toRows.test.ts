import { assertEquals } from "deno/testing/asserts.ts";

import { toRows } from "../mod.ts";

Deno.test("test toRows()", function () {
  const result = toRows([
    { id: 1, parentId: null, children: [{ id: 3, parentId: 1, children: [] }] },
    { id: 2, parentId: null, children: [] },
  ]);

  const expected = [
    { id: 1, parentId: null },
    { id: 3, parentId: 1 },
    { id: 2, parentId: null },
  ];

  assertEquals(result, expected);
});

Deno.test("test toRows(children=items)", function () {
  const result = toRows(
    [
      { id: 1, parentId: null, items: [{ id: 3, parentId: 1, items: [] }] },
      { id: 2, parentId: null, items: [] },
    ],
    "items",
  );

  const expected = [
    { id: 1, parentId: null },
    { id: 3, parentId: 1 },
    { id: 2, parentId: null },
  ];

  assertEquals(result, expected, "数据不一致");
});
