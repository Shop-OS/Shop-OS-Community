import { createContext, use, useEffect, useRef, useState } from 'react';

const TextTo3DContext = createContext<any>({});

const TextTo3DProvider = ({ children }: any) => {
    const [outputImages, setOutputImages] = useState<any>({
        // tripoSR: {
        //     url: null,
        //     isLoading: false,
        //     progress: 0
        // },
        // tripo3D: {
        //     url: null,
        //     isLoading: false,
        //     progress: 0
        // },
        // "comfy": {
        //     url: '',
        //     // url: "https://hom-devtest.s3.us-east-1.amazonaws.com/zu23dolrhhihvus1x84ees_output_00001.gif",
        //     isLoading: true,
        //     progress: 0
        // }
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [is3DLoading, setIs3DLoading] = useState<boolean>(false);

    const generationIdRef = useRef<String>("");
    const [generationHistory, setGenerationHistory] = useState([]);
    const [currentHistory, setCurrentHistory] = useState<any>({});

    useEffect(() => {
        setIs3DLoading(Object.values(outputImages).some((outputImage: any) => outputImage.isLoading));
    }, [
        outputImages,
    ]);


    const value = {
        outputImages,
        setOutputImages,
        imageFile,
        setImageFile,
        is3DLoading,
        setIs3DLoading,
        generationIdRef,
        generationHistory,
        setGenerationHistory,
        currentHistory,
        setCurrentHistory,
    };
    return (
        <TextTo3DContext.Provider value={value}>
            {children}
        </TextTo3DContext.Provider>
    )
}

export { TextTo3DProvider, TextTo3DContext };