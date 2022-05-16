import { beforeEach, expect, describe, it } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useDateStore } from "../src/stores/date";
import { storeToRefs } from "pinia";

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("app test", () => {
  it("从周一开始", () => {
    const store = useDateStore();
    expect(store.getDateRange).toEqual({
      datebeg: "20220516",
      dateend: "20220516"
    });
    store.$patch({ tag: 'week' });
    expect(store.getDateRange).toEqual({
      datebeg: "20220516",
      dateend: "20220516"
    });
    store.$patch({ tag: 'month' });
    expect(store.getDateRange).toEqual({
      datebeg: "20220501",
      dateend: "20220516"
    });
  });
});
