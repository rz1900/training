import { afterEach, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
  setActivePinia(createPinia());
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
