import { describe, expect, it } from "vitest";
import { usePostsStore } from "../src/stores/posts";

const existingPost = {
  id: "post-1",
  content: "Existing post",
  createdAt: "2026-05-21T01:00:00.000Z",
};

function mockJsonResponse(body, init = {}) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { "Content-Type": "application/json" },
      ...init,
    }),
  );
}

describe("posts store", () => {
  it("fetches posts from the API", async () => {
    fetch.mockResolvedValueOnce(await mockJsonResponse([existingPost]));
    const store = usePostsStore();

    await store.fetchPosts();

    expect(fetch).toHaveBeenCalledWith("/api/posts");
    expect(store.posts).toEqual([existingPost]);
    expect(store.count).toBe(1);
  });

  it("adds trimmed posts through the API and prepends the created post", async () => {
    const createdPost = {
      id: "post-2",
      content: "First API post",
      createdAt: "2026-05-21T02:00:00.000Z",
    };
    fetch.mockResolvedValueOnce(await mockJsonResponse(createdPost));
    const store = usePostsStore();

    const post = await store.addPost("  First API post  ");

    expect(fetch).toHaveBeenCalledWith("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "First API post" }),
    });
    expect(post).toEqual(createdPost);
    expect(store.posts[0]).toEqual(createdPost);
    expect(store.count).toBe(1);
  });

  it("does not call the API for blank posts", async () => {
    const store = usePostsStore();

    const post = await store.addPost("   ");

    expect(post).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
    expect(store.count).toBe(0);
  });

  it("clears posts through the API", async () => {
    fetch
      .mockResolvedValueOnce(await mockJsonResponse([existingPost]))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    const store = usePostsStore();
    await store.fetchPosts();

    await store.clearPosts();

    expect(fetch).toHaveBeenLastCalledWith("/api/posts", { method: "DELETE" });
    expect(store.posts).toEqual([]);
    expect(store.count).toBe(0);
  });

  it("records API errors without throwing into the UI", async () => {
    fetch.mockResolvedValueOnce(new Response(null, { status: 500 }));
    const store = usePostsStore();

    const posts = await store.fetchPosts();

    expect(posts).toEqual([]);
    expect(store.error.message).toBe("Request failed with status 500");
  });
});
