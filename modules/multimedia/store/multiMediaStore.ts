import { defineStore } from "pinia";

export const useMultiMediaStore = defineStore("multimedia", () => {
  const group = ref(null);

  async function startDownload(id: number) {
    return true;
  }

  return { group, startDownload };
});
