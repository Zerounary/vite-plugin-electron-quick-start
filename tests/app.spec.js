
import { beforeEach, expect, describe, it } from "vitest"
import { setActivePinia, createPinia } from 'pinia';
import { useAppStore } from '../src/stores/app';
import { storeToRefs } from "pinia";

beforeEach(() => {
  setActivePinia(createPinia());
})

describe("app test" , () => {
  it("version update available", () => {
    const store = useAppStore();
    expect(store.version.isDownloading).toEqual(false)
    store.$patch({version: {isDownloading: true}});
    expect(store.version.isDownloading).toEqual(true)
  })
})
