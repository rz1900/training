<script setup>
import { computed, ref } from "vue";
import { usePostsStore } from "./stores/posts";

const maxLength = 140;
const draft = ref("");
const postsStore = usePostsStore();

const charCount = computed(() => draft.value.length);

function publish() {
  const post = postsStore.addPost(draft.value);
  if (post) {
    draft.value = "";
  }
}

function clearAll() {
  if (postsStore.count === 0) {
    return;
  }

  if (window.confirm("确定要清空所有动态吗？")) {
    postsStore.clearPosts();
  }
}

function formatTime(isoString) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
}
</script>

<template>
  <header class="topbar">
    <div class="brand">测试博客</div>
    <div class="counter"><span>{{ postsStore.count }}</span> 条动态</div>
  </header>

  <main class="shell">
    <section class="composer" aria-labelledby="composerTitle">
      <h1 id="composerTitle">发布动态</h1>
      <form @submit.prevent="publish">
        <label for="postContent">内容</label>
        <textarea
          id="postContent"
          v-model="draft"
          :maxlength="maxLength"
          rows="5"
          placeholder="分享一点新鲜事..."
          required
        ></textarea>
        <div class="composerActions">
          <span>{{ charCount }}/{{ maxLength }}</span>
          <button type="submit">发布</button>
        </div>
      </form>
    </section>

    <section class="feed" aria-labelledby="feedTitle">
      <div class="feedHeader">
        <h2 id="feedTitle">全部动态</h2>
        <button class="ghostBtn" type="button" @click="clearAll">清空</button>
      </div>

      <div v-if="postsStore.count === 0" class="emptyState">
        还没有动态，先发布第一条吧。
      </div>

      <ul v-else class="postList">
        <li v-for="post in postsStore.posts" :key="post.id" class="post">
          <div class="postMeta">
            <div class="author">
              <span class="avatar">我</span>
              <strong>本地用户</strong>
            </div>
            <time :datetime="post.createdAt">{{ formatTime(post.createdAt) }}</time>
          </div>
          <p class="postContent">{{ post.content }}</p>
        </li>
      </ul>
    </section>
  </main>
</template>
