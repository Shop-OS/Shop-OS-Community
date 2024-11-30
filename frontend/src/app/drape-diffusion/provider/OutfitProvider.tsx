import { UploadFile } from 'antd';
import { createContext, useRef, useState } from 'react';

const OutfitContext = createContext<any>({});


const OutfitProvider = ({ children }: any) => {
    const generationIdRef = useRef<String>("");
    const [generationHistory, setGenerationHistory] = useState([]);
    const [currentHistory, setCurrentHistory] = useState<any>({});

    const [selectedBackgroundTemplate, setSelectedBackgroundTemplate] = useState(null);

    const [vtonOutputImages, setVtonOutputImages] = useState<any>({});
    const [previewImageSrc, setPreviewImageSrc] = useState<any>({});

    const [maskImage, setMaskImage] = useState<any>(null);
    const [maskImageFile, setMaskImageFile] = useState<any>(null);
    const [pinkMaskImage, setPinkMaskImage] = useState<any>(null);
    const [isMaskingModalOpen, setIsMaskingModalOpen] = useState(false);
    const [isMaskLoading, setIsMaskLoading] = useState(false);
    const [productMaskDescription, setProductMaskDescription] = useState<any>('');

    const value = {
        generationIdRef,
        generationHistory,
        setGenerationHistory,
        currentHistory,
        setCurrentHistory,
        selectedBackgroundTemplate,
        setSelectedBackgroundTemplate,
        vtonOutputImages,
        setVtonOutputImages,
        previewImageSrc,
        setPreviewImageSrc,
        maskImage,
        setMaskImage,
        isMaskingModalOpen,
        setIsMaskingModalOpen,
        pinkMaskImage,
        setPinkMaskImage,
        isMaskLoading,
        setIsMaskLoading,
        productMaskDescription,
        setProductMaskDescription,
        maskImageFile,
        setMaskImageFile
    };

    return (
        <OutfitContext.Provider value={value}>
            {children}
        </OutfitContext.Provider>
    )
}

export { OutfitProvider, OutfitContext };