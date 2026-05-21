import { beforeEach, describe, expect, it } from "vitest";
import app from "../../server/app.js";

async function json(res) {
  return res.json();
}

describe("posts API", () => {
  beforeEach(async () => {
    await app.request("/api/posts", { method: "DELETE" });
  });

  it("returns posts", async () => {
    const res = await app.request("/api/posts");

    expect(res.status).toBe(200);
    expect(await json(res)).toEqual([]);
  });

  it("creates a trimmed post at the beginning of the list", async () => {
    const first = await app.request("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: " first post " }),
    });
    const second = await app.request("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: " second post " }),
    });

    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(await json(second)).toMatchObject({ content: "second post" });

    const list = await app.request("/api/posts");
    const posts = await json(list);

    expect(posts).toHaveLength(2);
    expect(posts[0]).toMatchObject({ content: "second post" });
    expect(posts[1]).toMatchObject({ content: "first post" });
    expect(posts[0].id).toEqual(expect.any(String));
    expect(posts[0].createdAt).toEqual(expect.any(String));
  });

  it("rejects blank post content", async () => {
    const res = await app.request("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "   " }),
    });

    expect(res.status).toBe(400);
    expect(await json(res)).toEqual({ error: "Content is required" });

    const list = await app.request("/api/posts");
    expect(await json(list)).toEqual([]);
  });

  it("clears posts", async () => {
    await app.request("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "temporary post" }),
    });

    const res = await app.request("/api/posts", { method: "DELETE" });

    expect(res.status).toBe(204);

    const list = await app.request("/api/posts");
    expect(await json(list)).toEqual([]);
  });
});
