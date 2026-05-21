const STORAGE_KEY = "weibo-lite-posts";

const form = document.querySelector("#postForm");
const textarea = document.querySelector("#postContent");
const charCount = document.querySelector("#charCount");
const postList = document.querySelector("#postList");
const emptyState = document.querySelector("#emptyState");
const postCount = document.querySelector("#postCount");
const clearBtn = document.querySelector("#clearBtn");

function loadPosts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function formatTime(isoString) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
}

function createPostElement(post) {
  const item = document.createElement("li");
  item.className = "post";

  const meta = document.createElement("div");
  meta.className = "postMeta";

  const author = document.createElement("div");
  author.className = "author";

  const avatar = document.createElement("span");
  avatar.className = "avatar";
  avatar.textContent = "我";

  const name = document.createElement("strong");
  name.textContent = "本地用户";

  const time = document.createElement("time");
  time.dateTime = post.createdAt;
  time.textContent = formatTime(post.createdAt);

  const content = document.createElement("p");
  content.className = "postContent";
  content.textContent = post.content;

  author.append(avatar, name);
  meta.append(author, time);
  item.append(meta, content);
  return item;
}

function render() {
  const posts = loadPosts();
  postList.innerHTML = "";
  postCount.textContent = String(posts.length);
  emptyState.classList.toggle("isVisible", posts.length === 0);

  posts.forEach((post) => {
    postList.append(createPostElement(post));
  });
}

function updateCharCount() {
  charCount.textContent = `${textarea.value.length}/140`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const content = textarea.value.trim();
  if (!content) {
    textarea.focus();
    return;
  }

  const posts = loadPosts();
  posts.unshift({
    id: crypto.randomUUID(),
    content,
    createdAt: new Date().toISOString(),
  });

  savePosts(posts);
  form.reset();
  updateCharCount();
  render();
});

textarea.addEventListener("input", updateCharCount);

clearBtn.addEventListener("click", () => {
  if (loadPosts().length === 0) {
    return;
  }

  if (confirm("确定要清空所有动态吗？")) {
    savePosts([]);
    render();
  }
});

updateCharCount();
render();
