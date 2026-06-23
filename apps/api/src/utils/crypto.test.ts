import { expect, test } from "bun:test";
import { encodeBase32LowerCaseNoPadding } from "./crypto";

const encode = (input: string): string =>
  encodeBase32LowerCaseNoPadding(new TextEncoder().encode(input));

test("encodeBase32LowerCaseNoPadding() matches RFC 4648 vectors", () => {
  // RFC 4648 base32 test vectors, lowercased and without padding.
  expect(encode("")).toBe("");
  expect(encode("f")).toBe("my");
  expect(encode("fo")).toBe("mzxq");
  expect(encode("foo")).toBe("mzxw6");
  expect(encode("foob")).toBe("mzxw6yq");
  expect(encode("fooba")).toBe("mzxw6ytb");
  expect(encode("foobar")).toBe("mzxw6ytboi");
});

test("encodeBase32LowerCaseNoPadding() only emits alphabet characters", () => {
  const bytes = new Uint8Array(64);
  crypto.getRandomValues(bytes);
  expect(encodeBase32LowerCaseNoPadding(bytes)).toMatch(/^[a-z2-7]*$/);
});
