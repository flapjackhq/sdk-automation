/**
 * E2E tests for flapjack-search SDK against a live Flapjack server.
 *
 * Requires: Flapjack server running on localhost:7700
 * Run: npx vitest --run __tests__/flapjack-search.e2e.test.ts
 *
 * Conventions:
 *  - Never sleep — always poll for expected state
 *  - Each describe block uses its own index (timestamp-based) for isolation
 *  - Clean up indices after tests
 */
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { flapjackSearch } from "../builds/node";
import type { EndRequest, Response } from "@flapjack-search/client-common";

const SERVER = process.env.FLAPJACK_SERVER || "localhost:7700";
const API_KEY = process.env.FLAPJACK_ADMIN_KEY || "abcdef0123456789";
const APP_ID = process.env.FLAPJACK_APP_ID || "test-app";

/** Requester that routes all traffic to the local Flapjack server over HTTP. */
function localRequester() {
  return {
    async send(request: EndRequest): Promise<Response> {
      const url = new URL(request.url);
      url.protocol = "http:";
      url.host = SERVER;

      const res = await fetch(url.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.data,
      });

      return {
        status: res.status,
        content: await res.text(),
        isTimedOut: false,
      };
    },
  };
}

function createClient() {
  return flapjackSearch(APP_ID, API_KEY, {
    requester: localRequester(),
  });
}

/** Poll until the index has at least `count` hits (max 5 s). */
async function waitForHits(
  client: ReturnType<typeof createClient>,
  indexName: string,
  count: number,
  timeoutMs = 5000,
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await client.search({
      requests: [{ indexName, query: "", hitsPerPage: 0 }],
    });
    const r = (res.results as any[])[0];
    if (r && r.nbHits >= count) return;
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error(
    `Timed out waiting for ${count} hits in "${indexName}" after ${timeoutMs}ms`,
  );
}

/** Poll until the index has exactly 0 hits (max 5 s). */
async function waitForEmpty(
  client: ReturnType<typeof createClient>,
  indexName: string,
  timeoutMs = 5000,
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await client.search({
        requests: [{ indexName, query: "", hitsPerPage: 0 }],
      });
      const r = (res.results as any[])[0];
      if (r && r.nbHits === 0) return;
    } catch {
      // index may not exist yet — that counts as empty
      return;
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error(
    `Timed out waiting for empty index "${indexName}" after ${timeoutMs}ms`,
  );
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe("flapjack-search E2E (live server)", () => {
  const client = createClient();
  const INDEX = `e2e_test_${Date.now()}`;

  // Pre-flight: make sure the server is reachable
  beforeAll(async () => {
    const res = await fetch(`http://${SERVER}/health`);
    expect(res.ok).toBe(true);
  });

  // Clean up
  afterAll(async () => {
    try {
      await client.deleteIndex({ indexName: INDEX });
    } catch {
      // ignore — index may already be gone
    }
  });

  // ----- Settings -----

  it("sets and retrieves index settings", async () => {
    await client.setSettings({
      indexName: INDEX,
      indexSettings: {
        searchableAttributes: ["name", "description"],
        attributesForFaceting: ["category", "brand"],
      },
    });

    const settings = await client.getSettings({ indexName: INDEX });
    expect(settings.searchableAttributes).toEqual(["name", "description"]);
    expect(settings.attributesForFaceting).toEqual(["category", "brand"]);
  });

  // ----- Document ingestion -----

  it("saves objects via batch and indexes them", async () => {
    const objects = [
      {
        objectID: "1",
        name: "Gaming Laptop",
        description: "High-performance gaming machine",
        category: "electronics",
        brand: "Dell",
        price: 999,
      },
      {
        objectID: "2",
        name: "Office Laptop",
        description: "Business-class notebook",
        category: "electronics",
        brand: "HP",
        price: 599,
      },
      {
        objectID: "3",
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse",
        category: "accessories",
        brand: "Logitech",
        price: 49,
      },
      {
        objectID: "4",
        name: "Mechanical Keyboard",
        description: "Cherry MX switches keyboard",
        category: "accessories",
        brand: "Corsair",
        price: 129,
      },
      {
        objectID: "5",
        name: "USB-C Hub",
        description: "Multi-port USB hub adapter",
        category: "accessories",
        brand: "Anker",
        price: 35,
      },
    ];

    const result = await client.saveObjects({ indexName: INDEX, objects });
    expect(result).toBeDefined();

    // Poll until all 5 docs are indexed
    await waitForHits(client, INDEX, 5);
  });

  // ----- Text search -----

  it("searches for 'laptop' and gets 2 hits", async () => {
    const res = await client.search({
      requests: [{ indexName: INDEX, query: "laptop" }],
    });
    const hits = (res.results as any[])[0];
    expect(hits.nbHits).toBe(2);
    const names = hits.hits.map((h: any) => h.name).sort();
    expect(names).toEqual(["Gaming Laptop", "Office Laptop"]);
  });

  it("searches for 'mouse' and gets 1 hit", async () => {
    const res = await client.search({
      requests: [{ indexName: INDEX, query: "mouse" }],
    });
    const hits = (res.results as any[])[0];
    expect(hits.nbHits).toBe(1);
    expect(hits.hits[0].name).toBe("Wireless Mouse");
  });

  it("empty query returns all documents", async () => {
    const res = await client.search({
      requests: [{ indexName: INDEX, query: "" }],
    });
    const hits = (res.results as any[])[0];
    expect(hits.nbHits).toBe(5);
  });

  // ----- Filters -----

  it("applies numeric filter (price >= 500)", async () => {
    const res = await client.search({
      requests: [
        { indexName: INDEX, query: "", filters: "price >= 500" },
      ],
    });
    const hits = (res.results as any[])[0];
    expect(hits.nbHits).toBe(2);
    for (const hit of hits.hits) {
      expect(hit.price).toBeGreaterThanOrEqual(500);
    }
  });

  it("applies facet filter (category:accessories)", async () => {
    const res = await client.search({
      requests: [
        { indexName: INDEX, query: "", filters: "category:accessories" },
      ],
    });
    const hits = (res.results as any[])[0];
    expect(hits.nbHits).toBe(3);
  });

  it("applies combined text + filter query", async () => {
    const res = await client.search({
      requests: [
        {
          indexName: INDEX,
          query: "laptop",
          filters: "price >= 800",
        },
      ],
    });
    const hits = (res.results as any[])[0];
    expect(hits.nbHits).toBe(1);
    expect(hits.hits[0].name).toBe("Gaming Laptop");
  });

  // ----- Facets -----

  it("returns facet counts", async () => {
    const res = await client.search({
      requests: [
        { indexName: INDEX, query: "", facets: ["category", "brand"] },
      ],
    });
    const hits = (res.results as any[])[0];
    expect(hits.facets).toBeDefined();
    expect(hits.facets.category).toBeDefined();
    expect(hits.facets.category.electronics).toBe(2);
    expect(hits.facets.category.accessories).toBe(3);
    expect(hits.facets.brand).toBeDefined();
  });

  // ----- Pagination -----

  it("paginates results with hitsPerPage and page", async () => {
    const page0 = await client.search({
      requests: [
        { indexName: INDEX, query: "", hitsPerPage: 2, page: 0 },
      ],
    });
    const r0 = (page0.results as any[])[0];
    expect(r0.hits.length).toBe(2);
    expect(r0.nbPages).toBeGreaterThanOrEqual(3);

    const page1 = await client.search({
      requests: [
        { indexName: INDEX, query: "", hitsPerPage: 2, page: 1 },
      ],
    });
    const r1 = (page1.results as any[])[0];
    expect(r1.hits.length).toBe(2);

    // Pages should have different results
    const ids0 = r0.hits.map((h: any) => h.objectID).sort();
    const ids1 = r1.hits.map((h: any) => h.objectID).sort();
    expect(ids0).not.toEqual(ids1);
  });

  // ----- GetObject -----

  it("retrieves a single object by ID", async () => {
    const obj = await client.getObject({
      indexName: INDEX,
      objectID: "1",
    });
    expect((obj as any).name).toBe("Gaming Laptop");
    expect((obj as any).objectID).toBe("1");
  });

  // ----- Highlighting -----

  it("returns highlight results for matching query", async () => {
    const res = await client.search({
      requests: [{ indexName: INDEX, query: "laptop" }],
    });
    const hits = (res.results as any[])[0];
    expect(hits.hits.length).toBeGreaterThan(0);
    const hit = hits.hits[0];
    expect(hit._highlightResult).toBeDefined();
  });

  // ----- Synonyms -----

  it("saves and searches synonyms", async () => {
    await client.saveSynonym({
      indexName: INDEX,
      objectID: "syn1",
      synonymHit: {
        objectID: "syn1",
        type: "synonym",
        synonyms: ["laptop", "notebook", "computer"],
      },
    });

    const synResult = await client.searchSynonyms({ indexName: INDEX });
    expect((synResult as any).nbHits).toBeGreaterThanOrEqual(1);
  });

  // ----- Rules -----

  it("saves and searches rules", async () => {
    await client.saveRule({
      indexName: INDEX,
      objectID: "rule1",
      rule: {
        objectID: "rule1",
        conditions: [{ anchoring: "is", pattern: "cheap" }],
        consequence: { params: { filters: "price < 100" } },
      },
    });

    const ruleResult = await client.searchRules({ indexName: INDEX });
    expect((ruleResult as any).nbHits).toBeGreaterThanOrEqual(1);
  });

  // ----- ListIndices -----

  it("lists indices including the test index", async () => {
    const indices = await client.listIndices();
    const names = (indices.items || []).map((i: any) => i.name);
    expect(names).toContain(INDEX);
  });

  // ----- Multi-index search -----

  it("searches multiple indices in a single call", async () => {
    const res = await client.search({
      requests: [
        { indexName: INDEX, query: "laptop" },
        { indexName: INDEX, query: "mouse" },
      ],
    });
    expect((res.results as any[]).length).toBe(2);
    expect((res.results as any[])[0].nbHits).toBe(2);
    expect((res.results as any[])[1].nbHits).toBe(1);
  });

  // ----- Partial update -----

  it("partially updates an object", async () => {
    await client.partialUpdateObject({
      indexName: INDEX,
      objectID: "1",
      attributesToUpdate: { price: 1099, description: "Updated gaming machine" },
    });

    // Poll until the update is visible
    const start = Date.now();
    while (Date.now() - start < 5000) {
      const obj = await client.getObject({
        indexName: INDEX,
        objectID: "1",
      });
      if ((obj as any).price === 1099) break;
      await new Promise((r) => setTimeout(r, 50));
    }

    const obj = await client.getObject({
      indexName: INDEX,
      objectID: "1",
    });
    expect((obj as any).price).toBe(1099);
    expect((obj as any).description).toBe("Updated gaming machine");
    expect((obj as any).name).toBe("Gaming Laptop"); // unchanged field preserved
  });

  // ----- attributesToRetrieve -----

  it("limits returned fields with attributesToRetrieve", async () => {
    const res = await client.search({
      requests: [
        {
          indexName: INDEX,
          query: "laptop",
          attributesToRetrieve: ["name", "price"],
        },
      ],
    });
    const hit = (res.results as any[])[0].hits[0];
    expect(hit.name).toBeDefined();
    expect(hit.price).toBeDefined();
    // objectID is always included by Algolia convention
    expect(hit.objectID).toBeDefined();
  });

  // ----- Delete object -----

  it("deletes a single object", async () => {
    await client.deleteObject({ indexName: INDEX, objectID: "5" });

    // Poll until we have 4 hits
    const start = Date.now();
    while (Date.now() - start < 5000) {
      const res = await client.search({
        requests: [{ indexName: INDEX, query: "", hitsPerPage: 0 }],
      });
      if ((res.results as any[])[0].nbHits === 4) break;
      await new Promise((r) => setTimeout(r, 50));
    }

    const res = await client.search({
      requests: [{ indexName: INDEX, query: "" }],
    });
    expect((res.results as any[])[0].nbHits).toBe(4);
  });

  // ----- Delete index -----

  it("deletes the test index", async () => {
    await client.deleteIndex({ indexName: INDEX });

    // Verify the index is gone from listIndices
    const start = Date.now();
    while (Date.now() - start < 5000) {
      const indices = await client.listIndices();
      const names = (indices.items || []).map((i: any) => i.name);
      if (!names.includes(INDEX)) return;
      await new Promise((r) => setTimeout(r, 50));
    }
    // If we get here, check one more time
    const indices = await client.listIndices();
    const names = (indices.items || []).map((i: any) => i.name);
    expect(names).not.toContain(INDEX);
  });
});