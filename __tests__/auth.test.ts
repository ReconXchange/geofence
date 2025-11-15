import { describe, it, expect } from "vitest";
import { signAccessToken, verifyAccessToken } from "@/lib/auth/jwt";

describe("JWT Auth", () => {
  it("should sign and verify access token", () => {
    const payload = {
      userId: "test-user-id",
      email: "test@example.com",
      role: "EMPLOYEE",
    };

    const token = signAccessToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const verified = verifyAccessToken(token);
    expect(verified.userId).toBe(payload.userId);
    expect(verified.email).toBe(payload.email);
    expect(verified.role).toBe(payload.role);
  });

  it("should throw error for invalid token", () => {
    expect(() => {
      verifyAccessToken("invalid-token");
    }).toThrow();
  });
});
