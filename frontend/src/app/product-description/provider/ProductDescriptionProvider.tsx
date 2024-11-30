import { UploadFile } from 'antd';
import { createContext, useRef, useState } from 'react';

const ProductDescriptionContext = createContext<any>({});

export const languageOptions = [
    "Hindi",
    "Gujarati",
    "Telugu",
    "Marathi",
    "Urdu",
    "Assamese",
    "Konkani",
    "Nepali",
    "Sindhi",
    "Tamil",
    "Kannada",
    "Malayalam",
    "Punjabi",
    "Bengali",
    "Odia",
];

export const languageCodes: Record<string, string> = {
    "Hindi": "hi",
    "Gujarati": "gu",
    "Telugu": "te",
    "Marathi": "mr",
    "Urdu": "ur",
    "Tamil": "ta",
    "Kannada": "kn",
    "Malayalam": "ml",
    "Punjabi": "pa",
    "Bengali": "bn",
};

const ProductDescriptionProvider = ({ children }: any) => {
    const generationIdRef = useRef<String>("");

    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [productDetailsAnswer, setProductDetailsAnswer] = useState<any>({});
    // form,output,rewrite,empty
    const [steps, setSteps] = useState(["output"]);
    const [productDescription, setProductDescription] = useState<any>("");
    const [showTranslation, setShowTranslation] = useState(false);
    const [translatedOutput, setTranslatedOutput] = useState<any>([]);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
    const [conversationHistory, setConversationHistory] = useState<any>([]);

    const [output, setOutput] = useState<any>([
        // {
        //     question: "What is the product?",
        //     answer: "response.data.description",
        //     translation: [
        //         {
        //             language: "Hindi",
        //             answer: "Hindi"
        //         }, {
        //             language: "Gujarati",
        //             answer: "Gujarati"
        //         }
        //     ]
        // }
    ]);

    const value = {
        generationIdRef,
        image,
        setImage,
        imageFile,
        setImageFile,
        previewOpen,
        setPreviewOpen,
        previewImage,
        setPreviewImage,
        previewTitle,
        setPreviewTitle,
        fileList,
        setFileList,
        prompt,
        setPrompt,
        isLoading,
        setIsLoading,
        output,
        setOutput,
        productDetailsAnswer,
        setProductDetailsAnswer,
        steps,
        setSteps,
        productDescription,
        setProductDescription,
        showTranslation,
        setShowTranslation,
        translatedOutput,
        setTranslatedOutput,
        uploadedImageUrl,
        setUploadedImageUrl,
        conversationHistory,
        setConversationHistory,
    };

    return (
        <ProductDescriptionContext.Provider value={value}>
            {children}
        </ProductDescriptionContext.Provider>
    )
}

export { ProductDescriptionProvider, ProductDescriptionContext };