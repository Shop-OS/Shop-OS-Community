import { UploadFile } from 'antd';
import { createContext, useRef, useState } from 'react';

const ApparelContext = createContext<any>({});


const ApparelProvider = ({ children }: any) => {
    const generationIdRef = useRef<String>("");
    const [generationHistory, setGenerationHistory] = useState<any[]>([]);
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
        <ApparelContext.Provider value={value}>
            {children}
        </ApparelContext.Provider>
    )
}

export { ApparelProvider, ApparelContext };