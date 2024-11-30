import { UploadFile } from 'antd';
import { createContext, useRef, useState } from 'react';

const BackgroundChangerContext = createContext<any>({});


const BackgroundChangerProvider = ({ children }: any) => {
    const generationIdRef = useRef<String>("");
    const [generationHistory, setGenerationHistory] = useState([]);
    const [currentHistory, setCurrentHistory] = useState<any>({});

    const [pinkMaskData, setPinkMaskData] = useState<any>(null);
    const [previewImageSrc, setPreviewImageSrc] = useState<any>({});

    const value = {
        generationIdRef,
        generationHistory,
        setGenerationHistory,
        currentHistory,
        setCurrentHistory,
        pinkMaskData,
        setPinkMaskData,
        previewImageSrc,
        setPreviewImageSrc
    };

    return (
        <BackgroundChangerContext.Provider value={value}>
            {children}
        </BackgroundChangerContext.Provider>
    )
}

export { BackgroundChangerProvider, BackgroundChangerContext };