// TYPES

export type Primative = boolean | number | string;

export type List<T> = T[];

export type Record<T> = {
  [k: string]: T;
};

export type Maybe<T> = { kind: "just"; value: T } | { kind: "nothing" };

export type Result<err, ok> = { kind: "ok"; value: ok } | {
  kind: "err";
  error: err;
};
