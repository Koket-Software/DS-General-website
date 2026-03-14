import { describe, expect, it } from "bun:test";

import { getUploadSecurityPolicy } from "../upload-security";

describe("upload security policy", () => {
  it("blocks active-content upload types", () => {
    expect(getUploadSecurityPolicy("/uploads/socials/icon.svg")).toEqual({
      blocked: true,
      headers: {
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
      },
    });
  });

  it("forces document uploads to download", () => {
    expect(
      getUploadSecurityPolicy("/uploads/vacancy-applications/resume.pdf"),
    ).toEqual({
      blocked: false,
      headers: {
        "Content-Disposition": "attachment",
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
      },
    });
  });

  it("marks regular uploaded images as non-indexable", () => {
    expect(getUploadSecurityPolicy("/uploads/gallery/photo.webp")).toEqual({
      blocked: false,
      headers: {
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
      },
    });
  });
});
