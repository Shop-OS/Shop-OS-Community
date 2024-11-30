import create from 'zustand';

const useImageStore = create((set) => ({
  backgroundImage: '',
  backgroundImage1: '',
  backgroundImage2: '',
  backgroundImage3: '',
  backgroundImage4: '',
  backgroundImage5: '',
  backgroundVideo: '',
  backgroundVideo1: '',
  backgroundVideo2: '',
  backgroundVideo3: '',
  backgroundVideo4: '',
  backgroundVideo5: '',
  backgrounds: [],
  taglines: [],
  copyText: '',
  logoFile: null,
  productFile: null,
  selectedLogo: null,
  selectedOption: 'Fully Animated',
  selectedProduct: null,
  loadingBackgroundImage: false,
  loadingCopyText: false,
  loadingBackgroundVideo: false,
  setLoadingBackgroundImage: (isLoading) => set((state) => ({ loadingBackgroundImage: isLoading })),
  setLoadingCopyText: (isLoading) => set((state) => ({ loadingCopyText: isLoading })),
  setLoadingBackgroundVideo: (isLoading) => set((state) => ({ loadingBackgroundVideo: isLoading })),
  setBackgroundImage: (newBackgroundImage) =>
    set((state) => ({ backgroundImage: newBackgroundImage })),
  setBackgroundImage1: (newBackgroundImage) =>
    set((state) => ({ backgroundImage1: newBackgroundImage })),
  setBackgroundImage2: (newBackgroundImage) =>
    set((state) => ({ backgroundImage2: newBackgroundImage })),
  setBackgroundImage3: (newBackgroundImage) =>
    set((state) => ({ backgroundImage3: newBackgroundImage })),
  setBackgroundImage4: (newBackgroundImage) =>
    set((state) => ({ backgroundImage4: newBackgroundImage })),
  setBackgroundImage5: (newBackgroundImage) =>
    set((state) => ({ backgroundImage5: newBackgroundImage })),
  setBackgrounds: (backgrounds) => set((state) => ({ backgrounds: backgrounds })),
  setBackgroundVideo: (newBackgroundVideo) =>
    set((state) => ({ backgroundVideo: newBackgroundVideo })),
  setBackgroundVideo1: (newBackgroundVideo) =>
    set((state) => ({ backgroundVideo1: newBackgroundVideo })),
  setBackgroundVideo2: (newBackgroundVideo) =>
    set((state) => ({ backgroundVideo2: newBackgroundVideo })),
  setBackgroundVideo3: (newBackgroundVideo) =>
    set((state) => ({ backgroundVideo3: newBackgroundVideo })),
  setBackgroundVideo4: (newBackgroundVideo) =>
    set((state) => ({ backgroundVideo4: newBackgroundVideo })),
  setBackgroundVideo5: (newBackgroundVideo) =>
    set((state) => ({ backgroundVideo5: newBackgroundVideo })),
  setBackgrounds: (backgrounds) => set((state) => ({ backgrounds: backgrounds })),
  setCopyText: (text) => set((state) => ({ copyText: text })),
  setTaglines: (taglines) => set((state) => ({ taglines: taglines })),
  setLogoFile: (file) => set((state) => ({ logoFile: file })),
  setProductFile: (file) => set((state) => ({ productFile: file })),
  setSelectedLogo: (logo) => set((state) => ({ selectedLogo: logo })),
  setSelectedOption: (option) => set((state) => ({ selectedOption: option })),
  setSelectedProduct: (product) => set((state) => ({ selectedProduct: product })),
  setTemplate: (newTemplate) => set((state) => ({ template: newTemplate })),
  setText: (newText) => set((state) => ({ text: newText })),
  setVideoUrl: (url) => set((state) => ({ videoUrl: url })),
  template: 5,
  text: 'Apple iPhone 15 Pro',
  videoUrl: '',
}));

export default useImageStore;
