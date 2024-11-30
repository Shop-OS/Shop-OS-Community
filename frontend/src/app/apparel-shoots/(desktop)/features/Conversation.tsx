import axios from 'axios';
import {
  ChangeEvent,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

import Header from '@/components/AgentHeader';
import ConversationHistoryImageCard from '@/components/ConversationHistoryImageCard';
import AxiosProvider from '@/utils/axios';

import { OutputImage } from '..';
import HotKeys from './HotKeys';
import PromptInput from './PromptInput';
import useApparel from '../../provider/useApparel';
import ConversationImageCard from '@/components/ConversationImageCard';
import { Button, Popover } from 'antd';
import { Terminal } from 'lucide-react';
import ImageEnlargePreview from '@/components/ImageEnlargePreview/ImageEnlargePreview';

interface ConversationProps {
  agentInputComponent: string;
  image: string | null;
  filename1Ref: MutableRefObject<string | undefined>;
  imageFile: File | null;
  maskImageFile: File | null;
  isLoading: boolean;
  prompt: string;
  promptRef: MutableRefObject<string | undefined>;
  setIsLoading: (isLoading: boolean) => void;
  setPrompt: (prompt: string) => void;
  setShouldFetch: (shouldFetch: boolean) => void;
  setTimeSpent: (timeSpent: number) => void;
  shouldFetch: boolean;
  timeSpent: number;
  textAreaRef: MutableRefObject<any>;
  fetchCount: number;
  outputImages: OutputImage[];
  faceDetailerPrompt: string;
  setOutputImages: Dispatch<SetStateAction<OutputImage[]>>;
  modelLora: string | undefined;
  isManual: boolean;
  manualModelPrompt: any;
  manualSurroundingPrompt: any;
  manualBackgroundPrompt: any;
  bgModel: string;
  bgImageFile: File | null;
  productInfo: string;
  blendedImageFile: File | null;
  setBlendedImageFile: Dispatch<SetStateAction<File | null>>;
  modelPrompt: string;
  backgroundPrompt: string;
  setModelPrompt: Dispatch<SetStateAction<string>>;
  setBackgroundPrompt: Dispatch<SetStateAction<string>>;
  magicMaskImageFile: File | null;
  setMagicMaskImageFile: Dispatch<SetStateAction<File | null>>;
  isBlurBg: boolean;
  backgroundNegativePrompt: string;
  setBackgroundNegativePrompt: Dispatch<SetStateAction<string>>;
  backgroundLora: string | undefined;
  backgroundLoraModelStrength: number;
  backgroundLoraClipStrength: number;
  blurStatePrompt: string;
  blurStateNegativePrompt: string;
  renderStrength: number;
  loraPrompt: string;
  setLoraPrompt: Dispatch<SetStateAction<string>>;
}

const Conversation = memo((props: ConversationProps) => {
  const fetchQueueRef = useRef<string[]>([]);
  const [showImages, setShowImages] = useState(false);
  // const [executionIds, setExecutionIds] = useState<string[]>([]);
  const executionIdsRef = useRef<string[]>([]);

  const socket = useRef<any>(null);
  const [clientId, setClientId] = useState<string>();
  const [queue_size, setQueueSize] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [lockPromptGeneration, setLockPromptGeneration] = useState(false);

  const { generationIdRef, currentHistory, previewImageSrc, setPreviewImageSrc } = useApparel();
  const inputImageURLRef = useRef<string>("");

  // const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const [trackProgress, setTrackProgress] = useState(false);
  const [outputImageSrc, setOutputImageSrc] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const COMFY_API_URL =
      process.env.NEXT_PUBLIC_COMFY_API_URL ?? 'https://genai-devtest.houseofmodels.ai';
    socket.current = io(COMFY_API_URL, { transports: ['websocket'] });
    socket.current.on('connect', () => {
      console.log('Socket.IO connection is open now: ', socket.current.id);
      setClientId(socket.current.id);
      setInterval(() => {
        if (socket.current?.connected) {
          socket.current.emit('heartbeat', { message: 'Heartbeat from client' });
        }
      }, 10000);
    });

    socket.current.on('queue_length', (data: any) => {
      setQueueSize(data.count);
    });

    socket.current.on('disconnect', () => {
      setClientId(undefined);
      console.log('Socket.IO connection is closed now.');
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);


  useEffect(() => {
    setOutputImageSrc(props.outputImages.map((item) => item.src).filter((item) => item !== ''));
  }, [JSON.stringify(props.outputImages)]);

  const fetchImageByFileName = async (url: string, imageFileName: string) => {
    try {
      const response = await AxiosProvider.get(url);
      if (response.status === 204) {
        return;
      } else if (response.status === 200) {
        fetchQueueRef.current.shift();
        props.setOutputImages((prev) => {
          const index = prev.findIndex((item) => item.fileName === imageFileName);
          if (index !== -1) {
            prev[index].src = response.data.downloadURL;
          }
          return prev;
        });
        progressRef.current = 0;
        // setTrackProgress(false);
      }
    } catch (error) {
      console.error('Error:', error);
      props.setIsLoading(false);
    }
  };

  const simulateProgress = async () => {
    try {
      const queue = await axios.get(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/get-queue`);
      const runningExecutions = queue.data.queue_running;
      const execs = runningExecutions.map((exec: any) => exec[1]);


      if (!execs.some((id: string) => executionIdsRef.current.includes(id)) && progressRef.current === 0) {
        // setOutputText('You are in queue');

      } else {
        if (progressRef.current < 30) {
          // setOutputText('Processing the scene');
        } else if (progressRef.current < 60) {
          // setOutputText('Preparing for generation');
        } else if (progressRef.current < 90) {
          // setOutputText('Generating image');
        } else {
          // setOutputText('Applying final touch');
        }

        let prog = progressRef.current + Math.floor(Math.random() * 4) + 4;
        if (prog > 99) {
          prog = 99;
        }
        progressRef.current = prog;
      }
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  };

  useEffect(() => {
    let interval: any;
    if (trackProgress === true) {
      interval = setInterval(() => {
        simulateProgress();
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [trackProgress, progressRef.current]);

  const getItemToBeFetched = () => {
    if (fetchQueueRef.current.length > 0) {
      const item = fetchQueueRef.current[0];
      return item;
    } else {
      props.setShouldFetch(false);
      props.setIsLoading(false);
      return null;
    }
  }

  useEffect(() => {
    if (props.shouldFetch) {
      const interval = setInterval(async () => {
        const item = getItemToBeFetched();
        if (!item) return;
        fetchImageByFileName(
          `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file/v2?filename=${item}&generationId=${generationIdRef.current}`,
          item,
        );
      }, 5_000);

      return () => clearInterval(interval);
    }
  }, [props.shouldFetch]);


  useEffect(() => {
    if (props.isLoading && props.shouldFetch) {
      const interval = setInterval(async () => {
        if (fetchQueueRef.current.length === 0) {
          return;
        }
        const queue = await axios.get(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/get-queue`);
        const runningExecutions = queue.data.queue_running;
        const pendingExecutions = queue.data.queue_pending;

        const allExecutions = runningExecutions
          .concat(pendingExecutions)
          .map((exec: any) => exec[1]);

        if (executionIdsRef.current.some((id) => allExecutions.includes(id))) {
          return;
        } else {
          console.log(executionIdsRef);
          console.log(allExecutions);
          if (failedCount < 5) {
            setFailedCount((prev) => prev + 1);
            return;
          } else {
            // setExecutionIds([]);
            executionIdsRef.current = [];
            setShowImages(false);
            props.setIsLoading(false);
            props.setShouldFetch(false);
            toast.error("Something isn't right. Please try again", {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              theme: 'dark',
            });
            clearInterval(interval);
          }
        }
      }, 20_000);

      return () => clearInterval(interval);
    }
  }, [props.isLoading, props.shouldFetch, executionIdsRef.current, failedCount]);

  useEffect(() => {
    console.log('executionIds:', executionIdsRef.current);
  }, [executionIdsRef.current])

  const onStopGeneration = async function () {
    try {
      setLockPromptGeneration(true);
      const queue = await axios.get(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/get-queue`);
      const runningExecutions = queue.data.queue_running;
      const pendingExecutions = queue.data.queue_pending;

      executionIdsRef.current.forEach(async (id) => {
        pendingExecutions.forEach((exec: any) => {
          if (exec[1] === id) {
            try {
              axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/delete-queue-item`, {
                delete: [id],
              });
            } catch (error) {
              console.log('Item deleted from queue');
            }
          }
        });
        runningExecutions.forEach((exec: any) => {
          if (exec[1] === id) {
            try {
              axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/interrupt`, {
                execution_id: exec[0],
              });
            } catch (error) {
              console.log('Item interrupted from queue');
            }
          }
        });
      });

      for (let i = 0; i <= pendingExecutions.length; i++) {
        let filename = `${props.filename1Ref.current}_0000${4 - i}`;
        await AxiosProvider.delete(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/api/generations/remove?generationId=${generationIdRef.current}&filename=${filename}`);
      }

      // setExecutionIds([]);
      executionIdsRef.current = [];
      setShowImages(false);
      props.setIsLoading(false);
      props.setShouldFetch(false);
      setLockPromptGeneration(false);
    } catch (error) {
      setLockPromptGeneration(false);
      console.error('Error:', error);
    }
  };

  const handleCreateImage = async function () {
    if (props.isLoading) return;
    setLockPromptGeneration(true);
    props.setIsLoading(true);

    // setExecutionIds([]);
    executionIdsRef.current = [];
    setFailedCount(0);
    fetchQueueRef.current = [];

    if (!props.imageFile) {
      toast.error('Please upload a product image', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: 'dark',
      });
      props.setIsLoading(false);
      setLockPromptGeneration(false);
      return;
    }

    if (props.prompt === undefined || props.prompt === '') {
      toast.error('Write a prompt or select from template options to generate an image', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: 'dark',
      });
      props.setIsLoading(false);
      setLockPromptGeneration(false);
      return;
    } else if (
      props.backgroundPrompt != '' &&
      (props.modelPrompt == '' || props.modelPrompt == undefined)
    ) {
      toast.error('Select model from the template options to generate an image', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: 'dark',
      });
      props.setIsLoading(false);
      setLockPromptGeneration(false);
      return;
    }

    props.setOutputImages([]);
    props.setTimeSpent(0);
    setShowImages(true);
    setTrackProgress(true);
    progressRef.current = 0;
    try {
      //userImage
      const formData = new FormData();
      const randomName1 =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
      const newFile1 = new File([props.imageFile as File], randomName1, {
        type: (props?.imageFile as File)?.type ?? 'image/jpeg',
      });

      formData.append('image', newFile1);

      props.filename1Ref.current = randomName1;
      const response = await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      inputImageURLRef.current = response.data.downloadURL;

      //mask Image upload
      const maskFormData = new FormData();
      const newMaskFile1 = new File([props.maskImageFile as File], randomName1 + '_mask', {
        type: (props?.maskImageFile as File)?.type ?? 'image/jpeg',
      });

      maskFormData.append('image', newMaskFile1);
      await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, maskFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      //focus Image upload
      const focusFormData = new FormData();
      const focusFile1 = new File([props.blendedImageFile as File], randomName1 + '_focus', {
        type: (props?.blendedImageFile as File)?.type ?? 'image/jpeg',
      });

      focusFormData.append('image', focusFile1);
      await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, focusFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      //bg Image upload
      // if (props.bgImageFile) {
      //   const bgFormData = new FormData();
      //   const newBgFile1 = new File([props.bgImageFile as File], randomName1 + '_bg', {
      //     type: (props?.bgImageFile as File)?.type ?? 'image/jpeg',
      //   });

      //   bgFormData.append('image', newBgFile1);
      //   await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, bgFormData, {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   });
      // } else {
      //   const bgResponse = await axios.get(
      //     bgImageUrl[`${props.bgModel}` as keyof typeof bgImageUrl],
      //     { responseType: 'blob' },
      //   );
      //   const newBgFile1 = new File([bgResponse.data], randomName1 + '_bg', {
      //     type: bgResponse.data.type || 'image/jpeg',
      //   });

      //   const bgFormData = new FormData();
      //   bgFormData.append('image', newBgFile1);
      //   await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, bgFormData, {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   });
      // }

      let positivePrompt = props.prompt;
      let negativePrompt = props.backgroundNegativePrompt + "nsfw, breast, boobs, revealing, vagina, naked, nude, nudity";

      if (!props.isManual) {
        positivePrompt += props.loraPrompt;
      }

      // if (props.isManual) {
      //   const userPrompt = `
      //   ${props.manualModelPrompt.find((item: any) => item.key === 'Is')?.userPrompt ? props.manualModelPrompt.find((item: any) => item.key === 'Is')?.configuredPrompt : ""} ${props.manualModelPrompt.find((item: any) => item.key === 'Is')?.userPrompt ? props.manualModelPrompt.find((item: any) => item.key === 'Is')?.userPrompt + ", " : ""}
      //   ${props.manualModelPrompt.find((item: any) => item.key === 'Color')?.userPrompt ? props.manualModelPrompt.find((item: any) => item.key === 'Color')?.configuredPrompt : ""} ${props.manualModelPrompt.find((item: any) => item.key === 'Color')?.userPrompt ? props.manualModelPrompt.find((item: any) => item.key === 'Color')?.userPrompt + ", " : ""}
      //   ${props.manualModelPrompt.find((item: any) => item.key === 'Gender')?.userPrompt ? props.manualModelPrompt.find((item: any) => item.key === 'Gender')?.configuredPrompt : ""} ${props.manualModelPrompt.find((item: any) => item.key === 'Gender')?.userPrompt ? props.manualModelPrompt.find((item: any) => item.key === 'Gender')?.userPrompt + ", " : ""}
      //   ${props.manualModelPrompt.find((item: any) => item.key === 'Ethnicity')?.userPrompt ? props.manualModelPrompt.find((item: any) => item.key === 'Ethnicity')?.configuredPrompt : ""} ${props.manualModelPrompt.find((item: any) => item.key === 'Ethnicity')?.userPrompt ? props.manualModelPrompt.find((item: any) => item.key === 'Ethnicity')?.userPrompt + ", " : ""}
      //   ${props.manualSurroundingPrompt.find((item: any) => item.key === 'Surrounded by')?.userPrompt ? props.manualSurroundingPrompt.find((item: any) => item.key === 'Surrounded by')?.configuredPrompt : ""} ${props.manualSurroundingPrompt.find((item: any) => item.key === 'Surrounded by')?.userPrompt ? props.manualSurroundingPrompt.find((item: any) => item.key === 'Surrounded by')?.userPrompt + ", " : ""}
      //   ${props.manualBackgroundPrompt.find((item: any) => item.key === 'In front of')?.userPrompt ? props.manualBackgroundPrompt.find((item: any) => item.key === 'In front of')?.configuredPrompt : ""} ${props.manualBackgroundPrompt.find((item: any) => item.key === 'In front of')?.userPrompt ? props.manualBackgroundPrompt.find((item: any) => item.key === 'In front of')?.userPrompt + ", " : ""}
      // `;
      //   const userPrompt = `
      //   a ${props.manualModelPrompt.find((item: any) => item.key === 'Ethnicity')?.userPrompt ?? 'caucasian'} ${props.manualModelPrompt.find((item: any) => item.key === 'Gender')?.userPrompt ?? 'man'} wearing a ${props.productInfo}  surrounded by ${props.manualSurroundingPrompt.find((item: any) => item.key === 'Surrounded by')?.userPrompt ?? 'city'} in front of a ${props.manualBackgroundPrompt.find((item: any) => item.key === 'In front of')?.userPrompt ?? 'fountain'};
      // `;

      const bgChangeRequest = {
        positivePrompt: positivePrompt ?? "",
        negativePrompt: negativePrompt ?? "",
        faceDetailerPrompt: props.faceDetailerPrompt ?? "",

        backgroundLora: props.backgroundLora ? {
          name: props.backgroundLora,
          strength_model: props.backgroundLoraModelStrength ?? 1,
          strength_clip: props.backgroundLoraClipStrength ?? 1,
        } : undefined,

        inputImagePath: "../input/" + props.filename1Ref.current + ".jpg",
        inputMaskImagePath: "../input/" + props.filename1Ref.current + "_mask.jpg",
        inputFocusImagePath: "../input/" + props.filename1Ref.current + "_focus.jpg",
        outputFileName: props.filename1Ref.current,
        generationId: generationIdRef.current,
        inputImageURL: inputImageURLRef.current,
      }

      const promises = Array.from({ length: props.fetchCount }).map(async (_, index: number) => {
        const response = await AxiosProvider.post(`/api/image-generation/apparel?lora=${props.backgroundLora ? true : false}&clientId=${clientId}`, {
          ...bgChangeRequest,
          outputFileNameCount: index + 1,
        });
        // setExecutionIds((prev) => [...prev, response.data.prompt_id]);
        executionIdsRef.current.push(response.data.prompt_id);
        return response;
      });

      Promise.all(promises).then((responses) => {
        responses.forEach((response, index) => {
          if (response.status !== 200) {
            toast.error('Something isn\'t right', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              theme: 'dark',
            });
          } else {
            const filename = props.filename1Ref.current + '_0000' + (index + 1);
            fetchQueueRef.current.push(filename);
            props.setOutputImages((prev) => {
              if (prev.some((item) => item.id === response.data.prompt_id)) {
                return prev;
              }
              prev.push({
                id: response.data.prompt_id,
                src: '',
                fileName: filename,
                progress: 0,
              });
              return prev;
            })
          }
        });
        props.setShouldFetch(true);
      }).catch((error) => {
        props.setIsLoading(false);
        setLockPromptGeneration(false);

        if (error?.response?.data?.error) {
          if (error.response.data.error.includes('InsufficientCredits')) {
            toast.error('Insufficient Credits')
          }
        }
      });
    } catch (error) {
      props.setIsLoading(false);
      console.error('Error:', error);
    } finally {
      setLockPromptGeneration(false);
    }
  };

  const regenerateImage = async (index: number) => {
    if (index === undefined || index < 0) return;
    setLockPromptGeneration(true);
    props.setIsLoading(true);
    try {
      const outputName =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);

      let positivePrompt = props.prompt;
      if (!props.isManual) {
        positivePrompt += props.loraPrompt;
      }

      const bgChangeRequest = {
        positivePrompt: positivePrompt ?? "",
        negativePrompt: "golden hour, sunlight on face, wall background, smooth skin, people in background, high contrast, post processing, national flags, text, watermarks, (deformed iris, deformed pupils, deformed limbs, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck,nsfw, breast, boobs, revealing, vagina, naked, nude, nudity",
        faceDetailerPrompt: props.faceDetailerPrompt ?? "",

        backgroundLora: props.backgroundLora ? {
          name: props.backgroundLora,
          strength_model: props.backgroundLoraModelStrength ?? 1,
          strength_clip: props.backgroundLoraClipStrength ?? 1,
        } : undefined,

        inputImagePath: "../input/" + props.filename1Ref.current + ".jpg",
        inputMaskImagePath: "../input/" + props.filename1Ref.current + "_mask.jpg",
        inputFocusImagePath: "../input/" + props.filename1Ref.current + "_focus.jpg",

        outputFileName: 'regen_' + outputName,
        outputFileNameCount: 1,
        generationId: generationIdRef.current,
        inputImageURL: inputImageURLRef.current,
        regeneration: true,
        originalImageURL: props.outputImages[index].src,
        originalImageFileName: props.outputImages[index].fileName,
      }

      try {
        const response = await AxiosProvider.post(`/api/image-generation/apparel?lora=${props.backgroundLora ? true : false}&clientId=${clientId}`, bgChangeRequest);

        if (response.status === 200) {
          props.setShouldFetch(true);
          const filename = 'regen_' + outputName + '_00001';
          fetchQueueRef.current.push(filename);
          // setExecutionIds((prev) => [...prev, response.data.prompt_id]);
          executionIdsRef.current.push(response.data.prompt_id);
          props.setOutputImages((prev) => {
            prev[index] = {
              id: response.data.prompt_id,
              src: '',
              fileName: filename,
              progress: 0,
            };
            return prev;
          });
        }
      } catch (error: any) {
        if (error?.response?.data?.error) {
          if (error.response.data.error.includes('InsufficientCredits')) {
            toast.error('Insufficient Credits')
          }
        }
        props.setOutputImages((prev) => {
          prev.splice(index, 1);
          return [...prev];
        });
        props.setIsLoading(false);
        props.setShouldFetch(false);
        setLockPromptGeneration(false);
      }
    } catch (e) {
      props.setOutputImages((prev) => {
        prev.splice(index, 1);
        return [...prev];
      });
      props.setIsLoading(false);
      props.setShouldFetch(false);
      console.error('Error:', e);
    } finally {
      setLockPromptGeneration(false);
    }
  };

  const magicFix = async (index: number, whiteMaskFile: any) => {
    if (index === undefined || index < 0) return;
    setLockPromptGeneration(true);
    props.setIsLoading(true);
    props.setShouldFetch(true);
    try {
      const outputName =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
      const newFile1 = new File([whiteMaskFile as File], outputName + '_magicInput', {
        type: (props?.imageFile as File)?.type ?? 'image/jpeg',
      });

      const formData = new FormData();
      formData.append('image', newFile1);
      await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      //output image
      const outputResponse = await axios.get(String(props.outputImages[index].src), {
        responseType: 'blob',
      });
      const newBgFile1 = new File([outputResponse.data], outputName + '_output', {
        type: outputResponse.data.type || 'image/jpeg',
      });

      const outputFormData = new FormData();
      outputFormData.append('image', newBgFile1);
      await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, outputFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const magicFixRequest = {
        inputImagePath: "../input/" + props.filename1Ref.current + ".jpg",
        inputMaskImagePath: "../input/" + outputName + "_magicInput.jpg",
        inputGeneratedImagePath: "../input/" + outputName + "_output.jpg",
        outputFileName: 'magic_' + outputName,
        generationId: generationIdRef.current,
        inputImageURL: inputImageURLRef.current,
        originalImageURL: props.outputImages[index].src,
        originalImageFileName: props.outputImages[index].fileName,
      }

      try {
        const response = await AxiosProvider.post(`/api/image-generation/magic-fix?clientId=${clientId}`, magicFixRequest);

        if (response.status === 200) {
          const filename = 'magic_' + outputName + '_00001';
          fetchQueueRef.current.push(filename);
          // setExecutionIds((prev) => [...prev, response.data.prompt_id]);s
          executionIdsRef.current.push(response.data.prompt_id);
          props.setOutputImages((prev) => {
            prev[index] = {
              id: response.data.prompt_id,
              src: '',
              fileName: filename,
              progress: 0,
            };
            return prev;
          });
        }
      } catch (error: any) {
        if (error?.response?.data?.error) {
          if (error.response.data.error.includes('InsufficientCredits')) {
            toast.error('Insufficient Credits')
          }
        }
        props.setOutputImages((prev) => {
          prev.splice(index, 1);
          return [...prev];
        });
        props.setIsLoading(false);
        props.setShouldFetch(false);
        setLockPromptGeneration(false);
        console.error('Error:', error);
      }
    } catch (e) {
      props.setOutputImages((prev) => {
        prev.splice(index, 1);
        return [...prev];
      });
      props.setIsLoading(false);
      props.setShouldFetch(false);
      console.error('Error:', e);
    } finally {
      setLockPromptGeneration(false);
    }
  };

  const handlePromptChange = function (event: ChangeEvent<HTMLTextAreaElement>) {
    props.promptRef.current = event.target.value;
    props.setPrompt(event.target.value);
  };

  const deleteGenerationImage = async (url: string, index: number) => {
    props.setOutputImages((prev) => {
      const index = prev.findIndex((item) => item.src === url);
      if (index !== -1) {
        prev.splice(index, 1);
      }
      return prev;
    }
    );

    setPreviewImageSrc((prev: any) => {
      delete prev[index];
      return prev;
    });
  };


  return (
    <>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'start',
          marginBottom: 5,
          position: 'relative',
          width: '100%',
        }}
      >
        <Header queue_size={queue_size} />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'flex-start',
          width: '100%',
        }}
      >
        <div
          className="output-image-list"
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
            marginLeft: 15,
            marginRight: 10,
          }}
        >
          {/* <ConversationImageCard
            uploadedImage={"https://hom-devtest.s3.us-east-1.amazonaws.com/vcv43kk16dk87fbkotgfka"}
            key={"outputImage.id"}
            idx={0}
            src={"https://hom-devtest.s3.us-east-1.amazonaws.com/vcv43kk16dk87fbkotgfka_00003.png"}
            alt={"outputImage.fileName"}
            loading={false}
            regenerateImage={regenerateImage}
            magicFix={magicFix}
            setMagicMaskImageFile={props.setMagicMaskImageFile}
            outputImages={[{
              id: "1", src: "https://hom-devtest.s3.us-east-1.amazonaws.com/vcv43kk16dk87fbkotgfka_00003.png", fileName: "outputImage.fileName",
              progress: 0
            },
            {
              id: "2", src: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg", fileName: "outputImage.fileName",
              progress: 0
            },
            ]}
            progress={0}
            setCurrentIndex={setCurrentIndex}
            setVisible={undefined}
          /> */}
          {props.agentInputComponent == "history" ? <>
            {currentHistory?.items?.map((item: any, index: number) => (
              (item.downloadURL && item.downloadURL !== "") &&
              <ConversationHistoryImageCard
                inputImage={currentHistory.inputImageURL}
                key={item.downloadURL}
                idx={index}
                src={item.downloadURL}
                alt={item.downloadURL}
                outputImages={currentHistory.items}
                visible={visible}
                setVisible={setVisible}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />
            ))}
            <ImageEnlargePreview
              uploadedImage={currentHistory.inputImageURL}
              outputImages={currentHistory.items}
              visible={visible}
              setVisible={setVisible}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              isHistory={true}
              previewImageSrc={previewImageSrc}
              setPreviewImageSrc={setPreviewImageSrc}
            />
          </> :
            showImages
              ? <>
                {props.outputImages.map((outputImage, index) => (
                  <ConversationImageCard
                    uploadedImage={props.image}
                    key={outputImage.id}
                    idx={index}
                    src={outputImage.src}
                    alt={outputImage.fileName}
                    loading={outputImage.src.trim() === ''}
                    regenerateImage={regenerateImage}
                    magicFix={magicFix}
                    setMagicMaskImageFile={props.setMagicMaskImageFile}
                    outputImages={props.outputImages}
                    progress={fetchQueueRef.current?.[0] == outputImage.fileName ? progressRef.current : 0}
                    setVisible={setVisible}
                    setCurrentIndex={setCurrentIndex}
                    deleteGenerationImage={deleteGenerationImage}
                  />
                ))}
                <ImageEnlargePreview
                  // uploadedImage={props.image || ""}
                  uploadedImage={inputImageURLRef.current}
                  outputImages={outputImageSrc}
                  visible={visible}
                  setVisible={setVisible}
                  currentIndex={currentIndex}
                  setCurrentIndex={setCurrentIndex}
                  previewImageSrc={previewImageSrc}
                  setPreviewImageSrc={setPreviewImageSrc}
                />
              </>
              : null
          }
        </div>
      </div>
      {props.agentInputComponent != "history" &&
        <PromptInput
          text={props.prompt}
          handlePromptChange={handlePromptChange}
          onGenerateClick={handleCreateImage}
          lockPromptGeneration={lockPromptGeneration}
          isPromptGenLoading={props.isLoading}
          onStopGeneration={onStopGeneration}
          backgroundNegativePrompt={props.backgroundNegativePrompt}
          setBackgroundNegativePrompt={props.setBackgroundNegativePrompt}
          loraPrompt={props.loraPrompt}
          setLoraPrompt={props.setLoraPrompt}
          showCopyButton={false}
        // showCopyButton={props.agentInputComponent == "history"}
        />
      }
      <HotKeys />
    </>
  );
});

export default Conversation;
