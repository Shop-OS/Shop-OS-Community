import { DraggablePanelBody, useControls, useCreateStore } from '@lobehub/ui';
import { GetProp, Upload } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
import axios from 'axios';
import { set } from 'lodash';
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import FolderPanel from '@/features/FolderPanel';
import AxiosProvider from '@/utils/axios';

import AgentAssets from './AgentAssets';
import AgentEditor from './AgentEditor';
import AgentTemplates from './AgentTemplates';
import bg_workflow from './workflow/workflow__bg_change_api_1_3.json';
import { OutputImage } from '..';
import GenerationHistory from './GenerationHistory/GenerationHistory';
import { toast } from 'react-toastify';
import useApparel from '../../provider/useApparel';
import { backgroundTemplates } from '@/const/dataConst';

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
  maskImage: string | null;
  maskImageFile: File | null;
  imageHeight: number;
  imageRef: MutableRefObject<any>;
  fetchCount: number | null;
  isMaskLoading: boolean;
  setIsMaskLoading: Dispatch<SetStateAction<boolean>>;
  setImage: Dispatch<SetStateAction<string | null>>;
  setImageFile: Dispatch<SetStateAction<File | null>>;
  setMaskImage: Dispatch<SetStateAction<string | null>>;
  setMaskImageFile: Dispatch<SetStateAction<File | null>>;
  setImageHeight: Dispatch<SetStateAction<number>>;
  setOutputImages: Dispatch<SetStateAction<OutputImage[]>>;
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
  setFetchCount: Dispatch<SetStateAction<number>>;
  manualModelPrompt: object[];
  manualSurroundingPrompt: object[];
  manualBackgroundPrompt: object[];
  setBgModel: Dispatch<SetStateAction<string>>;
  bgImageFile: File | null;
  setBgImageFile: Dispatch<SetStateAction<File | null>>;
  productInfo: any;
  setProductInfo: any;
  blendedImageFile: File | null;
  setBlendedImageFile: Dispatch<SetStateAction<File | null>>;
  modelPrompt: string;
  setModelPrompt: Dispatch<SetStateAction<string>>;
  backgroundPrompt: string;
  setBackgroundPrompt: Dispatch<SetStateAction<string>>;
  productPrompt: string;
  setProductPrompt: Dispatch<SetStateAction<string>>;
  isBlurBg: boolean;
  setIsBlurBg: Dispatch<SetStateAction<boolean>>;
  setBackgroundNegativePrompt: Dispatch<SetStateAction<string>>;
  setBackgroundLora: Dispatch<SetStateAction<string | undefined>>;
  setBackgroundLoraModelStrength: Dispatch<SetStateAction<number>>;
  setBackgroundLoraClipStrength: Dispatch<SetStateAction<number>>;
  blurStatePrompt: string;
  fileUploadLoading: boolean;
  setFileUploadLoading: Dispatch<SetStateAction<boolean>>;
  renderStrength: number;
  setRenderStrength: Dispatch<SetStateAction<number>>;
  loraPrompt: string;
  setLoraPrompt: Dispatch<SetStateAction<string>>;
}

const AgentInput = (props: AgentInputProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [maskImageShouldFetch, setMaskImageShouldFetch] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>();
  const [text, setText] = useState('');
  const [promptImages, setPromptImages] = useState([]);

  const [cameraEffectsPrompt, setCameraEffectsPrompt] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>('model');
  const [selectedModalTemplate, setSelectedModalTemplate] = useState(null);
  const [selectedBackgroundTemplate, setSelectedBackgroundTemplate] = useState(null);
  const [selectedEffectTemplate, setSelectedEffectTemplate] = useState(null);
  const maskFileNameRef = useRef('');
  const fetchQueueRef = useRef<string[]>([]);
  const fetchDescriptionQueueRef = useRef<string[]>([]);
  const [isOpenMotionEdit, setIsOpenMotionEdit] = useState(false);
  const [productMaskDescription, setProductMaskDescription] = useState('');

  const mixtralFileRef = useRef<string | null>(null);

  const { styles } = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('chat');
  const [loading, setLoading] = useState(false);
  const [isProductDescriptionLoading, setIsProductDescriptionLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const { setPinkMaskData } = useApparel();


  const upload = async (file: RcFile) => {
    setLoading(true);

    if (file) {
      props.setMaskImage(null);
      props.setMaskImageFile(null);
      setProductMaskDescription('');

      props.setImageFile(file);
      props.setImageHeight(0);
      props.setImage(URL.createObjectURL(file));
    }

    setLoading(false);
  };

  const handleCreateImage = async function (file: File) {
    try {
      props.setIsMaskLoading(true);
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

      if (productMaskDescription.trim().length > 0) {
        bg_workflow['4']['inputs']['prompt'] = productMaskDescription;
      } else {
        bg_workflow['4']['inputs']['prompt'] = 'clothes, pants';
      }
      bg_workflow['1']['inputs']['image'] = '../input/' + maskFileNameRef.current + '.jpg';
      bg_workflow['8']['inputs']['filename_prefix'] = maskFileNameRef.current ?? '';

      const response = await AxiosProvider.post(`/prompt`, { prompt: bg_workflow, front: true });

      if (response.status === 200) {
        try {
          setMaskImageShouldFetch(true);
          setPinkMaskData(null);
          for (let i = 1; i < 2; i++) {
            fetchQueueRef.current.push(maskFileNameRef.current + '_0000' + i);
          }
        } catch (error) {
          props.setIsMaskLoading(false);
          console.error('Error:', error);
        }
      }
    } catch (error) {
      props.setIsMaskLoading(false);
      console.error('Error:', error);
    }
  };

  const fetchImageByFileName = async (url: string, imageFileName: string) => {
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
        props.setIsMaskLoading(false);
        setIsOpenMotionEdit(true);
        // if (props.imageFile) {
        //   handleFetchProductDescription(props.imageFile);
        // }
      }
    } catch (error) {
      console.error('Error:', error);
      props.setIsMaskLoading(false);
    }
  };

  const handleFetchProductDescription = async function (file: File) {
    try {
      setIsProductDescriptionLoading(true);
      fetchDescriptionQueueRef.current = [];
      props.setProductPrompt('');
      const formData = new FormData();
      const randomName1 =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
      const newFile1 = new File([file as File], randomName1, {
        type: (file as File)?.type ?? 'image/jpeg',
      });

      formData.append('image', newFile1);
      // maskFileNameRef.current = randomName1;
      await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const descriptionGenerateRequest = {
        inputImagePath: '../input/' + randomName1 + '.jpg',
        outputFileName: randomName1 + '_text',
      }

      try {
        const res = await AxiosProvider.post(`/api/text-generation/description?target=apparel`, descriptionGenerateRequest);

        if (res.status === 200) {
          setShouldFetch(true);
          fetchDescriptionQueueRef.current.push(randomName1 + '_text');
        }
      } catch (error: any) {
        if (error.response.data?.error) {
          if (error.response.data.error.includes('InsufficientCredits')) {
            toast.error('Insufficient Credits')
          }
        }
        setIsProductDescriptionLoading(false);
      }
    } catch (error) {
      setIsProductDescriptionLoading(false);
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (shouldFetch === false) return;
    const intervalId = setInterval(() => {
      if (fetchDescriptionQueueRef.current.length === 0) {
        setShouldFetch(false);
        clearInterval(intervalId);
        return;
      }
      fetchDescriptionQueueRef.current.forEach((filename) => {
        fetchDescriptionByFileName(
          `${process.env.NEXT_PUBLIC_COMFY_API_URL}/api/product-description?filename=${filename}`,
          filename,
        );
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, [shouldFetch]);

  const fetchDescriptionByFileName = async (url: string, imageFileName: string) => {
    try {
      const response = await axios.get(url);
      if (response.status === 204) {
        return;
      } else if (response.status === 200) {
        setShouldFetch(false);
        props.setProductPrompt(response.data.description);
        setIsProductDescriptionLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
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
        fetchImageByFileName(
          `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file?filename=${filename}`,
          filename,
        );
      });
    }, 3_000);

    return () => clearInterval(intervalId);
  }, [maskImageShouldFetch]);

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
    props.setModelPrompt('');
    props.setBackgroundPrompt('');
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
  const handleChange: UploadProps['onChange'] = ({ file, fileList: newFileList }) => {
    if (file.status !== 'uploading') {
      props.setFileUploadLoading(false);
    }
    setFileList(newFileList);
  };

  const modelTemplates = [
    {
      id: 1,
      label: 'Indian Male',
      image: '/editorImage/pexels-ketut-subiyanto-4307884-Photoroom.png-Photoroom.png',
      previewImage: '/editorImage/pexels-ketut-subiyanto-4307884-Photoroom.png-Photoroom.png',
      prompt:
        'Indian male model posing for a photo, super detailed raw face, slight stubble beard, black detailed hair',
      faceDetailer: 'indian male model, raw super detailed face, looking real, detailed ears',
    },
    {
      id: 2,
      label: 'Indian Female',
      image: '/editorImage/Rectangle 25.png',
      previewImage: '/editorImage/Rectangle 25.png',
      prompt:
        'Indian female model posing for a photo, super detailed raw face, black detailed hair, clean forehead',
      faceDetailer: 'indian female model, raw super detailed face, looking real, clean forehead',
    },
    {
      id: 7,
      label: 'British Male',
      image: '/editorImage/pexels-filip-rankovic-grobgaard-12649476-Photoroom.png-Photoroom.png',
      previewImage:
        '/editorImage/pexels-filip-rankovic-grobgaard-12649476-Photoroom.png-Photoroom.png',
      prompt:
        'White British male model posing for a photo, super detailed raw face, slight stubble beard, black detailed hair',
      faceDetailer:
        'White British male model, raw super detailed face, looking real, detailed ears',
    },
    {
      id: 8,
      label: 'British Female',
      image: '/editorImage/Rectangle 26.png',
      previewImage: '/editorImage/Rectangle 26.png',
      prompt:
        'White British female model posing for a photo, super detailed raw face, black detailed hair',
      faceDetailer: 'British female model, raw super detailed face, looking real, clean forehead',
    },
  ];


  const cameraEffectsTemplates = [
    {
      id: 13,
      label: 'Bokeh effect',
      image: '/editorImage/3437783.jpg',
      previewImage: '/editorImage/3437783.jpg',
      prompt:
        'portrait mode, bokeh effect, blurred background, focused subject, 4k, HD, (vivid colors, shallow depth of field, professional photograph))',
      disabled: true,
    },
    {
      id: 14,
      label: 'Lens flare',
      image: '/editorImage/Lens_flares_001.jpg',
      previewImage: '/editorImage/Lens_flares_001.jpg',
      prompt: '((lens flare), cinematic, dramatic lighting), HD, vivid colors',
      disabled: true,
    },
    {
      id: 15,
      label: 'Chromatic aberration',
      image: '/editorImage/multi-colored-psychedelic-background.jpg',
      previewImage: '/editorImage/multi-colored-psychedelic-background.jpg',
      prompt: '(vintage, lo-fi look, chromatic aberration, retro, film grain, VHS effect)',
      disabled: true,
    },
    {
      id: 16,
      label: 'Lens Distortion',
      image: '/editorImage/lensDistortion.png',
      previewImage: '/editorImage/lensDistortion.png',
      prompt:
        '((fisheye effect, lens distortion), wide field of view, barrel distortion, (ultra-wide angle lens)), vintage look, (spherical), retro, cinematic, high quality, (exaggerated perspective)',
      disabled: true,
    },
    {
      id: 17,
      label: 'Tilt-shift',
      image: '/editorImage/blurred-cityscape.jpg',
      previewImage: '/editorImage/blurred-cityscape.jpg',
      prompt:
        '(tilt-shift effect, miniature model-like scene, bright colors, vibrant, artificial lighting, sunny day, cheerful atmosphere, tiny people, small cars, detailed buildings, toy-like, shallow depth of field, exaggerated bokeh, professional photograph, HD)',
      disabled: true,
    },
    {
      id: 18,
      label: 'Vintage',
      image: '/editorImage/VINTAGE_GRUNGE_BACKGROUND.jpg',
      previewImage: '/editorImage/VINTAGE_GRUNGE_BACKGROUND.jpg',
      prompt:
        '((nostalgic vintage scene, old-fashioned look, sepia tone, film grain, 35mm camera, vintage filter), aged paper texture, antique feel), soft focus, classic cars, retro fashion',
      disabled: true,
    },
    {
      id: 19,
      label: 'Zoom burst',
      image: '/editorImage/zoomburst.jpg',
      previewImage: '/editorImage/zoomburst.jpg',
      prompt:
        '((zoom burst effect, sense of motion or action), high resolution, vibrant colors, (dynamic composition, fast shutter speed, wide aperture), bokeh, HDR, professional photograph, cinematic), trending on Instagram',
      disabled: true,
    },
    {
      id: 20,
      label: 'Heat distortion',
      image: '/editorImage/vivid-blurred-colorful-wallpaper-background.jpg',
      previewImage: '/editorImage/vivid-blurred-colorful-wallpaper-background.jpg',
      prompt:
        '((heat distortion effect, hot and hazy atmosphere), sunset, long exposure, dramatic lighting, HD, close-up, landscape, photorealistic, cinematic, HDR, telephoto lens, soft focus)',
      disabled: true,
    },
    {
      id: 21,
      label: 'Prismatic film filters',
      image: '/editorImage/grunge-style-abstract-light-leaks-overlay-texture-background.jpg',
      previewImage: '/editorImage/grunge-style-abstract-light-leaks-overlay-texture-background.jpg',
      prompt:
        '(psychedelic and colorful effect, prismatic film filters, vibrant colors, kaleidoscopic patterns), trippy, vibrant, surreal, abstract art, experimental, bokeh, vibrant lights, lens flare',
      disabled: true,
    },
    {
      id: 22,
      label: 'Helios swirly bokeh',
      image: '/editorImage/3126127.jpg',
      previewImage: '/editorImage/3126127.jpg',
      prompt:
        '(dreamy, swirling bokeh effect, Helios lens, vintage style, soft lighting), artistic, masterpiece, high quality, portrait photography, vintage, classic, retro, shallow depth of field, circular bokeh',
      disabled: true,
    },
    {
      id: 23,
      label: 'Prism',
      image: '/editorImage/images (3).jpg',
      previewImage: '/editorImage/images (3).jpg',
      prompt:
        '(((refraction of light, prism, interesting light effects, dramatic lighting, high resolution, HDR, Bokeh, professional photograph), vivid colors, rainbow, color spectrum))',
      disabled: true,
    },
  ];

  useEffect(() => {
    const newPrompt = `${props.modelPrompt ? props.modelPrompt + ',' : ''} ${props.productPrompt ? 'wearing ' + props.productPrompt + ',' : ''} ${props.backgroundPrompt ? props.backgroundPrompt : ''} ${cameraEffectsPrompt ? cameraEffectsPrompt + ',' : ''}`;
    props.setPrompt(newPrompt.trim());
  }, [props.modelPrompt, props.backgroundPrompt, cameraEffectsPrompt, props.productPrompt]);

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
      console.log(data.data.images);
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
            loading={loading}
            upload={upload}
            handleChange={handleChange}
            handlePreview={handlePreview}
            handleCancel={handleCancel}
            previewOpen={previewOpen}
            previewTitle={previewTitle}
            previewImage={previewImage}
            setText={setText}
            onGetImagesClick={onGetImagesClick}
            promptImages={promptImages}
            setSelectedImageFile={setSelectedImageFile}
            setAgentInputComponent={props.setAgentInputComponent}
            image={props.image}
            imageFile={props.imageFile}
            maskImage={props.maskImage}
            handleCreateImage={handleCreateImage}
            isMaskLoading={props.isMaskLoading}
            setMaskImage={props.setMaskImage}
            setMaskImageFile={props.setMaskImageFile}
            isOpenMotionEdit={isOpenMotionEdit}
            setIsOpenMotionEdit={setIsOpenMotionEdit}
            productMaskDescription={productMaskDescription}
            setProductMaskDescription={setProductMaskDescription}
            handleCreateMask={handleCreateImage}
            setBlendedImageFile={props.setBlendedImageFile}
            setIsMaskLoading={props.setIsMaskLoading}
            fileUploadLoading={props.fileUploadLoading}
            setFileUploadLoading={props.setFileUploadLoading}
          />
        );
      case 'templates':
        return (
          <AgentTemplates
            fileList={fileList}
            handlePreview={handlePreview}
            handleCancel={handleCancel}
            previewOpen={previewOpen}
            previewTitle={previewTitle}
            previewImage={previewImage}
            selectedTab={selectedTab}
            handleTabChange={handleTabChange}
            variant={variant}
            modelTemplates={modelTemplates}
            setModelPrompt={props.setModelPrompt}
            selectedModalTemplate={selectedModalTemplate}
            setSelectedModalTemplate={setSelectedModalTemplate}
            backgroundTemplates={backgroundTemplates}
            setBackgroundNegativePrompt={props.setBackgroundNegativePrompt}
            setBackgroundPrompt={props.setBackgroundPrompt}
            setBackgroundLora={props.setBackgroundLora}
            setBackgroundLoraModelStrength={props.setBackgroundLoraModelStrength}
            setBackgroundLoraClipStrength={props.setBackgroundLoraClipStrength}
            selectedBackgroundTemplate={selectedBackgroundTemplate}
            setSelectedBackgroundTemplate={setSelectedBackgroundTemplate}
            cameraEffectsTemplates={cameraEffectsTemplates}
            setCameraEffectsPrompt={setCameraEffectsPrompt}
            selectedEffectTemplate={selectedEffectTemplate}
            setSelectedEffectTemplate={setSelectedEffectTemplate}
            setFaceDetailerPrompt={props.setFaceDetailerPrompt}
            setModelLora={props.setModelLora}
            setBgModel={props.setBgModel}
            bgImageFile={props.bgImageFile}
            setBgImageFile={props.setBgImageFile}
            productPrompt={props.productPrompt}
            setProductPrompt={props.setProductPrompt}
            isBlurBg={props.isBlurBg}
            setIsBlurBg={props.setIsBlurBg}
            isProductDescriptionLoading={isProductDescriptionLoading}
            loraPrompt={props.loraPrompt}
            setLoraPrompt={props.setLoraPrompt}
          />
        );
      case 'editor':
        return (
          <AgentEditor
            productInfo={props.productInfo}
            setIsManual={props.setIsManual}
            manualModelPrompt={props.manualModelPrompt}
            manualSurroundingPrompt={props.manualSurroundingPrompt}
            manualBackgroundPrompt={props.manualBackgroundPrompt}
            setManualModelPrompt={props.setManualModelPrompt}
            setManualSurroundingPrompt={props.setManualSurroundingPrompt}
            setManualBackgroundPrompt={props.setManualBackgroundPrompt}
            setFetchCount={props.setFetchCount}
            fetchCount={props.fetchCount}
            setProductInfo={props.setProductInfo}
            bgImageFile={props.bgImageFile}
            setBgImageFile={props.setBgImageFile}
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
          fontFamily: 'BDO Grotesk, sans-serif',
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
          fontSize: "20px"
        }}
      >
        Apparel Shoots
      </h1>

      {getSidebarContent(props.agentInputComponent)}
      <DraggablePanelBody className={styles}></DraggablePanelBody>
    </FolderPanel>
  );
};

export default AgentInput;
