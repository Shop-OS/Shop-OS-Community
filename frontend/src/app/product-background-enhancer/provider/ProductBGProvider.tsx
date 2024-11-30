import { createContext, useRef, useState } from 'react';

const ProductBGContext = createContext<any>({});

const ProductBGProvider = ({ children }: any) => {
    const [placementValue, setPlacementValue] = useState({});
    const [surroundingValue, setSurroundingValue] = useState({});
    const [backgroundValue, setBackgroundValue] = useState({});
    const [isProductDescriptionShow, setIsProductDescriptionShow] = useState(false);
    const [modalProductDescription, setModalProductDescription] = useState('');
    const generationIdRef = useRef<String>("");
    const [generationHistory, setGenerationHistory] = useState<any[]>([
    ]);
    const [currentHistory, setCurrentHistory] = useState<any>({});

    const [previewImageSrc, setPreviewImageSrc] = useState<any>({});


    const value = {
        placementValue,
        surroundingValue,
        backgroundValue,
        isProductDescriptionShow,
        modalProductDescription,
        generationIdRef,
        generationHistory,
        setGenerationHistory,
        currentHistory,
        setCurrentHistory,
        setPlacementValue,
        setSurroundingValue,
        setBackgroundValue,
        setIsProductDescriptionShow,
        setModalProductDescription,
        previewImageSrc,
        setPreviewImageSrc
    };
    return (
        <ProductBGContext.Provider value={value}>
            {children}
        </ProductBGContext.Provider>
    )
}

export { ProductBGProvider, ProductBGContext };