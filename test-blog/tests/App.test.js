import { flushPromises, mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { describe, expect, it, vi } from "vitest";
import App from "../src/App.vue";

const initialPost = {
  id: "post-1",
  content: "Loaded from API",
  createdAt: "2026-05-21T01:00:00.000Z",
};

const createdPost = {
  id: "post-2",
  content: "Vue 3 + Pinia API release",
  createdAt: "2026-05-21T02:00:00.000Z",
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

function mountApp() {
  return mount(App, {
    global: {
      plugins: [createPinia()],
    },
  });
}

describe("App", () => {
  it("loads posts from the API on mount", async () => {
    fetch.mockResolvedValueOnce(await mockJsonResponse([initialPost]));

    const wrapper = mountApp();
    await flushPromises();

    expect(fetch).toHaveBeenCalledWith("/api/posts");
    expect(wrapper.text()).toContain("Loaded from API");
    expect(wrapper.get(".counter span").text()).toBe("1");
  });

  it("publishes a post and renders it in the feed", async () => {
    fetch
      .mockResolvedValueOnce(await mockJsonResponse([]))
      .mockResolvedValueOnce(await mockJsonResponse(createdPost));
    const wrapper = mountApp();
    await flushPromises();

    await wrapper.get("textarea").setValue("Vue 3 + Pinia API release");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(fetch).toHaveBeenLastCalledWith("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "Vue 3 + Pinia API release" }),
    });
    expect(wrapper.text()).toContain("Vue 3 + Pinia API release");
    expect(wrapper.get("textarea").element.value).toBe("");
    expect(wrapper.get(".counter span").text()).toBe("1");
  });

  it("clears all posts after confirmation", async () => {
    fetch
      .mockResolvedValueOnce(await mockJsonResponse([initialPost]))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const wrapper = mountApp();
    await flushPromises();

    await wrapper.get(".ghostBtn").trigger("click");
    await flushPromises();

    expect(fetch).toHaveBeenLastCalledWith("/api/posts", { method: "DELETE" });
    expect(wrapper.find(".postList").exists()).toBe(false);
    expect(wrapper.find(".emptyState").exists()).toBe(true);
    expect(wrapper.text()).not.toContain("Loaded from API");
  });
});
