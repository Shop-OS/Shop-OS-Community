import { create } from "zustand";

interface ProductBGAdvancedStore {
  productDescription: string;
  setProductDescription: (productDescription: string) => void;

  placement: Map<string, string>;
  setPlacement: (placement: Map<string, string>) => void;

  background: Map<string, string>;
  setBackground: (background: Map<string, string>) => void;

  surrounding: Map<string, string>;
  setSurrounding: (surrounding: Map<string, string>) => void;

  referenceImageFile: File | null;
  setReferenceImageFile: (referenceImage: File | null) => void;

  renderStrength: number;
  setRenderStrength: (renderStrength: number) => void;
}

export const useProductBGSimpleStore = create<ProductBGAdvancedStore>((set) => ({
  background: new Map<string, string>(),
  setBackground: (background) => set({ background }),

  placement: new Map<string, string>(),
  setPlacement: (placement) => set({ placement }),

  surrounding: new Map<string, string>(),
  setSurrounding: (surrounding) => set({ surrounding }),

  productDescription: '',
  setProductDescription: (productDescription) => set({ productDescription }),

  referenceImageFile: null,
  setReferenceImageFile: (referenceImageFile) => set({ referenceImageFile }),

  renderStrength: 0.8,
  setRenderStrength: (renderStrength) => set({ renderStrength }),
}));