import { beforeEach, expect, describe, it } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useDateStore } from "../src/stores/date";
import { storeToRefs } from "pinia";
import moment from "moment"

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("app test", () => {
  it("从周一开始", () => {
    const store = useDateStore();
    expect(store.getDateRange).toEqual({
      datebeg: moment().format("YYYYMMDD"),
      dateend: moment().format("YYYYMMDD"),
    });
    store.$patch({ tag: 'week' });
    expect(store.getDateRange).toEqual({
      datebeg: moment().startOf('week').format("YYYYMMDD"),
      dateend: moment().format("YYYYMMDD"),
    });
    store.$patch({ tag: 'month' });
    expect(store.getDateRange).toEqual({
      datebeg: moment().format("YYYYMM")  + '01',
      dateend: moment().format("YYYYMMDD"),
    });
  });
});
