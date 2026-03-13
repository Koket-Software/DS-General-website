import { describe, expect, it } from "bun:test";

import { buildPath } from "../index";

describe("module route path builder", () => {
  it("keeps /api/og paths unversioned for canonical OG endpoints", () => {
    expect(buildPath("/api/og")).toBe("/api/og");
    expect(buildPath("/api/og/page")).toBe("/api/og/page");
  });

  it("keeps already-versioned API paths unchanged", () => {
    expect(buildPath("/api/v1/blogs")).toBe("/api/v1/blogs");
  });

  it("upgrades non-versioned API paths to /api/v1", () => {
    expect(buildPath("/api/services")).toBe("/api/v1/services");
  });

  it("does not change non-api paths", () => {
    expect(buildPath("/_ssr")).toBe("/_ssr");
  });
});
