import { beforeEach, expect, describe, it } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAppStore } from "../src/stores/app";
import { storeToRefs } from "pinia";

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("app test", () => {
  it("version update available", () => {
    const store = useAppStore();
    expect(store.version.isDownloading).toEqual(false);
    store.$patch({ version: { isDownloading: true } });
    expect(store.version.isDownloading).toEqual(true);
  });
  it("version donwload Progress", () => {
    const store = useAppStore();
    expect(store.version.downloadProgress).toEqual(null);
    let progress = {
      percent: 0,
    };
    store.$patch({
      version: {
        downloadProgress: progress,
      },
    });
    expect(store.version.downloadProgress).toEqual({
      percent: 0,
    });
    progress.percent = 1;
    store.$patch({
      version: {
        downloadProgress: progress,
      },
    });
    expect(store.version.downloadProgress).toEqual({
      percent: 1,
    });
  });
});
