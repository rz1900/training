import { afterEach, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";

beforeEach(() => {
  localStorage.clear();
  setActivePinia(createPinia());
});

afterEach(() => {
  vi.restoreAllMocks();
});
