type Primitive = string | number | boolean | null | undefined;
export type SortRule<TKey extends string = string> = {
  id: TKey;
  desc: boolean;
};
export type SortingState<TKey extends string = string> = readonly SortRule<TKey>[];

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const toComparableString = (v: unknown) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "";
  if (typeof v === "boolean") return v ? "1" : "0";
  if (v instanceof Date) return String(v.getTime());
  return "";
};

export const getByPath = <T extends object>(
  obj: T,
  path: string,
): Primitive => {
  const keys = path.split(".");
  let cur: unknown = obj;

  for (const key of keys) {
    if (!isRecord(cur)) return undefined;
    cur = cur[key];
  }

  if (
    cur == null ||
    typeof cur === "string" ||
    typeof cur === "number" ||
    typeof cur === "boolean"
  ) {
    return cur as Primitive;
  }

  if (cur instanceof Date) return cur.getTime();

  return undefined;
};

export const sortRows = <T extends object, TSortKey extends string = string>(
  rows: readonly T[],
  sorting: SortingState<TSortKey>,
) => {
  const primary = sorting[0];
  if (!primary) return [...rows];

  const { id, desc } = primary;

  const indexed = rows.map((row, index) => ({
    row,
    index,
    value: getByPath(row, id),
  }));

  indexed.sort((a, b) => {
    const av = a.value;
    const bv = b.value;

    let cmp = 0;

    if (typeof av === "number" && typeof bv === "number") {
      cmp = av - bv;
    } else {
      cmp = toComparableString(av).localeCompare(
        toComparableString(bv),
        undefined,
        {
          numeric: true,
          sensitivity: "base",
        },
      );
    }

    if (cmp === 0) cmp = a.index - b.index;
    return desc ? -cmp : cmp;
  });

  return indexed.map((x) => x.row);
};
