export type Result<err, ok> = { kind: "ok"; value: ok } | {
  kind: "err";
  error: err;
};
