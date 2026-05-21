import { defineStore } from "pinia";
import {
  createPost,
  deletePosts,
  fetchPosts as fetchPostsFromApi,
} from "../api/posts";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    posts: [],
    isLoading: false,
    isSaving: false,
    error: null,
  }),
  getters: {
    count: (state) => state.posts.length,
  },
  actions: {
    async fetchPosts() {
      this.isLoading = true;
      this.error = null;

      try {
        const posts = await fetchPostsFromApi();
        this.posts = posts;
        return posts;
      } catch (error) {
        this.error = error;
        return [];
      } finally {
        this.isLoading = false;
      }
    },
    async addPost(rawContent) {
      const content = rawContent.trim();
      if (!content) {
        return null;
      }

      this.isSaving = true;
      this.error = null;

      try {
        const post = await createPost(content);
        this.posts.unshift(post);
        return post;
      } catch (error) {
        this.error = error;
        return null;
      } finally {
        this.isSaving = false;
      }
    },
    async clearPosts() {
      this.error = null;

      try {
        await deletePosts();
        this.posts = [];
      } catch (error) {
        this.error = error;
      }
    },
  },
});
