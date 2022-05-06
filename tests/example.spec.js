import { beforeEach, expect, describe, it } from "vitest"
import { setActivePinia, createPinia } from 'pinia';
import { useCounterStore } from '../src/stores/app';

beforeEach(() => {
  setActivePinia(createPinia());
})

describe("smoke test" , () => {
  it("should be able to add", () => {
    expect(1 + 1).toEqual(2)
  })
  it("pinia count test", () => {
    const store = useCounterStore();
    expect(store.count).toEqual(0)
    store.increment();
    expect(store.count).toEqual(1)
  })
})
