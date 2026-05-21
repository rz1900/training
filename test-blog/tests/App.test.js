import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { describe, expect, it, vi } from "vitest";
import App from "../src/App.vue";
import { STORAGE_KEY } from "../src/stores/posts";

function mountApp() {
  return mount(App, {
    global: {
      plugins: [createPinia()],
    },
  });
}

describe("App", () => {
  it("publishes a post and renders it in the feed", async () => {
    const wrapper = mountApp();

    await wrapper.get("textarea").setValue("Vue 3 + Pinia 版本上线");
    await wrapper.get("form").trigger("submit");

    expect(wrapper.text()).toContain("Vue 3 + Pinia 版本上线");
    expect(wrapper.text()).toContain("1 条动态");
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))[0].content).toBe(
      "Vue 3 + Pinia 版本上线",
    );
  });

  it("clears all posts after confirmation", async () => {
    const wrapper = mountApp();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    await wrapper.get("textarea").setValue("准备清空");
    await wrapper.get("form").trigger("submit");
    await wrapper.get(".ghostBtn").trigger("click");

    expect(wrapper.text()).toContain("还没有动态，先发布第一条吧。");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("[]");
  });
});
