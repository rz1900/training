import { Hono } from "hono";

const app = new Hono();

let posts = [];

function createPost(content) {
  return {
    id: crypto.randomUUID(),
    content,
    createdAt: new Date().toISOString(),
  };
}

app.get("/api/posts", (c) => {
  return c.json(posts);
});

app.post("/api/posts", async (c) => {
  let body;

  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Content is required" }, 400);
  }

  const content = typeof body?.content === "string" ? body.content.trim() : "";

  if (!content) {
    return c.json({ error: "Content is required" }, 400);
  }

  const post = createPost(content);
  posts = [post, ...posts];

  return c.json(post, 201);
});

app.delete("/api/posts", (c) => {
  posts = [];
  return c.body(null, 204);
});

export default app;
