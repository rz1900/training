import { defineStore } from "pinia";

export const STORAGE_KEY = "test-blog-posts";

function readStoredPosts() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    const posts = value ? JSON.parse(value) : [];
    return Array.isArray(posts) ? posts : [];
  } catch {
    return [];
  }
}

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const usePostsStore = defineStore("posts", {
  state: () => ({
    posts: readStoredPosts(),
  }),
  getters: {
    count: (state) => state.posts.length,
  },
  actions: {
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.posts));
    },
    addPost(rawContent) {
      const content = rawContent.trim();
      if (!content) {
        return null;
      }

      const post = {
        id: createId(),
        content,
        createdAt: new Date().toISOString(),
      };

      this.posts.unshift(post);
      this.persist();
      return post;
    },
    clearPosts() {
      this.posts = [];
      this.persist();
    },
  },
});
