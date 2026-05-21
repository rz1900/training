import { describe, expect, it } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { STORAGE_KEY, usePostsStore } from "../src/stores/posts";

describe("posts store", () => {
  it("loads existing posts from localStorage", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: "post-1",
          content: "已有内容",
          createdAt: "2026-05-21T01:00:00.000Z",
        },
      ]),
    );
    setActivePinia(createPinia());

    const store = usePostsStore();

    expect(store.posts).toHaveLength(1);
    expect(store.posts[0].content).toBe("已有内容");
  });

  it("adds trimmed posts to the beginning and persists them", () => {
    const store = usePostsStore();

    const post = store.addPost("  第一条测试博客  ");

    expect(post?.content).toBe("第一条测试博客");
    expect(store.count).toBe(1);
    expect(store.posts[0].content).toBe("第一条测试博客");
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toHaveLength(1);
  });

  it("does not add blank posts", () => {
    const store = usePostsStore();

    const post = store.addPost("   ");

    expect(post).toBeNull();
    expect(store.count).toBe(0);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("clears posts and persists an empty list", () => {
    const store = usePostsStore();
    store.addPost("待清空内容");

    store.clearPosts();

    expect(store.count).toBe(0);
    expect(localStorage.getItem(STORAGE_KEY)).toBe("[]");
  });
});
