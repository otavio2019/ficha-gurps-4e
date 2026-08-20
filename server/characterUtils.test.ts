import { describe, expect, it } from "vitest";
import { parsePortraitDataUrl } from "./characterUtils";

describe("parsePortraitDataUrl", () => {
  it("accepts a PNG data URL and prepares the bytes for storage", () => {
    const parsed = parsePortraitDataUrl("data:image/png;base64,aGVsbG8=");
    expect(parsed?.contentType).toBe("image/png");
    expect(parsed?.extension).toBe("png");
    expect(parsed?.buffer.toString()).toBe("hello");
  });

  it("accepts a WEBP data URL for retratos de aliados", () => {
    const parsed = parsePortraitDataUrl("data:image/webp;base64,aGVsbG8=");
    expect(parsed?.contentType).toBe("image/webp");
    expect(parsed?.extension).toBe("webp");
  });

  it("rejects non-image payloads", () => {
    expect(parsePortraitDataUrl("data:text/plain;base64,aGVsbG8=")).toBeNull();
  });
});
