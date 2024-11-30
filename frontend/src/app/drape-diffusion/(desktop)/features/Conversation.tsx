import axios from 'axios';
import {
  ChangeEvent,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  memo,
  use,
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
import PromptInput from './PromptInput';
import ConversationImageCard from '@/components/ConversationImageCard';
import ImageEnlargePreview from '@/components/ImageEnlargePreview/ImageEnlargePreview';
import HotKeys from './HotKeys';
import useOutfit from '../../provider/useOutfit';
import { ootdModelTemplateList } from '@/const/dataConst';
import { set } from 'js-cookie';

interface ConversationProps {
  agentInputComponent: string;
  image: string | null;
  filename1Ref: MutableRefObject<string | undefined>;
  imageFile: File | null;
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
  ootdType: string;
}


export type vtonOutputImage = {
  id: number;
  src: string;
  progress: number;
  isLoading: boolean;
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

  const { generationIdRef, currentHistory } = useOutfit();
  const inputImageURLRef = useRef<string>("");
  const modelImageURLRef = useRef<string>("");

  const [progress, setProgress] = useState(0);
  // const progressRef = useRef(0);
  const [trackProgress, setTrackProgress] = useState(false);
  const [outputImageSrc, setOutputImageSrc] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { selectedBackgroundTemplate, previewImageSrc, setPreviewImageSrc, maskImageFile } = useOutfit();

  const [vtonOutputImages, setVtonOutputImages] = useState<vtonOutputImage[]>([]);

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
    setOutputImageSrc(vtonOutputImages.map((item) => item.src).filter((item) => item !== ''));
  }, [JSON.stringify(vtonOutputImages)]);


  const simulateProgress = async () => {
    try {
      // const queue = await axios.get(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/get-queue`);
      // const runningExecutions = queue.data.queue_running;
      // const execs = runningExecutions.map((exec: any) => exec[1]);


      // if (!execs.some((id: string) => executionIdsRef.current.includes(id)) && progressRef.current === 0) {
      //   // setOutputText('You are in queue');

      // } else {  
      //   if (progressRef.current < 30) {
      //     // setOutputText('Processing the scene');
      //   } else if (progressRef.current < 60) {
      //     // setOutputText('Preparing for generation');
      //   } else if (progressRef.current < 90) {
      //     // setOutputText('Generating image');
      //   } else {
      //     // setOutputText('Applying final touch');
      //   }

      setVtonOutputImages((prev) => {
        const newArray = prev.map((item) => {
          if (item.isLoading) {
            let prog = item.progress + Math.floor(Math.random() * 4) + 4;

            if (prog > 99) {
              prog = 99;
            }
            return {
              ...item,
              progress: prog,
            };
          } else {
            return item;
          }
        });
        return newArray;
      });

      let prog = progress + Math.floor(Math.random() * 4) + 4;
      if (prog > 99) {
        prog = 99;
      }
      setProgress(prog);
      // progressRef.current = prog;
      // }
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

  // useEffect(() => {
  //   if (props.shouldFetch) {
  //     const interval = setInterval(async () => {
  //       const item = getItemToBeFetched();
  //       if (!item) return;
  //       fetchImageByFileName(
  //         `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file/v3?filename=${item}&generationId=${generationIdRef.current}`,
  //         item,
  //       );
  //     }, 5_000);

  //     return () => clearInterval(interval);
  //   }
  // }, [props.shouldFetch]);


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

    if (selectedBackgroundTemplate === undefined || selectedBackgroundTemplate === null) {
      toast.error('Select the Model to generate an image', {
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
    // progressRef.current = 0;
    setProgress(0);
    try {
      //cloth image
      const formData = new FormData();
      const randomName1 =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
      console.log("first random name", randomName1)
      const newFile1 = new File([props.imageFile as File], randomName1, {
        type: (props?.imageFile as File)?.type ?? 'image/jpeg',
      });

      formData.append('image', newFile1);
      props.filename1Ref.current = randomName1;
      const response = await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image/v2`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      inputImageURLRef.current = response.data.downloadURL;

      //model image
      const bgImageUrl = ootdModelTemplateList.find((item) => item.id === selectedBackgroundTemplate)?.image || "";

      console.log("first bg image url", bgImageUrl);

      const bgResponse = await axios.get(bgImageUrl, { responseType: 'blob' });
      const newBgFile1 = new File([bgResponse.data], randomName1 + '_bg', {
        type: bgResponse.data.type || 'image/jpeg',
      });

      const bgFormData = new FormData();
      bgFormData.append('image', newBgFile1);
      const result = await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image/v2`, bgFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const payloadData = {
        inputPersonImageURL: result.data.downloadURL,
        inputClothImageURL: inputImageURLRef.current,

        inputPersonImagePath: "../input/" + props.filename1Ref.current + `_bg.jpg`,
        inputClothImagePath: "../input/" + props.filename1Ref.current + `.jpg`,

        outputFileName: props.filename1Ref.current,
        generationId: generationIdRef.current,
      }

      const promises = Array.from({ length: props.fetchCount }).map(async (_, index: number) => {
        const response = await AxiosProvider.post(`/api/image-generation/bg_change_o?clientId=${clientId}&target=${props.ootdType}`, {
          ...payloadData,
          outputFileNameCount: index + 1,
        });
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
        if (error.response.data?.error) {
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

  const handlePromptChange = function (event: ChangeEvent<HTMLTextAreaElement>) {
    props.promptRef.current = event.target.value;
    props.setPrompt(event.target.value);
  };
  const generateReplicateImage = async function () {
    if (props.isLoading) return;
    setLockPromptGeneration(true);
    setVtonOutputImages([]);
    props.setIsLoading(true);

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

    if (props.prompt === "") {
      toast.error('Please enter the description', {
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

    if ((selectedBackgroundTemplate === undefined || selectedBackgroundTemplate === null) && props.bgImageFile === null) {
      toast.error('Select the Model to generate an image', {
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
    if (!maskImageFile) {
      toast.error('Please upload a mask image', {
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
    setProgress(0);
    setOutputImageSrc([]);
    // progressRef.current = 0;

    try {
      //cloth image
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



      //mask image
      const maskformData = new FormData();
      const maskFile1 = new File([maskImageFile as File], randomName1 + "_mask", {
        type: (props?.imageFile as File)?.type ?? 'image/jpeg',
      });

      console.log("first random name", maskformData)

      maskformData.append('image', maskFile1);
      const maskResponse = await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, maskformData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setVtonOutputImages([
        {
          id: 0,
          src: '',
          progress: 0,
          isLoading: true,
        },
        {
          id: 1,
          src: '',
          progress: 0,
          isLoading: true,
        },
        {
          id: 2,
          src: '',
          progress: 0,
          isLoading: true,
        },
        {
          id: 3,
          src: '',
          progress: 0,
          isLoading: true,
        },
      ]);

      //  uploaded model image
      if (props.bgImageFile) {
        const bgFormData = new FormData();
        const newBgFile1 = new File([props.bgImageFile as File], randomName1 + '_bg', {
          type: (props?.bgImageFile as File)?.type ?? 'image/jpeg',
        });

        bgFormData.append('image', newBgFile1);
        const result = await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, bgFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        modelImageURLRef.current = result.data.downloadURL;
      } else {

        //model image
        const bgImageUrl = ootdModelTemplateList.find((item) => item.id === selectedBackgroundTemplate)?.image || "";

        console.log("first bg image url", bgImageUrl);

        const bgResponse = await axios.get(bgImageUrl, { responseType: 'blob' });
        const newBgFile1 = new File([bgResponse.data], randomName1 + '_bg', {
          type: bgResponse.data.type || 'image/jpeg',
        });

        const bgFormData = new FormData();
        bgFormData.append('image', newBgFile1);
        const result = await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, bgFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        modelImageURLRef.current = result.data.downloadURL;
      }

      const payload = {
        "category": props.ootdType,
        "mask_img": maskResponse.data.downloadURL,
        "garm_img": inputImageURLRef.current,
        "human_img": modelImageURLRef.current,
        "garment_des": props.prompt,
      }

      // for (let i = 0; i < props.fetchCount; i++) {
      //   setTrackProgress(true);
      //   setCurrentVton(i);
      //   // progressRef.current = 0;
      //   setProgress(0);
      //   const response = await AxiosProvider.post(`/api/vton/create`, payload);
      //   setVtonOutputImages((prev) => {
      //     const newArray = prev.map((item) => {
      //       if (item.id === i) {
      //         return {
      //           ...item,
      //           src: response.data.output,
      //           isLoading: false,
      //         };
      //       } else {
      //         return item;
      //       }
      //     });
      //     return newArray;
      //   });
      // }

      const promises = Array.from({ length: props.fetchCount }).map(async (_, i: number) => {
        setTrackProgress(true);
        const response = await AxiosProvider.post(`/api/vton/create`, payload);
        // executionIdsRef.current.push(response.data.prompt_id);  
        setVtonOutputImages((prev) => {
          const newArray = prev.map((item) => {
            if (item.id === i) {
              return {
                ...item,
                src: response.data.output,
                isLoading: false,
              };
            } else {
              return item;
            }
          });
          return newArray;
        });
        return response;
      });


      // setTrackProgress(false);

      Promise.all(promises).then((responses) => {
        props.setShouldFetch(false);
        props.setIsLoading(false);
        setLockPromptGeneration(false);
        setTrackProgress(false);
      }).catch((error) => {
        props.setShouldFetch(false);
        props.setIsLoading(false);
        setLockPromptGeneration(false);
        setTrackProgress(false);
        if (error.response.data?.error) {
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

  const deleteGenerationImage = async (url: string, index: number) => {
    setVtonOutputImages((prev: any) => {
      const index = prev.findIndex((item: any) => item.src === url);
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
        <Header queue_size={queue_size} showQueueSize={false} />
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
          {props.agentInputComponent == "history" ? <>
            {currentHistory?.items?.map((item: any, index: number) => (
              (item.downloadURL && item.downloadURL !== "") &&
              <ConversationHistoryImageCard
                inputImage={currentHistory.inputClothImageURL}
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
              uploadedImage={currentHistory.inputClothImageURL}
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
                {vtonOutputImages.map((outputImage, index) => (
                  <ConversationImageCard
                    uploadedImage={props.image}
                    key={outputImage.id}
                    idx={index}
                    src={outputImage.src}
                    alt={outputImage.id.toString()}
                    loading={outputImage.isLoading}
                    regenerateImage={null}
                    magicFix={null}
                    setMagicMaskImageFile={props.setMagicMaskImageFile}
                    outputImages={props.outputImages}
                    progress={outputImage.progress}
                    // progress={currentVton === index ? progress : 0}
                    setVisible={setVisible}
                    setCurrentIndex={setCurrentIndex}
                    deleteGenerationImage={deleteGenerationImage}
                  />
                ))}
                <ImageEnlargePreview
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
          onGenerateClick={generateReplicateImage}
          lockPromptGeneration={lockPromptGeneration}
          isPromptGenLoading={props.isLoading}
          onStopGeneration={onStopGeneration}
          backgroundNegativePrompt={props.backgroundNegativePrompt}
          setBackgroundNegativePrompt={props.setBackgroundNegativePrompt}
          showCopyButton={false}
        // showCopyButton={props.agentInputComponent == "history"}
        />
      }
      <HotKeys />
    </>
  );
});

export default Conversation;
