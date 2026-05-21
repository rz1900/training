const POSTS_ENDPOINT = "/api/posts";

async function requestJson(url, options) {
  const response = options ? await fetch(url, options) : await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function normalizePosts(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.posts)) {
    return data.posts;
  }

  return [];
}

function normalizePost(data) {
  return data?.post ?? data;
}

export async function fetchPosts() {
  return normalizePosts(await requestJson(POSTS_ENDPOINT));
}

export async function createPost(content) {
  return normalizePost(
    await requestJson(POSTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    }),
  );
}

export async function deletePosts() {
  await requestJson(POSTS_ENDPOINT, { method: "DELETE" });
}
