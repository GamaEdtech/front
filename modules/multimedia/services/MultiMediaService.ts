import { useMultiMediaStore } from "@/modules/multimedia/store/multiMediaStore";

export const MultiMediaService = () => {
  const multiMediaStore = useMultiMediaStore();

  async function startDownload(id: number) {
    return true;
  }

  return {
    startDownload,
  };
};
