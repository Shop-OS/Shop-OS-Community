import {
  CloseOutlined,
  CloudUploadOutlined,
  GatewayOutlined,
  LoadingOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { client } from '@gradio/client';
import { ActionIcon, Icon, TextArea } from '@lobehub/ui';
import {
  Button,
  Collapse,
  ConfigProvider,
  Divider,
  Empty,
  Modal,
  Radio,
  Slider,
  Space,
  Spin,
  Switch,
  Upload,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import Input from 'antd/es/input/Input';
import axios from 'axios';
import { set } from 'lodash';
import { LucideLoader2, Sparkles, StopCircle, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Center } from 'react-layout-kit';
import { toast } from 'react-toastify';

import ConversationImageCard from '../../components/ConversationImageCard';
import { useStyles } from '../styles';
import AxiosProvider from '@/utils/axios';
import { f } from 'nuqs/dist/serializer-_rJbONuT';
import { file } from 'jszip';
import useTextTo3D from '../../provider/useTextTo3D';
import { a } from 'vitest/dist/suite-UrZdHRff';
import { t } from 'i18next';
import { fetchCredits } from '@/helpers/url';
const apiKey = 'tsk_aqffLkyxeWNl7bz2-xBX47pC0QusaN2LBTYtDFVStIP'
interface AgentAssetsProps {
  theme: any;
  loading: any;
  upload: any;
  fileList: any;
  handleChange: any;
  handlePreview: any;
  handleCancel: any;
  previewOpen: any;
  previewTitle: any;
  previewImage: any;
  setFileList: any;
}

const AgentAssets: React.FC<AgentAssetsProps> = ({
  theme,
  loading,
  upload,
  fileList,
  handleChange,
  handlePreview,
  handleCancel,
  previewOpen,
  previewTitle,
  previewImage,
  setFileList,
}) => {
  const { styles } = useStyles();
  const fetchQueueRef = useRef<string[]>([]);
  const generationIdRef = useRef<string>("");
  const [uploadType, setUploadType] = React.useState('');
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [productText, setProductText] = useState('');
  const [textImageUrl, setTextImageUrl] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [foregroundRatio, setForegroundRatio] = useState(0.85);
  const [resolution, setResolution] = useState(256);
  const [isFromText, setIsFromText] = useState(false);

  const [isImageGenerateBtnActive, setIsImageGenerateBtnActive] = useState(false);
  const [isGenerateBtnActive, setIsGenerateBtnActive] = useState(false);
  // const [executionIds, setExecutionIds] = useState<string[]>([]);
  const executionIdsRef = useRef<string[]>([]);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [progress, setProgress] = useState(0);
  const [trackProgress, setTrackProgress] = useState(false);


  const { outputImages, setOutputImages, imageFile, setImageFile, is3DLoading, setIs3DLoading } = useTextTo3D();
  const inputUrlRef = useRef<string>('');
  const inputImageNameRef = useRef<string>('');

  const progressText = (progress: number) => {
    if (progress == 0) {
      return 'You are in queue';
    }
    if (progress < 30) {
      return 'Processing the scene';
    } else if (progress < 60) {
      return 'Preparing for generation';
    } else if (progress < 90) {
      return 'Generating image';
    } else {
      return 'Applying final touch';
    }
  }

  // const generateImageSDXL = async () => {
  //   if (productText) {
  //     setIsGeneratingImage(true);
  //     setIsGenerateBtnActive(false);
  //     const app = await client('ByteDance/SDXL-Lightning', {});
  //     const result = await app.predict('/generate_image', [
  //       productText + ', single object, white background', // string  in 'Enter your prompt (English)' Textbox component
  //       '4-Step', // string  in 'Select inference steps' Dropdown component
  //     ]);
  //     //@ts-ignore
  //     setTextImageUrl(result?.data?.[0].url);
  //     setIsGeneratingImage(false);
  //     setIsGenerateBtnActive(true);
  //     setIsImageGenerateBtnActive(false);
  //   }
  // };
  const generateImage = async () => {
    if (productText) {
      setIsGeneratingImage(true);
      setIsGenerateBtnActive(false);

      const result = await axios.postForm("https://api.stability.ai/v2beta/stable-image/generate/sd3", {
        prompt: productText + ', single object, white background',
        model: "sd3",
        aspect_ratio: "1:1"
      }, {
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SD3_API_KEY}`
        }
      })

      if (result.status === 200) {
        setTextImageUrl("data:image/jpeg;base64," + result.data.image);
        setIsGeneratingImage(false);
        setIsGenerateBtnActive(true);
        setIsImageGenerateBtnActive(false);
      } else {
        setIsGeneratingImage(false);
        setIsGenerateBtnActive(true);
        toast.error('Something went wrong while generating image');
      }

      //@ts-ignore
      // setTextImageUrl(result?.data?.[0].url);
      // setIsGeneratingImage(false);
      // setIsGenerateBtnActive(true);
      // setIsImageGenerateBtnActive(false);
    }
  };

  const generate3DImage = async () => {
    if (!textImageUrl && !imageFile) {
      toast.error('Please generate or upload image first');
      return;
    }

    let checkCredits = await fetchCredits(5);
    if (!checkCredits) {
      toast.error('Insufficient Credits');
      return;
    }

    let inputImage;

    if (isFromText) {
      if (textImageUrl) {
        inputImage = await fetchImageAsBlob(textImageUrl);
      } else if (imageFile) {
        inputImage = imageFile;
      } else {
        toast.error('Please generate image first');
        return;
      }
    } else {
      if (imageFile) {
        inputImage = imageFile;
      } else if (textImageUrl) {
        inputImage = await fetchImageAsBlob(textImageUrl);
      } else {
        toast.error('Please upload image first');
        return;
      }
    }

    const randomId =
      Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
    generationIdRef.current = randomId;

    try {
      setIs3DLoading(true);
      setIsGeneratingImage(false);

      const outputName =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
      inputImageNameRef.current = outputName;

      const fileType = (inputImage as File)?.type ?? 'image/jpeg';
      const newFile1 = new File([inputImage as File], outputName + '_input', {
        type: fileType,
      });

      const formData = new FormData();
      formData.append('image', newFile1);
      const result = await AxiosProvider.post(`/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      inputUrlRef.current = result.data.downloadURL;

      tripoSR3D(inputImage);
      tripo3dFromImage(inputImage);
      // meshyImageto3D(inputImage);
      comfyTo3D(inputImage);
      instantMesh(inputImage);

      setIs3DLoading(false);
    } catch (error) {
      setIs3DLoading(false);
      setIsGenerateBtnActive(true);
      toast.error('Something went wrong while generating 3D image');
    }
  };

  const instantMesh = async (inputImage: File) => {
    try {
      setOutputImages((prev: any) => {
        return {
          ...prev,
          "instantMesh": {
            url: "",
            isLoading: true,
            progress: 0,
            outputText: "You are in queue"
          }
        }
      });
      const app = await client(process.env.NEXT_PUBLIC_INSTANT_MESH_GRADIO_URL!, {});
      let data = new FormData();
      const randomName =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
      data.append('files', inputImage, `${randomName}.png`);

      setOutputImages((prev: any) => {
        return {
          ...prev,
          "instantMesh": {
            url: "",
            isLoading: true,
            progress: 20,
            outputText: "Processing the scene"
          }
        }
      });

      let b64 = await getBase64(inputImage);

      setOutputImages((prev: any) => {
        return {
          ...prev,
          "instantMesh": {
            url: "",
            isLoading: true,
            progress: 43,
            outputText: "Preparing for generation"
          }
        }
      });

      const result = await app.predict(2, [b64, true]);
      console.log("first result", result);

      setOutputImages((prev: any) => {
        return {
          ...prev,
          "instantMesh": {
            url: "",
            isLoading: true,
            progress: 65,
            outputText: "Preparing for generation"
          }
        }
      });

      //@ts-ignore
      const result2 = await app.predict(3, [result.data[0], 75, 42]);
      console.log("first result2", result2);

      setOutputImages((prev: any) => {
        return {
          ...prev,
          "instantMesh": {
            url: "",
            isLoading: true,
            progress: 80,
            outputText: "Generating 3d"
          }
        }
      });

      const result3 = await app.predict(4, [null]);

      //@ts-ignore
      let glbUrl = `${process.env.NEXT_PUBLIC_INSTANT_MESH_GRADIO_URL}/file=${result3.data[2].name}`;
      console.log("first result3", glbUrl);

      setOutputImages((prev: any) => {
        return {
          ...prev,
          "instantMesh": {
            url: glbUrl,
            isLoading: false,
            progress: 100,
            outputText: "Applying final touch"
          }
        }
      });

    } catch (error) {
      console.log("error in instant mesh", error);
      setIs3DLoading(false);
      setOutputImages((prev: any) => {
        return {
          ...prev,
          "instantMesh": {
            url: "",
            isLoading: false,
            progress: 0,
            error: true
          }
        }
      });
      return null;
    }
  }


  function correctPadding(base64String: any) {
    // Calculate the number of missing padding '=' characters
    let missingPadding = base64String.length % 4;
    if (missingPadding) {
      // Add the necessary number of '=' to ensure the length of the string is a multiple of 4
      base64String += '='.repeat(4 - missingPadding);
    }
    return base64String;
  }


  const tripoSR3D = async (inputImage: File) => {
    try {
      setOutputImages((prev: any) => {
        return {
          ...prev,
          "tripoSR": {
            url: "",
            isLoading: true,
            progress: 0,
            outputText: "You are in queue"
          }
        }
      });
      const app = await client(process.env.NEXT_PUBLIC_GRADIO_URL!, {});
      let data = new FormData();
      const randomName =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
      data.append('files', inputImage, `${randomName}.png`);

      setOutputImages((prev: any) => {
        return {
          ...prev,
          "tripoSR": {
            url: "",
            isLoading: true,
            progress: 20,
            outputText: "Processing the scene"
          }
        }
      });

      const response = await axios.post(`${process.env.NEXT_PUBLIC_GRADIO_URL}/upload`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setOutputImages((prev: any) => {
        return {
          ...prev,
          "tripoSR": {
            url: "",
            isLoading: true,
            progress: 40,
            outputText: "Preparing for generation"
          }
        }
      });


      let payload = {
        path: response.data[0],
        url: null,
        orig_name: `${randomName}.png`,
        size: null,
        mime_type: null,
      };

      const result = await app.predict('/preprocess', [
        payload, // blob in 'Input Image' Image component
        true, // boolean  in 'Remove Background' Checkbox component
        foregroundRatio, // number (numeric value between 0.5 and 1.0) in 'Foreground Ratio' Slider component
      ]);

      setOutputImages((prev: any) => {
        return {
          ...prev,
          "tripoSR": {
            url: "",
            isLoading: true,
            progress: 65,
            outputText: "Preparing for generation"
          }
        }
      });

      const result2 = await app
        .predict('/generate', [
          //@ts-ignore
          result.data?.[0],
          resolution,
        ])
        .catch((error) => {
          toast.error('Error generating 3D image');
          setIs3DLoading(false);
          setIsGenerateBtnActive(true);
        });

      setOutputImages((prev: any) => {
        return {
          ...prev,
          "tripoSR": {
            url: "",
            isLoading: true,
            progress: 80,
            outputText: "Generating 3d"
          }
        }
      });

      //@ts-ignore
      let obj3dResponse = await fetchGlbAsBase64(result2.data?.[1].path);
      // setModel3DUrl(obj3dResponse.downloadURL);
      setOutputImages((prev: any) => {
        return {
          ...prev,
          "tripoSR": {
            url: obj3dResponse?.downloadURL,
            isLoading: false,
            progress: 100,
            outputText: "Applying final touch"
          }
        }
      });
    } catch (error) {
      console.log("error in tripoSR3D", error);
      setIs3DLoading(false);
      setOutputImages((prev: any) => {
        return {
          ...prev,
          "tripoSR": {
            url: "",
            isLoading: false,
            progress: 0,
            error: true
          }
        }
      });
      return null;
    }
  }


  const tripo3dFromText = async () => {

    const taskResult = await AxiosProvider.post("api/text-to-3d//tripo3d", {
      prompt: "a large elephant"
    });

    if (taskResult.status === 200) {
      const taskId = taskResult.data.task_id;

      await fetchTripo3dTask(taskId);


    } else {
      console.error('Error fetching task result');
    }
  }

  const tripo3dFromImage = async (inputImage: File) => {
    try {
      setOutputImages((prev: any) => {
        return {
          ...prev,
          "tripo3D": {
            url: "",
            isLoading: true,
            progress: 0,
            outputText: "You are in queue"
          }
        }
      });

      const formData = new FormData();
      const fileExtension = (inputImage as File)?.name.split('.').pop();

      const randomName1 =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15) + "." + fileExtension;
      const newFile = new File([inputImage as File], randomName1, {
        type: (inputImage as File)?.type ?? 'image/png',
      });

      formData.append('image', newFile);
      formData.append('generationId', generationIdRef.current);
      formData.append('inputImageURL', inputUrlRef.current);

      const taskResult = await AxiosProvider.post("api/image-to-3d/tripo3d", formData);

      if (taskResult.status === 200) {
        const taskId = taskResult.data.task_id;

        await fetchTripo3dTask(taskId);
        // await fetchTripo3dTask("0119881c-b104-40ca-95fe-a664c2e7bc70");
      } else {
        console.error('Error fetching task result');
        setOutputImages((prev: any) => {
          return {
            ...prev,
            "tripo3D": {
              url: "",
              isLoading: false,
              progress: 0,
              error: true
            }
          }
        });
      }

    } catch (error) {
      setOutputImages((prev: any) => {
        return {
          ...prev,
          "tripo3D": {
            url: "",
            isLoading: false,
            progress: 0,
            error: true
          }
        }
      });
      console.log("first task error", error);
      return null;
    }
  }

  const fetchTripo3dTask = async (taskId: string) => {
    try {
      const result = await AxiosProvider.get(`api/image-to-3d/tripo3d/${taskId}?generationId=${generationIdRef.current}`, {});
      let outPutText = progressText(result.data.progress);
      if (result.data.success === true) {
        if (result.data.progress === 100) {
          setOutputImages((prev: any) => {
            return {
              ...prev,
              "tripo3D": {
                url: result.data.result,
                isLoading: false,
                progress: 100,
                outputText: "Done"
              }
            }
          });
          // setModel3DUrl(result.data.result.model.url);
        } else {
          setOutputImages((prev: any) => {
            return {
              ...prev,
              "tripo3D": {
                url: "",
                isLoading: true,
                progress: result.data.progress,
                outputText: outPutText
              }
            }
          });
          setTimeout(() => {
            fetchTripo3dTask(taskId);
          }, 2000);
        }
      } else {
        setTimeout(() => {
          fetchTripo3dTask(taskId);
        }, 5000);
      }
    } catch (error) {
      setOutputImages((prev: any) => {
        return {
          ...prev,
          "tripo3D": {
            url: "",
            isLoading: false,
            progress: 0,
            error: true
          }
        }
      });
      console.error('Error fetching task result');
    }
  }

  const meshyImageto3D = async (inputImage: File) => {
    try {
      setOutputImages((prev: any) => {
        return {
          ...prev,
          "meshy": {
            url: "",
            isLoading: true,
            progress: 0,
            outputText: "You are in queue",
          }
        }
      }
      );

      const formData = new FormData();
      const fileExtension = (inputImage as File)?.name.split('.').pop();

      const randomName1 =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15) + "." + fileExtension;
      const newFile = new File([inputImage as File], randomName1, {
        type: (inputImage as File)?.type ?? 'image/png',
      });

      formData.append('image', newFile);
      formData.append('generationId', generationIdRef.current);
      formData.append('inputImageURL', inputUrlRef.current);

      const taskResult = await AxiosProvider.post("api/image-to-3d/meshy", formData);

      if (taskResult.status === 200) {
        const taskId = taskResult.data.task_id;

        await fetchMeshyTask(taskId);
      } else {
        console.error('Error fetching task result');
      }
    } catch (error) {
      setOutputImages((prev: any) => {
        return {
          ...prev,
          "meshy": {
            url: "",
            isLoading: false,
            progress: 0,
            error: true
          }
        }
      });
      console.log("error in meshyImageto3D", error);
      return null;
    }
  };

  const fetchMeshyTask = async (taskId: string) => {
    try {
      const result = await AxiosProvider.get(`api/image-to-3d/meshy/${taskId}?generationId=${generationIdRef.current}`, {});
      console.log(result.data);
      let outPutText = progressText(result.data.progress);

      if (result.data.success === true) {
        if (result.data.progress === 100) {
          setOutputImages((prev: any) => {
            return {
              ...prev,
              "meshy": {
                url: result.data.result,
                isLoading: false,
                progress: 100,
                outputText: "Done"
              }
            }
          });
        } else {
          setOutputImages((prev: any) => {
            return {
              ...prev,
              "meshy": {
                url: "",
                isLoading: true,
                progress: result.data.progress,
                outputText: outPutText
              }
            }
          });
          setTimeout(() => {
            fetchMeshyTask(taskId);
          }, 5000);
        }
      } else {
        setTimeout(() => {
          fetchMeshyTask(taskId);
        }, 5000);
        console.log("in queue")
      }
    } catch (error) {
      setOutputImages((prev: any) => {
        return {
          ...prev,
          "meshy": {
            url: "",
            isLoading: false,
            progress: 0,
            error: true,
          }
        }
      });
      console.error('Error fetching task result');
    }
  }

  async function fetchImageAsBlob(imageUrl: any) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      const imageBlob = await response.blob();

      const fileExtension = imageUrl.split('.').pop();

      // Create a new File object with a filename and extension
      const file = new File([imageBlob], `filename.${fileExtension}`, { type: imageBlob.type });

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => { };
      return file;
    } catch (error) {
      console.error('Error fetching image as blob:', error);
      return null;
    }
  }

  async function comfyTo3D(inputImage: File) {
    try {
      setTrackProgress(true);
      setProgress(0);
      setOutputImages((prev: any) => {
        return {
          ...prev,
          "comfy": {
            url: "",
            isLoading: true,
            progress: 0,
            outputText: "You are in queue"
          }
        }
      });

      try {
        const response = await AxiosProvider.post(`api/3d-generation/image_to_3d`, {
          "inputImageURL": inputUrlRef.current,
          "inputImagePath": "../input/" + inputImageNameRef.current + "_input.jpg",
          "outputFileName": `${inputImageNameRef.current}_output`,
          "generationId": generationIdRef.current,
        });

        // setExecutionIds((prev: any) => {
        //   return [...prev, response.data.prompt_id];
        // }
        // );

        executionIdsRef.current.push(response.data.prompt_id);

        if (response.status !== 200) {
          toast.error('Something isn\'t right', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            theme: 'dark',
          });
        } else {
          const filename = `${inputImageNameRef.current}_output_00001.gif`;
          fetchQueueRef.current.push(filename);
          setOutputImages((prev: any) => {
            return {
              ...prev,
              "comfy": {
                url: "",
                isLoading: true,
                progress: 0,
                generationId: generationIdRef.current,
                promptId: response.data.prompt_id,
                fileName: `${inputImageNameRef.current}_output`
              }
            }
          });
        }
        setShouldFetch(true);
      } catch (error: any) {
        if (error.response.data?.error) {
          if (error.response.data.error.includes('InsufficientCredits')) {
            toast.error('Insufficient Credits')
          }
        }
        setOutputImages((prev: any) => {
          return {
            ...prev,
            "comfy": {
              url: "",
              isLoading: false,
              progress: 0,
              error: true
            }
          }
        });
      }

    } catch (error) {
      console.error('Error converting image to 3D:', error);
    }
  }

  const getItemToBeFetched = () => {
    if (fetchQueueRef.current.length > 0) {
      const item = fetchQueueRef.current[0];
      return item;
    } else {
      setShouldFetch(false);
      return null;
    }
  }

  useEffect(() => {
    if (shouldFetch) {
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
  }, [shouldFetch]);

  const fetchImageByFileName = async (url: string, imageFileName: string) => {
    try {
      const response = await AxiosProvider.get(url);
      if (response.status === 204) {
        return;
      } else if (response.status === 200) {
        fetchQueueRef.current.shift();
        // setProgress(99);
        //set in outputImages comfy object
        setOutputImages((prev: any) => {
          return {
            ...prev,
            //update only url and isLoading pick other values from previous state
            "comfy": {
              ...prev.comfy,
              url: response.data.downloadURL,
              isLoading: false,
              progress: 100,
            }
          }
        });
        if (fetchQueueRef.current.length === 0) {
          setTrackProgress(false)
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const simulateProgress = async () => {
    try {
      const queue = await axios.get(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/get-queue`);
      const runningExecutions = queue.data.queue_running;
      const execs = runningExecutions.map((exec: any) => exec[1]);

      if (!execs.some((id: string) => executionIdsRef.current.includes(id)) && progress === 0) {
        setOutputImages((prev: any) => {
          return {
            ...prev,
            "comfy": {
              url: "",
              isLoading: true,
              progress: 0,
              outputText: "You are in queue"
            }
          }
        });
      } else {

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
      let outPutText = progressText(progress);
      setOutputImages((prev: any) => {
        return {
          ...prev,
          "comfy": {
            url: "",
            isLoading: true,
            progress: progress,
            outputText: outPutText
          }
        }
      });
      interval = setInterval(() => {
        simulateProgress();
      }, 2000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [trackProgress, progress]);


  async function fetchGlbAsBase64(fileName: any) {
    try {
      const url = `${process.env.NEXT_PUBLIC_TRIPOSR_API}/getglb?seed=${fileName}`;
      const response = await axios.post(url);

      return response.data;
      // Convert ArrayBuffer to base64
      // const base64 = Buffer.from(response.data, 'binary').toString('base64');
      // return base64;
    } catch (error) {
      console.error('Error fetching GLB as base64:', error);
    }
  }

  const getBase64 = (file: any): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  useEffect(() => {
    if (productText) {
      setIsImageGenerateBtnActive(true);
    } else {
      setIsImageGenerateBtnActive(false);
    }
  }, [productText]);

  function renderContent() {
    if (loading && uploadType === 'direct') {
      return (
        <Center height={36} width={36}>
          <Icon
            color={theme.colorTextSecondary}
            icon={LucideLoader2}
            size={{ fontSize: 18 }}
            spin
          ></Icon>
        </Center>
      );
    } else if (fileList.length >= 1) {
      return null;
    } else {
      return (
        <div
          style={{
            alignItems: 'center',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            margin: 'auto',
            border: '1px solid #2a2a2a',
            borderRadius: '10px',
            padding: '12px ',
            background: '#1F1F1F',
            fontSize: '14px',
            fontFamily: 'BDO Grotesk, sans-serif',
          }}
        >
          <CloudUploadOutlined style={{ color: '#989494', fontSize: "18px" }} />
          <span style={{ color: '#989494', marginLeft: '10px', fontWeight: 500 }}>
            Upload your file
          </span>
        </div>
      );
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <div style={{ padding: '20px' }}>
        <ConfigProvider
          theme={{
            components: {
              Collapse: {
                contentBg: '#000000',
                headerBg: '#000000',
                fontFamily: 'BDO Grotesk, sans-serif',
              },
            },
          }}
        >
          <Collapse
            defaultActiveKey={['2']}
            onChange={() => {
              setIsFromText(true);
            }}
            bordered={false}
            expandIconPosition="end"
            items={[
              {
                key: '2',
                label: 'Text to 3D',
                children: (
                  <>
                    <div
                      style={{
                        borderRadius: '10px',
                        bottom: 5,
                        display: 'flex',
                        justifyContent: 'between',
                        left: '10%',
                        margin: 'auto',
                        width: '100%',
                      }}
                    >
                      <TextArea
                        autoFocus
                        onBlur={(e) => {
                          setProductText(e.target.value);
                        }}
                        onChange={(e) => {
                          setProductText(e.target.value);
                        }}
                        onPressEnter={(e) => {
                          if (e.shiftKey) return;

                          // eslint-disable-next-line unicorn/consistent-function-scoping
                          const send = () => {
                            // avoid inserting newline when sending message.
                            // refs: https://github.com/lobehub/lobe-chat/pull/989
                            e.preventDefault();
                            generateImage();
                          };

                          isImageGenerateBtnActive && send();
                        }}
                        placeholder="Eg. an artistic sword"
                        showCount={false}
                        size="large"
                        value={productText}
                        className="textarea"
                        type={'pure'}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        style={{
                          background: '#151515',
                          padding: '10px',
                          fontSize: '14px',
                          borderRadius: '10px',
                        }}
                      />
                    </div>
                    {textImageUrl && (
                      <div style={{ paddingTop: '14px' }}>
                        <ConversationImageCard
                          key={textImageUrl}
                          src={textImageUrl}
                          alt=""
                          loading={isGeneratingImage}
                        />
                      </div>
                    )}
                    {isGeneratingImage && (
                      <Spin
                        style={{
                          height: '250px',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#151515',
                          borderRadius: 10,
                          margin: '20px 0 0',
                        }}
                        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
                      />
                    )}
                    <div style={{ padding: '16px 0 0' }}>
                      <Button
                        onClick={() => {
                          isImageGenerateBtnActive && generateImage();
                        }}
                        size="large"
                        type={'primary'}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          justifyContent: 'center',
                          background: !isImageGenerateBtnActive ? '#FFFFFF1C' : 'white',
                        }}
                      >
                        <div
                          style={{
                            color: !isImageGenerateBtnActive ? '#9A9A9A' : 'black',
                            fontFamily: 'BDO Grotesk, sans-serif',
                          }}
                        >
                          {isGeneratingImage ? 'Generating...' : 'Generate'}
                        </div>
                      </Button>
                    </div>
                  </>
                ),
              },
            ]}
          ></Collapse>
          <div style={{ padding: '10px' }}></div>
          <Collapse
            defaultActiveKey={[]}
            onChange={(value) => {
              setIsFromText(false);
            }}
            bordered={false}
            items={[
              {
                key: '1',
                label: 'Image to 3D',
                children: (
                  <>
                    {/* <ImgCrop showGrid rotationSlider aspectSlider showReset modalTitle='Remove Background' modalOk='Remove'> */}

                    <Upload
                      accept="image/*"
                      beforeUpload={async (file) => {
                        // setFileUploadLoading(true);
                        await upload(file);
                        setImageFile(file);
                        setIsGenerateBtnActive(true);
                        // removeProductBackground(file);
                        // await handleCreateImage(file);
                        setUploadType('direct');
                        return false;
                      }}
                      listType="picture"
                      className={styles.upload}
                      onRemove={(file) => {
                        setImageFile(null);
                      }}
                      showUploadList={{
                        removeIcon: <Trash2 size={16} style={{ marginTop: "2px" }} />,
                      }}
                      multiple={false}
                      onChange={handleChange}
                      onPreview={handlePreview}
                      fileList={fileList}
                      disabled={fileUploadLoading}
                    // itemRender={(originNode, file, currFileList) => {
                    //   return (
                    //     <ImagePreview
                    //       file={imageFile}
                    //       onRemove={() => {
                    //         setImageFile(null);
                    //         setFileList([]);
                    //       }}
                    //     />
                    //   );
                    // }}
                    >
                      {fileUploadLoading ? (
                        <div
                          style={{
                            alignItems: 'center',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            width: '100%',
                            border: '1px solid #2a2a2a',
                            borderRadius: '10px',
                            padding: '12px 63.5px 12px 63.5px',
                            background: '#1F1F1F',
                          }}
                        >
                          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                          <span style={{ paddingLeft: '18px' }}>Uploading...</span>
                        </div>
                      ) : loading && uploadType === 'direct' ? (
                        <Center height={36} width={36}>
                          <Icon
                            color={theme.colorTextSecondary}
                            icon={LucideLoader2}
                            size={{ fontSize: 18 }}
                            spin
                          ></Icon>
                        </Center>
                      ) : (renderContent()
                      )}
                    </Upload>
                    {/* </ImgCrop> */}
                  </>
                ),
              },
            ]}
            expandIconPosition="end"
          ></Collapse>
        </ConfigProvider>
      </div>
      <Modal footer={null} onCancel={handleCancel} open={previewOpen} title={previewTitle}>
        <img
          alt="example"
          height={500}
          src={previewImage}
          width={470}
          style={{ objectFit: 'contain' }}
        />
      </Modal>

      {/* <div style={{ marginLeft: 20, marginRight: 20, }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "white" }}>
            Foreground Ratio
          </span>
          <span>
            {foregroundRatio}
          </span>
        </div>
        <Slider
          min={0.5}
          max={1}
          step={0.05}
          onChange={(value) => {
            setForegroundRatio(value);
          }}
          value={foregroundRatio}
        />

        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px" }}>
          <span style={{ color: "white" }}>
            Resolution
          </span>
          <span>
            {resolution}
          </span>
        </div>

        <Slider
          min={32}
          max={320}
          step={5}
          onChange={(value) => {
            setResolution(value);
          }}
          value={resolution}
        />
      </div> */}
      <div style={{ padding: '20px', marginTop: 'auto' }}>
        {/* <div onClick={() => {
          // meshyImageto3D();
          fetchMeshyTask("018e7e3a-ed54-747c-83af-a39dc7f8570b");
        }}>
          Meshy
        </div> */}
        <Button
          onClick={() => {
            isGenerateBtnActive && generate3DImage();
          }}
          size="large"
          type={'primary'}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'center',
            background: !isGenerateBtnActive ? '#FFFFFF1C' : 'white',
          }}
          loading={false}
        >
          <span
            style={{
              color: !isGenerateBtnActive ? '#9A9A9A' : 'black',
              fontFamily: 'BDO Grotesk, sans-serif',
            }}
          >
            {is3DLoading ? 'Converting...' : 'Convert to 3D'}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default AgentAssets;

function ImagePreview({ file, onRemove }: any) {
  const [src, setSrc] = useState<any>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!file) {
      setSrc('');
      return;
    }
    setIsLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSrc(reader?.result || '');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }, [file]);

  return isLoading ? (
    <>
      <Spin
        style={{
          height: '250px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#151515',
          borderRadius: 10,
          margin: '20px 0 0',
        }}
        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
      />
    </>
  ) : (
    <div
      style={{
        borderRadius: 10,
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#151515',
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
      <CloseOutlined
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          fontSize: '16px',
          color: '#707070',
          cursor: 'pointer',
          padding: '6px',
          border: '0.63px solid #2A2A2A',
          borderRadius: '8px',
        }}
        onClick={() => {
          setSrc('');
          onRemove();
        }}
      />
    </div>
  );
}
