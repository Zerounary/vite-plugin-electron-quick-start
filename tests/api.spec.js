import { beforeEach, expect, describe, it } from "vitest";
import { defaultTransformFn, usePortalStore } from "@/stores/portal";
import { request } from "@/util/request.ts";


describe("portal api", () => {
  // it("add Detial api test", async () => {
  //   await request.post("/api/loginUser", {
  //     username: "admin",
  //     password: "admin",
  //   });
  //   let res = await request.post("/api/portal", {
  //     opt: "A",
  //     tid: 12899,
  //     data: defaultTransformFn({}),
  //   });
  //   expect(res).toHaveProperty("data.0", 1)
  // });
  it('冒烟测试', () => {
    expect(1).toBe(1);
  })
});
