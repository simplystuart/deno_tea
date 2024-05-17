import { assertEquals } from "https://deno.land/std@0.220.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.220.0/testing/bdd.ts";

import { port, worker } from "../src/platform.ts";

describe("platform", () => {
  describe("port", () => {
    it("should return a port function", () => {
      const port_ = port("test");
      assertEquals(typeof port_, "function");
    });
  });

  describe("worker", () => {
    it("should return a record of ports", () => {
      port("test");

      const main = worker({}, {
        init: () => [{}, []],
        update: () => [{}, []]
      });

      assertEquals(typeof main, "object");
      assertEquals(typeof main.test, "object");
      assertEquals(typeof main.test.subscribe, "function");
      assertEquals(typeof main.test.unsubscribe, "function");
    })
  });
});
