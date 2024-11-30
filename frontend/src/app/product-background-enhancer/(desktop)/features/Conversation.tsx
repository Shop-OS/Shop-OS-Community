import { Progress } from 'antd';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
import AxiosProvider from '@/utils/axios';

import { generateTemplatePrompt } from '..';
import ConversationImageCard from '../../components/ConversationImageCard';
import CanvasEditorFabric from './CanvasEditor/CanvasEditorFabric';
import {
  createCanvasMask2,
  createTransparentMask2,
  takeCanvasScreenshot2,
} from './CanvasEditor/canvasEditorFabricHelpers';
import HotKeys from './HotKeys';
import PromptInput from './PromptInput';
import useProductBG from '../../provider/useProductBG';
import ConversationHistoryImageCard from '@/components/ConversationHistoryImageCard';
import ImageEnlargePreview from '@/components/ImageEnlargePreview/ImageEnlargePreview';

interface ConversationProps {
  agentInputComponent: string;
  filename1Ref: MutableRefObject<string | undefined>;
  image: string | null;
  imageFile: File | null;
  setImageFile: Dispatch<SetStateAction<File | null>>;
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
  outputImages: string[];
  faceDetailerPrompt: string;
  setOutputImages: Dispatch<SetStateAction<string[]>>;
  modelLora: string | undefined;
  isManual: boolean;
  manualModelPrompt: any;
  manualSurroundingPrompt: any;
  manualBackgroundPrompt: any;
  selectedTemplateForCanvas: any;
  // canvasRef: any;
  template: any;
  productPrompt: string;
  canvasImageFile: File | null;
  bgImageFile: File | null;
  bgReferencePrompt: string;
  elementsRef: MutableRefObject<any>;
  renderStrength: number;
}

const Conversation = memo((props: ConversationProps) => {
  const fetchQueueRef = useRef<string[]>([]);
  const [canvasEditedImage, setCanvasEditedImage] = useState('');
  const [outputImage, setOutputImage] = useState<string>();
  const [preOutputImage, setPreOutputImage] = useState<any>([]);
  const [canvasRef, setCanvasRef] = useState<any>('');
  const canvasDataRef = useRef<any>();
  const fabricRef: any = useRef(null);
  const executionIdsRef = useRef<string[]>([]);
  const socket = useRef<any>(null);
  const [clientId, setClientId] = useState<string>();
  const [queue_size, setQueueSize] = useState(0);
  const [bnwImageFile, setBnwImageFile] = useState<File | null>(null);
  const [focusImageFile, setFocusImageFile] = useState<File | null>(null);
  const [canvasImageFile, setCanvasImageFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [trackProgress, setTrackProgress] = useState(false);
  const [elementRemovalCount, setElementRemovalCount] = useState(0);
  const [showCarouselLoadingBlock, setShowCarouselLoadingBlock] = useState(false);
  const [failedCount, setFailedCount] = useState(0);
  const [outputText, setOutputText] = useState('You are in queue');
  const [textLength, setTextLength] = useState(outputText.length);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const canvasProductImageRef = useRef<any>(null);
  const [loadingBlockCount, setLoadingBlockCount] = useState(0);
  const [currentLoadingSelected, setCurrentLoadingSelected] = useState(0);
  const [lockPromptGeneration, setLockPromptGeneration] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { generationIdRef, currentHistory, previewImageSrc, setPreviewImageSrc } = useProductBG();

  useEffect(() => {
    setTextLength(outputText.length);
  }, [outputText]);

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

  const fetchImageByFileName = async (url: string, imageFileName: string) => {
    try {
      const response = await AxiosProvider.get(url);
      if (response.status === 204) {
        return;
      } else if (response.status === 200) {
        // setTrackProgress(false);
        // fetchQueueRef.current = fetchQueueRef.current.filter(
        //   (filename) => filename !== imageFileName,
        // );

        if (imageFileName.startsWith('final')) {
          setProgress(99);

          fetchQueueRef.current.shift();
          setPreOutputImage((prev: any) => {
            if (!prev.includes(response.data.downloadURL)) {
              return [...prev, response.data.downloadURL];
            } else {
              return prev;
            }
          });
          setTimeout(() => {
            setOutputImage(response.data.downloadURL);
          }, 100);
          props.setIsLoading(false);
          // setShowCarouselLoadingBlock(false);
          setLoadingBlockCount(prev => prev - 1);
          setProgress(0);
          // executionIdsRef.current = [];
          if (fetchQueueRef.current.length === 0) {
            props.setShouldFetch(false);
            setShowCarouselLoadingBlock(false);
            setTrackProgress(false)
          }
        } else {
          setOutputImage(response.data.downloadURL);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      props.setIsLoading(false);
      setShowCarouselLoadingBlock(false);
    }
  };

  const onStopGeneration = async function () {
    try {
      setLockPromptGeneration(true);
      const queue = await axios.get(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/get-queue`);
      const runningExecutions = queue.data.queue_running;
      const pendingExecutions = queue.data.queue_pending;

      executionIdsRef.current.forEach(async (id) => {
        pendingExecutions.forEach((exec: any) => {
          if (exec[1] === id) {
            axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/delete-queue-item`, {
              delete: [id],
            });
          }
        });
        runningExecutions.forEach((exec: any) => {
          if (exec[1] === id) {
            axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/interrupt`, {
              execution_id: exec[0],
            });
          }
        });
      });

      for (let i = 0; i <= pendingExecutions.length; i++) {
        let filename = `final_${props.filename1Ref.current}_0000${4 - i}`;
        await AxiosProvider.delete(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/api/generations/remove?generationId=${generationIdRef.current}&filename=${filename}`);
      }

      executionIdsRef.current = [];
      props.setIsLoading(false);
      setShowCarouselLoadingBlock(false);
      props.setShouldFetch(false);
      setLockPromptGeneration(false);
    } catch (error) {
      props.setIsLoading(false);
      setLockPromptGeneration(false);
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const prompt = generateTemplatePrompt({
      product: props.productPrompt,
      elements: props.elementsRef.current,
      referenceImage: props.bgReferencePrompt,
    });
    props.setPrompt(prompt);
  }, [
    props.productPrompt,
    props.elementsRef.current,
    props.bgReferencePrompt,
    elementRemovalCount,
  ]);

  const generateCanvasEditedImage = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    setCanvasEditedImage(dataUrl);
  };

  function dataURLToBlob(dataUrl: any) {
    let arr = dataUrl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  const simulateProgress = async () => {
    try {
      const queue = await axios.get(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/get-queue`);
      const runningExecutions = queue.data.queue_running;
      const execs = runningExecutions.map((exec: any) => exec[1]);

      if (!execs.some((id: string) => executionIdsRef.current.includes(id)) && progress === 0) {
        setOutputText('You are in queue');
      } else {
        if (progress < 30) {
          setOutputText('Processing the scene');
        } else if (progress < 60) {
          setOutputText('Preparing for generation');
        } else if (progress < 90) {
          setOutputText('Generating image');
        } else {
          setOutputText('Applying final touch');
        }

        setProgress((prev) => {
          const newProgress = prev + Math.floor(Math.random() * 4) + 4;
          return newProgress > 99 ? 99 : newProgress;
        });
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
  }, [trackProgress, progress]);

  const handleCreateImage = async function () {
    if (!props.imageFile) {
      toast.error('Please upload a product image.');
      return;
    }

    if (!props.productPrompt) {
      toast.error('Please describe the product.');
      return;
    }

    if (!props.isManual) {
      if (!props.template?.image) {
        toast.error('Please select a theme.');
        return;
      }
    } else {
      if (!props.bgImageFile) {
        toast.error('Please upload a reference image.');
        return;
      }
    }

    if (!canvasProductImageRef.current) {
      toast.error('Please add product image to the canvas.');
      return;
    }

    setLockPromptGeneration(true);
    setProgress(0);
    setTrackProgress(true);
    fetchQueueRef.current = [];
    setOutputImage('');
    setLoadingBlockCount(props.fetchCount);
    setShowCarouselLoadingBlock(true);
    props.setOutputImages([]);
    props.setIsLoading(true);
    props.setTimeSpent(0);

    try {
      const formData = new FormData();
      const randomName1 =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);

      // let dataUrl = canvasRef.current.toDataURL("image/png");
      let canvasObj = document.getElementById('fabricToCanvasData');
      if (canvasObj) {
        canvasObj.click();
      }

      // Convert canvas the data URL to a Blob full canvas
      let blob = dataURLToBlob(canvasDataRef.current);

      const productFile = new File([blob as File], randomName1 + '_product', {
        type: (props?.imageFile as File)?.type ?? 'image/jpg',
      });

      formData.append('image', productFile);
      props.filename1Ref.current = randomName1;
      const response = await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      //if upload bg ref image
      if (props.isManual) {
        const bgFormData = new FormData();
        const newBgFile1 = new File([props.bgImageFile as File], randomName1 + '_ref', {
          type: (props?.bgImageFile as File)?.type ?? 'image/jpeg',
        });

        bgFormData.append('image', newBgFile1);
        await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, bgFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        //if select bg ref image
        const bgRef = await axios.get(`${props.template.image}`, { responseType: 'blob' });
        const newBgFile1 = new File([bgRef.data], randomName1 + '_ref', {
          type: bgRef.data.type || 'image/jpeg',
        });

        const bgFormData = new FormData();
        bgFormData.append('image', newBgFile1);
        await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, bgFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      // Black n White Image
      const bnwFile = await createCanvasMask2(fabricRef.current);
      const newBmWFile1 = new File([bnwFile], randomName1 + '_bw', {
        type: (bnwFile as File)?.type || 'image/png',
      });

      const bnwFormData = new FormData();
      bnwFormData.append('image', newBmWFile1);
      await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, bnwFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Focus Image
      const focusFile = await createTransparentMask2(fabricRef.current);
      const newFocusFile1 = new File([focusFile], randomName1 + '_focus', {
        type: (focusFile as File)?.type || 'image/png',
      });

      const focusFormData = new FormData();
      focusFormData.append('image', newFocusFile1);
      await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, focusFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Canvas Image
      const canvasFile = await takeCanvasScreenshot2(fabricRef.current);
      const newCanvasFile1 = new File([canvasFile], randomName1 + '_product', {
        type: (canvasFile as File)?.type || 'image/png',
      });

      const canvasFormData = new FormData();
      canvasFormData.append('image', newCanvasFile1);
      await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, canvasFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const bgChangeRequest = {
        prompt: props.prompt,
        inputProductImagePath: '../input/' + props.filename1Ref.current + '_product' + `.jpg`,
        backgroundRefImagePath: '../input/' + props.filename1Ref.current + '_ref' + '.jpg',
        inputBlackAndWhiteImagePath: '../input/' + props.filename1Ref.current + '_bw' + '.jpg',
        inputFocusImagePath: '../input/' + props.filename1Ref.current + '_focus' + '.jpg',
        outputFileName: 'final_' + props.filename1Ref.current,
        renderStrength: props.renderStrength,
        generationId: generationIdRef.current,
        inputImageURL: response.data.downloadURL,
      }

      const promises = Array.from({ length: props.fetchCount }).map(async (_, index: number) => {
        const response = await AxiosProvider.post(`/api/image-generation/product?clientId=${clientId}`, {
          ...bgChangeRequest,
          outputFileNameCount: index + 1,
        });
        executionIdsRef.current = [...executionIdsRef.current, response.data.prompt_id];
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
            const filename = "final_" + props.filename1Ref.current + '_0000' + (index + 1);
            if (!fetchQueueRef.current.includes(filename)) {
              fetchQueueRef.current.push(filename);
            }            // props.setOutputImages((prev) => {
            //   if (prev.some((item) => item.id === response.data.prompt_id)) {
            //     return prev;
            //   }
            //   prev.push({
            //     id: response.data.prompt_id,
            //     src: '',
            //     fileName: filename,
            //   });
            //   return prev;
            // })
          }
          props.setShouldFetch(true);
        });
      }).catch((error) => {
        props.setIsLoading(false);
        setShowCarouselLoadingBlock(false);
        props.setShouldFetch(false);
        setLockPromptGeneration(false);
        if (error?.response?.data?.error) {
          if (error.response.data.error.includes('InsufficientCredits')) {
            toast.error('Insufficient Credits')
          }
        }
      });;


      // const response = await AxiosProvider.post(`/api/image-generation/product?clientId=${clientId}`, bgChangeRequest);

      // if (response.status === 200) {
      //   try {
      //     executionIdsRef.current = [...executionIdsRef.current, response.data.prompt_id];
      //     props.setShouldFetch(true);
      //     for (let i = 1; i <= props.fetchCount; i++) {
      //       // fetchQueueRef.current.push("inter_" + props.filename1Ref.current + '_0000' + i);
      //       fetchQueueRef.current.push('final_' + props.filename1Ref.current + '_0000' + i);
      //     }
      //   } catch (error) {
      //     props.setIsLoading(false);
      //     setShowCarouselLoadingBlock(false);
      //     console.error('Error:', error);
      //   }
      // }
    } catch (error) {
      props.setIsLoading(false);
      setShowCarouselLoadingBlock(false);
      console.error('Error:', error);
    } finally {
      setLockPromptGeneration(false);
    }
  };

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

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
          if (failedCount < 4) {
            setFailedCount((prev) => prev + 1);
            return;
          } else {
            executionIdsRef.current = [];
            props.setIsLoading(false);
            props.setShouldFetch(false);
            clearInterval(interval);
          }
        }
      }, 20_000);

      return () => clearInterval(interval);
    }
  }, [props.isLoading, props.shouldFetch]);

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
    if (props.shouldFetch === false) return;
    const intervalId = setInterval(() => {
      console.log(fetchQueueRef.current, 'fetchQueueRef.current')
      const item = getItemToBeFetched();
      if (!item) return;
      fetchImageByFileName(
        `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file/v2?filename=${item}&generationId=${generationIdRef.current}`,
        item);
    }, 4_000);

    return () => clearInterval(intervalId);
  }, [props.shouldFetch]);

  const handlePromptChange = function (event: ChangeEvent<HTMLTextAreaElement>) {
    props.promptRef.current = event.target.value;
    props.setPrompt(event.target.value);

    // handleCreateImage();
  };

  const getCanvasFile = async () => {
    const dataUrl = canvasRef.current.toDataURL('image/png');

    const fetchResponse = await fetch(dataUrl);
    const blob = await fetchResponse.blob();
    const file = new File([blob], 'canvas.png', { type: 'image/png' });

    // // Create new image element
    // let img = new Image();
    // img.src = dataUrl;

    // // Append the image to the body (or any other element)
    // // Create a link element
    // let link = document.createElement('a');
    // link.download = 'canvas.png';
    // link.href = dataUrl;

    // // Trigger a click on the link to start the download
    // link.click();
  };

  return (
    <>
      <div
        style={{
          alignItems: 'center',
          // borderBottom: '1px solid #2E2E2E',
          display: 'flex',
          // height: '50px',
          justifyContent: 'start',
          marginBottom: 5,
          // padding: '5px',
          position: 'relative',
          width: '100%',
        }}
      >
        <Header queue_size={queue_size} />
      </div>

      <div
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          width: '100%',
          maxWidth: '100%',
        }}
      >
        <div style={{
          display: `${props.agentInputComponent == "history" ? 'flex' : 'none'}`,
        }}>
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
          </div>
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
        </div>
        <div style={{
          display: `${props.agentInputComponent !== "history" ? 'flex' : 'none'}`,
        }}>
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '10px',
                padding: '20px 16px',
                overflow: 'auto',
              }}
            >
              <div
                style={{
                  backgroundColor: '#1f1f1f',
                  borderRadius: 10,
                  width: '490px',
                  height: '490px',
                  display: `${(props.canvasImageFile || props.elementsRef.current.length > 0) ? 'block' : 'none'}`,
                }}
              >
                <CanvasEditorFabric
                  fabricRef={fabricRef}
                  imageFile={props.canvasImageFile}
                  templatefiles={props.selectedTemplateForCanvas}
                  setCanvasData={canvasDataRef}
                  elementsRef={props.elementsRef}
                  setElementRemovalCount={setElementRemovalCount}
                  setImageFile={props.setImageFile}
                  canvasProductImageRef={canvasProductImageRef}
                  isOutputGenerating={props.isLoading}
                />
              </div>
              {(outputImage || props.isLoading) &&
                <>
                  <div
                    style={{
                      backgroundColor: '#1f1f1f',
                      borderRadius: 10,
                      width: '490px',
                      height: '490px',
                      position: 'relative',
                    }}
                  >

                    <ConversationImageCard
                      key={outputImage}
                      src={outputImage ? outputImage : ''}
                      alt=""
                      loading={false}
                      onDelete={() => {
                        console.log(
                          currentImageIndex,
                          preOutputImage.length,
                          preOutputImage,
                          preOutputImage[currentImageIndex - 1],
                        );
                        if (preOutputImage.length >= 1) {
                          if (currentImageIndex == 0) {
                            setOutputImage(preOutputImage[currentImageIndex + 1]);
                          } else {
                            setOutputImage(preOutputImage[currentImageIndex - 1]);
                          }
                        } else {
                          setOutputImage('');
                        }
                        setPreOutputImage((prev: any) => prev.filter((img: any) => img !== outputImage));
                      }}
                    />
                    {props.isLoading && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          bottom: 0,
                          left: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#1f1f1f',
                          opacity: 0.5,
                          borderRadius: 10,
                        }}
                      >
                        <Progress type="circle" percent={currentLoadingSelected === 0 ? progress : 0} size={80} strokeColor={'white'} />
                        <div style={{ marginTop: 15 }}>
                          {currentLoadingSelected === 0 ? outputText : "You are in queue"}
                          <span className="typewriter">&hellip;</span>
                        </div>
                        <style jsx>
                          {`
                    .typewriter {
                      overflow: hidden;
                      white-space: nowrap;
                      letter-spacing: 0.05em;
                      padding-top: 8px;
                      animation:
                        typing 0.75s steps(3, end) alternate infinite,
                        blink-caret 0.3s step-end infinite;
                    }

                    @keyframes typing {
                      0% {
                        width: 0;
                      }

                      80% {
                        width: 3ch;
                      }

                      100% {
                        width: 3ch;
                      }
                    }
                  `}
                        </style>
                        {/* <Spin style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#1f1f1f',
                  opacity: 0.5,
                  borderRadius: 10
                }}
                  indicator={<LoadingOutlined style={{ fontSize: 54 }} spin ></LoadingOutlined>}
                /> */}
                        {/* <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  padding: 5,
                  backgroundColor: '#1f1f1f',
                  color: 'white',
                  borderRadius: '0 0 10px 0'
                }}>
                  {progress} %
                </span> */}
                      </div>
                    )}
                  </div>
                </>
              }
            </div>
            <div style={{ display: 'none' }} id="dummyButton"></div>
          </>
        </div>
      </div >
      {
        props.agentInputComponent != "history" && <>
          {(preOutputImage.length > 0 || showCarouselLoadingBlock) && (
            <div style={{ width: '90%', margin: '1px auto' }}>
              <ImageCarousel
                images={preOutputImage}
                outputImage={outputImage}
                setOutputImage={setOutputImage}
                setIsLoading={props.setIsLoading}
                showLoadingBlock={showCarouselLoadingBlock}
                progress={progress}
                setCurrentImageIndex={setCurrentImageIndex}
                loadingBlockCount={loadingBlockCount}
                currentLoadingSelected={currentLoadingSelected}
                setCurrentLoadingSelected={setCurrentLoadingSelected}
              />
            </div>
          )}
        </>
      }
      {
        props.agentInputComponent != "history" &&
        <PromptInput
          text={props.prompt}
          handlePromptChange={handlePromptChange}
          onGenerateClick={handleCreateImage}
          isPromptGenLoading={props.isLoading || showCarouselLoadingBlock}
          onStopGeneration={onStopGeneration}
          lockPromptGeneration={lockPromptGeneration}
          showCopyButton={false}
        // showCopyButton={props.agentInputComponent == "history"}
        />
      }
      <HotKeys />
    </>
  );
});

export default Conversation;

const ImageCarousel = ({
  images,
  outputImage,
  setOutputImage,
  setIsLoading,
  showLoadingBlock,
  progress,
  setCurrentImageIndex,
  loadingBlockCount,
  currentLoadingSelected,
  setCurrentLoadingSelected,
}: any) => {
  const scrollRef = useRef<any>(null);

  const scroll = (scrollOffset: any) => {
    scrollRef.current.scrollLeft += scrollOffset;
  };

  return (
    <div style={{ margin: '0px auto', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          height: '100px',
          alignItems: 'center',
          display: 'flex',
          cursor: 'pointer',
        }}
        onClick={() => scroll(-500)}
      >
        <ChevronLeft />
      </div>
      <div
        ref={scrollRef}
        style={{
          overflowX: 'auto',
          display: 'flex',
          margin: '0px 20px',
          maxWidth: '80vw',
          scrollbarWidth: 'none', // For Firefox
          msOverflowStyle: 'none', // For Internet Explorer and Edge
        }}
      >
        {images.map((image: any, index: any) => (
          <img
            key={index}
            src={image}
            alt={`carousel ${index}`}
            style={{
              borderRadius: '10px',
              border: outputImage === image ? '2px solid white' : 'none',
              minWidth: '100px',
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              margin: '2px',
              opacity: outputImage === image ? 1 : 0.5,
            }}
            onClick={() => {
              setOutputImage(image);
              setIsLoading(false);
              setCurrentImageIndex(index);
              setCurrentLoadingSelected(undefined)
            }}
          />
        ))}
        {showLoadingBlock && (
          Array.from({ length: loadingBlockCount }).map((_, index) => (
            <div
              key={index}
              style={{
                borderRadius: '10px',
                minWidth: '100px',
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                margin: '2px',
                backgroundColor: '#1f1f1f',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                border: currentLoadingSelected === index ? '2px solid white' : 'none',
              }}
              onClick={() => {
                setOutputImage('');
                setIsLoading(true);
                setCurrentLoadingSelected(index);
              }}
            >
              <>
                <Progress type="circle" percent={index == 0 ? progress : 0} size={40} strokeColor={'white'} />
              </></div>
          )))}
        {/* <div
          style={{
            borderRadius: '10px',
            minWidth: '100px',
            width: '100px',
            height: '100px',
            objectFit: 'cover',
            margin: '2px',
            backgroundColor: '#1f1f1f',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            border: outputImage === '' ? '2px solid white' : 'none',
          }}
          onClick={() => {
            setOutputImage('');
            setIsLoading(true);
          }}
        >
          <Progress type="circle" percent={progress} size={40} strokeColor={'white'} />
        </div> */}
      </div>

      <div
        style={{
          height: '100px',
          alignItems: 'center',
          display: 'flex',
          cursor: 'pointer',
        }}
        onClick={() => scroll(500)}
      >
        <ChevronRight />
      </div>
    </div>
  );
};
