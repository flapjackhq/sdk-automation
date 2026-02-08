import { describe, expect, it } from "vitest";
import { flapjackSearch } from "../builds/node";

describe("flapjack-search", () => {
  it("exports flapjackSearch function", () => {
    expect(typeof flapjackSearch).toBe("function");
  });

  it("throws when appId is missing", () => {
    expect(() => flapjackSearch("", "key")).toThrow("`appId` is missing.");
  });

  it("throws when apiKey is missing", () => {
    expect(() => flapjackSearch("appId", "")).toThrow("`apiKey` is missing.");
  });

  it("creates a client with search methods", () => {
    const client = flapjackSearch("test-app-id", "test-api-key");
    expect(client).toBeDefined();
    expect(typeof client.search).toBe("function");
    expect(typeof client._ua).toBe("string");
  });
});
