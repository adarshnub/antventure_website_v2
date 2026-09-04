import { describe, expect, it } from "vitest";
import { contactRequestSchema } from "./contact";

describe("contact request contract", () => {
  it("accepts the existing public payload", () => {
    expect(contactRequestSchema.safeParse({ name: "Ada Lovelace", email: "ada@example.com", mobile: "+971500000000", website: "", message: "A complete workflow enquiry." }).success).toBe(true);
  });

  it("rejects invalid email and honeypot submissions", () => {
    expect(contactRequestSchema.safeParse({ name: "Ada", email: "invalid", mobile: "123456", website: "", message: "A complete workflow enquiry." }).success).toBe(false);
    expect(contactRequestSchema.safeParse({ name: "Ada", email: "ada@example.com", mobile: "123456", website: "bot.example", message: "A complete workflow enquiry." }).success).toBe(false);
  });
});
