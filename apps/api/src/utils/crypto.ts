import assert from "node:assert";

const BASE32_ALPHABET = "abcdefghijklmnopqrstuvwxyz234567";

const byteToBinary = (byte: number): string => {
  return byte.toString(2).padStart(8, "0");
};

const binaryToBase32 = (binary: string): string => {
  const index = Number.parseInt(binary.padEnd(5, "0"), 2);

  assert(index < BASE32_ALPHABET.length, "Binary string must be chunked into 5 bits");

  const base32Char = BASE32_ALPHABET[index];
  if (base32Char == null) {
    throw new Error("Invalid index for BASE32_ALPHABET");
  }

  return base32Char;
};

export const encodeBase32LowerCaseNoPadding = (bytes: Uint8Array): string => {
  const binaryString = Array.from(bytes).reduce((acc, cur) => acc + byteToBinary(cur), "");

  const chunks: string[] = [];
  for (let i = 0; i < binaryString.length; i += 5) {
    chunks.push(binaryString.slice(i, i + 5));
  }

  const base32String = chunks.map(binaryToBase32).join("");

  return base32String;
};
