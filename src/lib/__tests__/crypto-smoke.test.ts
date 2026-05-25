import CryptoJS from "crypto-js";
import {
  computePasswordHash,
  decryptFormData,
  type EncryptedData,
  encryptFormData,
  hashPasswordWithSalt,
  PBKDF2_ITERATIONS,
  validatePassword,
  verifyPasswordHash,
} from "../crypto";

// Tiny iteration count so tests run in milliseconds.
// PBKDF2_ITERATIONS is still asserted to be >= 600_000 below.
const T = 1;

describe("crypto", () => {
  test("PBKDF2_ITERATIONS is hardened (>= 600k)", () => {
    expect(PBKDF2_ITERATIONS).toBeGreaterThanOrEqual(600_000);
  });

  test("round-trips an encrypted payload", () => {
    const original = { name: "Smoke Test", categories: [] };
    const encrypted = encryptFormData(original, "smoke-pass-123", T);
    expect(decryptFormData(encrypted, "smoke-pass-123")).toEqual(original);
  });

  test("throws on wrong password", () => {
    const encrypted = encryptFormData({ secret: true }, "correct", T);
    expect(() => decryptFormData(encrypted, "wrong")).toThrow(
      "Failed to decrypt form data. Please check your password.",
    );
  });

  test("reads legacy no-iv payloads", () => {
    const original = { name: "Legacy", categories: [] };
    const salt = CryptoJS.lib.WordArray.random(256 / 8).toString();
    const key = CryptoJS.PBKDF2("legacy-pass", salt, {
      keySize: 256 / 32,
      iterations: T,
    });
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(original),
      key.toString(),
    ).toString();

    // Omit `iv`; pass iterations so decryptFormData uses the right count.
    const legacyData: EncryptedData = { encrypted, salt, iterations: T };
    expect(decryptFormData(legacyData, "legacy-pass")).toEqual(original);
  });

  test("validatePassword accepts any non-empty string", () => {
    expect(validatePassword("x").isValid).toBe(true);
    expect(validatePassword("").isValid).toBe(false);
    expect(validatePassword("").message).toBe("Password cannot be empty");
  });

  test("hashPasswordWithSalt + computePasswordHash + verifyPasswordHash round-trip", () => {
    const { hash, salt } = hashPasswordWithSalt("mypassword");
    const clientHash = computePasswordHash("mypassword", salt);
    expect(verifyPasswordHash(clientHash, hash)).toBe(true);
    expect(verifyPasswordHash(computePasswordHash("wrong", salt), hash)).toBe(
      false,
    );
  });
});
