import { create } from "zustand";

interface ProductBGSimpleStore {
  image: string | null;
  setImage: (image: string | null) => void;

  imageFile: File | null;
  setImageFile: (imageFile: File | null) => void;

  imageHeight: number;
  setImageHeight: (imageHeight: number) => void;

  maskImage: string|null;
  setMaskImage: (maskImage: string|null) => void;

  maskImageFile: File | null;
  setMaskImageFile: (maskImageFile: File | null) => void;

  canvasImageFile: File | null;
  setCanvasImageFile: (canvasImageFile: File | null) => void;

  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;

  isBgRemoveLoading: boolean;
  setIsBgRemoveLoading: (isBgRemoveLoading: boolean) => void;

  shouldFetch: boolean;
  setShouldFetch: (shouldFetch: boolean) => void;

  timeSpent: number;
  setTimeSpent: (timeSpent: number) => void;

  prompt: string;
  setPrompt: (prompt: string) => void;

  modelLora: string;
  setModelLora: (modelLora: string) => void;

  fetchCount: number;
  setFetchCount: (fetchCount: number) => void;

  outputImages: string[];
  addOutputImage: (outputImage: string) => void;
  removeOutputImage: (outputImage: string) => void;
  updateOutputImages: (outputImages: string[]) => void;

  bgReferenceImageFile: File | null;
  setBgReferenceImageFile: (bgReferenceImageFile: File | null) => void;

  productPrompt: string;
  setProductPrompt: (productPrompt: string) => void;
}

export const useProductBGStore = create<ProductBGSimpleStore>((set) => ({
  image: null,
  setImage: (image) => set({ image }),

  imageFile: null,
  setImageFile: (imageFile) => set({ imageFile }),

  imageHeight: 0,
  setImageHeight: (imageHeight) => set({ imageHeight }),

  maskImage: null,
  setMaskImage: (maskImage) => set({ maskImage }),

  maskImageFile: null,
  setMaskImageFile: (maskImageFile) => set({ maskImageFile }),

  canvasImageFile: null,
  setCanvasImageFile: (canvasImageFile) => set({ canvasImageFile }),

  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),

  isBgRemoveLoading: false,
  setIsBgRemoveLoading: (isBgRemoveLoading) => set({ isBgRemoveLoading }),

  shouldFetch: false,
  setShouldFetch: (shouldFetch) => set({ shouldFetch }),

  timeSpent: 0,
  setTimeSpent: (timeSpent) => set({ timeSpent }),

  prompt: '',
  setPrompt: (prompt) => set({ prompt }),

  modelLora: '',
  setModelLora: (modelLora) => set({ modelLora }),

  fetchCount: 1,
  setFetchCount: (fetchCount) => set({ fetchCount }),

  outputImages: [],
  addOutputImage: (outputImage) => set((state) => ({ outputImages: [...state.outputImages, outputImage] })),

  removeOutputImage: (outputImage) => set((state) => ({ outputImages: state.outputImages.filter((image) => image !== outputImage) })),
  updateOutputImages: (outputImages) => set({ outputImages }),

  bgReferenceImageFile: null,
  setBgReferenceImageFile: (bgReferenceImageFile) => set({ bgReferenceImageFile }),

  productPrompt: '',
  setProductPrompt: (productPrompt) => set({ productPrompt }),
}));