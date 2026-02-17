import { describe, expect, it } from "vitest";
import { getByPath, sortRows } from "./sort";

type Row = {
  id: number;
  code: string;
  active: boolean;
  name: { common: string };
  stats: { population: number };
  createdAt?: Date;
};

const rows: Row[] = [
  {
    id: 1,
    code: "Item2",
    active: true,
    name: { common: "Zulu" },
    stats: { population: 30 },
    createdAt: new Date("2020-01-01T00:00:00.000Z"),
  },
  {
    id: 2,
    code: "Item10",
    active: false,
    name: { common: "Alpha" },
    stats: { population: 10 },
    createdAt: new Date("2021-01-01T00:00:00.000Z"),
  },
  {
    id: 3,
    code: "Item1",
    active: true,
    name: { common: "Alpha" },
    stats: { population: 20 },
    createdAt: new Date("2022-01-01T00:00:00.000Z"),
  },
];

describe("sort utilities", () => {
  it("gets primitive values by nested path", () => {
    expect(getByPath(rows[0], "name.common")).toBe("Zulu");
    expect(getByPath(rows[0], "stats.population")).toBe(30);
    expect(getByPath(rows[0], "active")).toBe(true);
    expect(getByPath(rows[0], "createdAt")).toBe(
      new Date("2020-01-01T00:00:00.000Z").getTime(),
    );
    expect(getByPath(rows[0], "stats")).toBeUndefined();
    expect(getByPath(rows[0], "missing.path")).toBeUndefined();
  });

  it("returns a copy when no sorting is provided", () => {
    const result = sortRows(rows, []);
    expect(result).toEqual(rows);
    expect(result).not.toBe(rows);
  });

  it("sorts numbers ascending and descending", () => {
    expect(
      sortRows(rows, [{ id: "stats.population", desc: false }]).map(
        (row) => row.id,
      ),
    ).toEqual([2, 3, 1]);

    expect(
      sortRows(rows, [{ id: "stats.population", desc: true }]).map(
        (row) => row.id,
      ),
    ).toEqual([1, 3, 2]);
  });

  it("sorts strings with numeric awareness and preserves stable order", () => {
    expect(
      sortRows(rows, [{ id: "code", desc: false }]).map((row) => row.code),
    ).toEqual(["Item1", "Item2", "Item10"]);

    expect(
      sortRows(rows, [{ id: "name.common", desc: false }]).map((row) => row.id),
    ).toEqual([2, 3, 1]);
  });
});
