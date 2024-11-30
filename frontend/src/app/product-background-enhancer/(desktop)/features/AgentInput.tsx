import { CloudUploadOutlined, SendOutlined } from '@ant-design/icons';
import {
  ActionIcon,
  DraggablePanelBody,
  Icon,
  TabsNav,
  useControls,
  useCreateStore,
} from '@lobehub/ui';
import { Button, Collapse, Divider, Empty, GetProp, Image, Modal, Radio, Spin, Upload } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import Input from 'antd/es/input/Input';
import { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
import axios from 'axios';
import JSZip from 'jszip';
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Center } from 'react-layout-kit';
import styled from 'styled-components';

import PromptImageTemplateList from '@/components/PromptImageTemplateList';
import FolderPanel from '@/features/FolderPanel';
import AxiosProvider from '@/utils/axios';

import AgentAssets from './AgentAssets';
import AgentEditor from './AgentEditor';
import AgentTemplates from './AgentTemplates';
import useProductBG from '../../provider/useProductBG';
import GenerationHistory from './GenerationHistory/GenerationHistory';
import { toast } from 'react-toastify';

const StyledUpload = styled(Upload)`
  .ant-upload-select,
  .ant-upload-list-item-container {
    width: 100% !important;
    height: 200px !important;
  }
`;

const useStyles = createStyles(({ stylish, css, cx }) =>
  cx(
    stylish.noScrollbar,
    css`
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 8px 8px 0;
    `,
  ),
);

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => resolve(reader.result as string));
    reader.onerror = (error) => reject(error);
  });

interface AgentInputProps {
  image: string | null;
  imageFile: File | null;
  imageHeight: number;
  imageRef: MutableRefObject<any>;
  canvasImageFile: File | null;
  setImage: Dispatch<SetStateAction<string | null>>;
  setImageFile: Dispatch<SetStateAction<File | null>>;
  setImageHeight: Dispatch<SetStateAction<number>>;
  setOutputImages: Dispatch<SetStateAction<string[]>>;
  setPrompt: Dispatch<SetStateAction<string>>;
  promptRef: MutableRefObject<string | undefined>;
  textAreaRef: MutableRefObject<any>;
  agentInputComponent: string;
  setAgentInputComponent: (component: string) => void;
  setFaceDetailerPrompt: Dispatch<SetStateAction<string>>;
  setModelLora: Dispatch<SetStateAction<string | undefined>>;
  setIsManual: Dispatch<SetStateAction<boolean>>;
  setManualModelPrompt: Dispatch<SetStateAction<object[]>>;
  setManualSurroundingPrompt: Dispatch<SetStateAction<object[]>>;
  setManualBackgroundPrompt: Dispatch<SetStateAction<object[]>>;
  isBgRemoveLoading: boolean;
  setIsBgRemoveLoading: Dispatch<SetStateAction<boolean>>;
  setTemplate: Dispatch<SetStateAction<string>>;
  setProductPrompt: any;
  setBgImageFile: Dispatch<SetStateAction<File | null>>;
  productPrompt: any;
  maskImage: string | null;
  setMaskImage: Dispatch<SetStateAction<string | null>>;
  maskImageFile: File | null;
  setMaskImageFile: Dispatch<SetStateAction<File | null>>;
  setCanvasImageFile: Dispatch<SetStateAction<File | null>>;
  setSelectedTemplateForCanvas: any;
  selectedTemplateForCanvas: any;
  setBgReferencePrompt: any;
  elementsRef: MutableRefObject<any>;
  bgReferencePrompt: string;
  manualPrompt: any;
  setManualPrompt: any;
  template: any;
  selectedBgTemplate: any;
  setSelectedBgTemplate: any;
  bgImageFile: any;
  renderStrength: any;
  setRenderStrength: any;
}

const AgentInput = (props: AgentInputProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>();
  const [text, setText] = useState('');
  const [promptImages, setPromptImages] = useState([]);
  const [modelPrompt, setModelPrompt] = useState('');
  const [backgroundPrompt, setBackgroundPrompt] = useState('');
  const [cameraEffectsPrompt, setCameraEffectsPrompt] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>('model');
  const [selectedModalTemplate, setSelectedModalTemplate] = useState(null);
  const [isProductMaskLoading, setIsProductMaskLoading] = useState(false);
  const [maskImageShouldFetch, setMaskImageShouldFetch] = useState(false);

  const [uploadedBgRefs, setUploadedBgRefs] = useState<any[]>([]);
  const [uploadedBgRefFiles, setUploadedBgRefFiles] = useState<any[]>([]);
  const [selectedCustomBg, setSelectedCustomBg] = useState<any>(null);
  const [isProductDescriptionLoading, setIsProductDescriptionLoading] = useState(false);
  const maskFileNameRef = useRef('');
  const fetchQueueRef = useRef<string[]>([]);

  const mixtralFileRef = useRef<string | null>(null);
  const [shouldFetch, setShouldFetch] = useState(false);

  const { styles } = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('chat');
  const [loading, setLoading] = useState(false);
  const { setIsProductDescriptionShow, setModalProductDescription } = useProductBG();


  const upload = async (file: RcFile) => {
    setLoading(true);

    if (file) {
      props.setImageFile(file);
      props.setImageHeight(0);
      props.setImage(URL.createObjectURL(file));
    }
    setLoading(false);
  };

  const fetchMaskImageByFileName = async (url: string, imageFileName: string) => {
    try {
      const response = await axios.get(url, {
        responseType: 'blob',
      });
      if (response.status === 204) {
        return;
      } else if (response.status === 200) {
        fetchQueueRef.current = fetchQueueRef.current.filter(
          (filename) => filename !== imageFileName,
        );

        const blob = new Blob([response.data], { type: 'image/png' });
        const objectURL = URL.createObjectURL(blob);

        const file = new File([blob], 'maskImage', { type: 'image/png' });
        props.setMaskImage(objectURL);
        props.setMaskImageFile(file);
        setIsProductMaskLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsProductMaskLoading(false);
    }
  };

  useEffect(() => {
    if (fetchQueueRef.current.length === 0 || maskImageShouldFetch === false) return;
    const intervalId = setInterval(() => {
      if (fetchQueueRef.current.length === 0) {
        setMaskImageShouldFetch(false);
        clearInterval(intervalId);
        return;
      }
      fetchQueueRef.current.forEach((filename) => {
        fetchMaskImageByFileName(
          `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file?filename=${filename}`,
          filename,
        );
      });
    }, 3_000);

    return () => clearInterval(intervalId);
  }, [maskImageShouldFetch]);

  const fetchDescriptionByFileName = async (url: string, imageFileName: string) => {
    try {
      const response = await axios.get(url);
      if (response.status === 204) {
        return;
      } else if (response.status === 200) {
        setShouldFetch(false);
        setIsProductDescriptionShow(true);
        setModalProductDescription(response.data.description);
        // props.setProductPrompt(response.data.description);
        setIsProductDescriptionLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDescriptionChange = async function (file: File) {
    try {
      setIsProductDescriptionLoading(true);
      let fileUrl = await getBase64(file as FileType);
      setPreviewImage(fileUrl);

      fetchQueueRef.current = [];
      props.setProductPrompt('');
      const formData = new FormData();
      const randomName1 =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
      const newFile1 = new File([file as File], randomName1, {
        type: (file as File)?.type ?? 'image/jpeg',
      });

      formData.append('image', newFile1);
      maskFileNameRef.current = randomName1;
      await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const descriptionGenerateRequest = {
        inputImagePath: '../input/' + maskFileNameRef.current + '.jpg',
        outputFileName: maskFileNameRef.current + '_text',
      }

      try {
        const res = await AxiosProvider.post(`/api/text-generation/description?target=product`, descriptionGenerateRequest);
        if (res.status === 200) {
          setShouldFetch(true);
          fetchQueueRef.current.push(maskFileNameRef.current + '_text');
        }
      } catch (error: any) {
        if (error.response.data?.error) {
          if (error.response.data.error.includes('InsufficientCredits')) {
            toast.error('Insufficient Credits')
          }
        }
        props.setIsBgRemoveLoading(false);
        setIsProductDescriptionLoading(false);
      }
    } catch (error) {
      props.setIsBgRemoveLoading(false);
      setIsProductDescriptionLoading(false);
      console.error('Error:', error);
    }
  };

  async function getImageBlobFromSrc(src: string) {
    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

      const imageBlob = await response.blob();
      return imageBlob;
    } catch (error) {
      console.error('Error getting ImageFile from src:', error);
    }
  }

  useEffect(() => {
    if (shouldFetch === false) return;
    const intervalId = setInterval(() => {
      if (fetchQueueRef.current.length === 0) {
        setShouldFetch(false);
        clearInterval(intervalId);
        return;
      }
      fetchQueueRef.current.forEach((filename) => {
        fetchDescriptionByFileName(
          `${process.env.NEXT_PUBLIC_COMFY_API_URL}/api/product-description?filename=${filename}`,
          filename,
        );
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, [shouldFetch]);

  const setSelectedImageFile = async (src: string) => {
    setSelectedImage(src);
    if (src) {
      const imageBlob = await getImageBlobFromSrc(src);
      if (imageBlob) {
        const imageFile = new File([imageBlob], 'imagefile', { type: imageBlob.type });
        props.setImageFile(imageFile);
        props.setImage(URL.createObjectURL(imageFile));
      }
    }
  };

  const handleClearInputs = () => {
    props.setImage(null);
    props.setPrompt('');
    props.setOutputImages([]);
    setModelPrompt('');
    setBackgroundPrompt('');
    setCameraEffectsPrompt('');
    props.imageRef.current = null;
    props.promptRef.current = '';
    setPromptImages([]);
  };

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.slice(Math.max(0, file.url!.lastIndexOf('/') + 1)));
  };
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const modelTemplates = [
    // {
    //   id: 1,
    //   label: 'Human',
    //   items: [
    //     {
    //       id: 6,
    //       label: '',
    //       image: '/elements/human1.svg',
    //       prompt: 'a palm of a hand facing right',
    //     },
    //     {
    //       id: 7,
    //       label: '',
    //       image: '/elements/human2.svg',
    //       prompt: 'between two hands ',
    //     },
    //   ],
    // },

    {
      id: 3,
      label: 'Platforms',
      items: [
        {
          id: 10,
          label: '',
          image: '/elements/platform1.svg',
          prompt: 'white round podium',
        },
        {
          id: 11,
          label: '',
          image: '/elements/platform2.svg',
          prompt: 'white cubical podium',
        },
      ],
    },
    {
      id: 4,
      label: 'Flowers',
      items: [
        {
          id: 12,
          label: '',
          image: '/elements/flowers1.svg',
          prompt: 'rose',
        },
        {
          id: 13,
          label: '',
          image: '/elements/flowers2.svg',
          prompt: 'flower',
        },
      ],
    },
    {
      id: 5,
      label: 'Food & Drinks',
      items: [
        {
          id: 14,
          label: '',
          image: '/elements/foods1.svg',
          prompt: 'glass with drink and straw',
        },
        {
          id: 15,
          label: '',
          image: '/elements/food2.svg',
          prompt: 'ice cream',
        },
      ],
    },
  ];

  useEffect(() => {
    const newPrompt = `${modelPrompt ? modelPrompt + ',' : ''} ${backgroundPrompt ? backgroundPrompt + ',' : ''} ${cameraEffectsPrompt ? cameraEffectsPrompt + ',' : ''}`;
    props.setPrompt(newPrompt.trim());
  }, [modelPrompt, backgroundPrompt, cameraEffectsPrompt]);

  function extractLinks(text: string) {
    const urlRegex = /(https?:\/\/\S+)/g;
    return text.match(urlRegex);
  }
  const onGetImagesClick = async () => {
    setLoading(true);
    const links = extractLinks(text);
    const mistralApiUrl = btoa(process.env.NEXT_PUBLIC_MISTRAL_API_URL!);
    const hasQueryParams = links && links[0].includes('?');
    const separator = hasQueryParams ? '&' : '?';
    mixtralFileRef.current =
      Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
    const url = `${links && links[0]}${separator}mistralUrl=${mistralApiUrl}&exec=getAllImages&filename=${mixtralFileRef.current}`;
    window.open(url, '_blank');

    setTimeout(async () => {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_MISTRAL_API_URL}/get-images?filename=${mixtralFileRef.current}`,
      );
      const modifiedImages = data.data.images.map((img: string) => {
        return img.replace('/128/128', '/1024/1024');
      });
      setPromptImages(modifiedImages);
      setLoading(false);
    }, 20000);
  };

  const store = useCreateStore();
  const { variant }: any = useControls(
    {
      variant: {
        options: ['default', 'compact'],
        value: 'compact',
      },
    },
    { store },
  );

  const handleTabChange = (activeKey: string) => {
    setSelectedTab(activeKey);
  };

  const getSidebarContent = (agentInputComponent: any) => {
    switch (agentInputComponent) {
      case 'assets':
        return (
          <AgentAssets
            selectedImage={selectedImage}
            fileList={fileList}
            theme={theme}
            imageFile={props.imageFile}
            loading={loading}
            upload={upload}
            handleChange={handleChange}
            handlePreview={handlePreview}
            handleCancel={handleCancel}
            previewOpen={previewOpen}
            previewTitle={previewTitle}
            previewImage={previewImage}
            setBgReferencePrompt={props.setBgReferencePrompt}
            setText={setText}
            image={props.image}
            onGetImagesClick={onGetImagesClick}
            isProductDescriptionLoading={isProductDescriptionLoading}
            promptImages={promptImages}
            setSelectedImageFile={setSelectedImageFile}
            setAgentInputComponent={props.setAgentInputComponent}
            handleCreateImage={handleDescriptionChange}
            setTemplate={props.setTemplate}
            productPrompt={props.productPrompt}
            setProductPrompt={props.setProductPrompt}
            maskImage={props.maskImage}
            maskImageFile={props.maskImageFile}
            setCanvasImageFile={props.setCanvasImageFile}
            setMaskImage={props.setMaskImage}
            isRemoveBgLoading={props.isBgRemoveLoading}
            isProductMaskLoading={isProductMaskLoading}
            setMaskImageFile={props.setMaskImageFile}
            setBgImageFile={props.setBgImageFile}
            uploadedBgRefs={uploadedBgRefs}
            setUploadedBgRefs={setUploadedBgRefs}
            uploadedBgRefFiles={uploadedBgRefFiles}
            setUploadedBgRefFiles={setUploadedBgRefFiles}
            selectedCustomBg={selectedCustomBg}
            setSelectedCustomBg={setSelectedCustomBg}
            selectedBgTemplate={props.selectedBgTemplate}
            setSelectedBgTemplate={props.setSelectedBgTemplate}
            setManualPrompt={props.setManualPrompt}
          />
        );
      case 'templates':
        return (
          <AgentTemplates
            modelTemplates={modelTemplates}
            setModelPrompt={setModelPrompt}
            elementsRef={props.elementsRef}
            selectedModalTemplate={selectedModalTemplate}
            setSelectedModalTemplate={setSelectedModalTemplate}
            setTemplate={props.setTemplate}
            setBgImageFile={props.setBgImageFile}
            setSelectedTemplateForCanvas={props.setSelectedTemplateForCanvas}
            selectedTemplateForCanvas={props.selectedTemplateForCanvas}
          />
        );
      case 'editor':
        return (
          <AgentEditor
            productInfo={props.productPrompt}
            setProductInfo={props.setProductPrompt}
            setPrompt={props.setPrompt}
            elementsRef={props.elementsRef}
            bgReferencePrompt={props.bgReferencePrompt}
            setManualPrompt={props.setManualPrompt}
            manualPrompt={props.manualPrompt || []}
            bgImageFile={props.bgImageFile}
            setBgImageFile={props.setBgImageFile}
            setSelectedTemplate={props.setSelectedBgTemplate}
            renderStrength={props.renderStrength}
            setRenderStrength={props.setRenderStrength}
          />
        );
      case 'history':
        return (<GenerationHistory />)
      default:
        return null;
    }
  };

  return (
    <FolderPanel>
      <h1
        style={{
          color: 'white',
          fontWeight: 500,
          marginBottom: 10,
          marginLeft: 20,
          marginTop: 20,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(to right, white 30%, black 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'BDO Grotesk, sans-serif',
          fontSize: "19px"
        }}
      >
        Product Background Enhancer
      </h1>

      {getSidebarContent(props.agentInputComponent)}
      <DraggablePanelBody className={styles}></DraggablePanelBody>
    </FolderPanel>
  );
};

export default AgentInput;
