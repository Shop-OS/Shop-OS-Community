import { Empty } from 'antd';
import axios from 'axios';
import Image from 'next/image';
import { ChangeEvent, MutableRefObject, memo, useEffect, useState } from 'react';
import { RingLoader } from 'react-spinners';

import Header from '@/components/AgentHeader';
import ConversationImageCard from '@/components/ConversationImageCard';

import ChatInput from './ChatInput';
import HotKeys from './HotKeys';
import PromptInput from './PromptInput';
import outfit_workflow from './workflow_api_outfit_tryon_xl.json';

interface ConversationProps {
  filename1Ref: MutableRefObject<string | undefined>;
  filename2Ref: MutableRefObject<string | undefined>;
  filename3Ref: MutableRefObject<string | undefined>;
  filename4Ref: MutableRefObject<string | undefined>;
  filename5Ref: MutableRefObject<string | undefined>;
  imageFile: File | null;
  isLoading: boolean;
  outputImage?: string;
  outputImage1?: string;
  outputImage2?: string;
  outputImage3?: string;
  outputImage4?: string;
  outputImage5?: string;
  prompt: string;
  promptRef: MutableRefObject<string | undefined>;
  setIsLoading: (isLoading: boolean) => void;
  setOutputImage: (url?: string) => void;
  setOutputImage1: (url?: string) => void;
  setOutputImage2: (url?: string) => void;
  setOutputImage3: (url?: string) => void;
  setOutputImage4: (url?: string) => void;
  setOutputImage5: (url?: string) => void;
  setPrompt: (prompt: string) => void;
  setShouldFetch: (shouldFetch: boolean) => void;
  setTimeSpent: (timeSpent: number) => void;
  shouldFetch: boolean;
  timeSpent: number;
}

const Conversation = memo((props: ConversationProps) => {
  const [selectedImage, setSelectedImage] = useState('');

  const fetchImageByFileName = async (url: string, fetchCount: number) => {
    try {
      const response = await axios.get(url, {
        responseType: 'blob',
      });
      if (response.status === 204) {
        return;
      }

      const blob = new Blob([response.data], { type: 'image/png' });

      const objectURL = URL.createObjectURL(blob);
      if (props.outputImage === undefined) {
        props.setOutputImage(objectURL);
      }
      switch (fetchCount) {
        case 1:
          props.setOutputImage1(objectURL);
          break;
        case 2:
          props.setOutputImage2(objectURL);
          break;
        case 3:
          props.setOutputImage3(objectURL);
          break;
        case 4:
          props.setOutputImage4(objectURL);
          break;
        case 5:
          props.setOutputImage5(objectURL);
          props.setShouldFetch(false);
          break;
      }
      props.setIsLoading(false);
    } catch (error) {
      props.setIsLoading(false);
      console.error('Error:', error);
    }
  };

  const handleCreateImage = async function () {
    props.setOutputImage(undefined);
    props.setIsLoading(true);
    props.setTimeSpent(0);

    try {
      const formData = new FormData();
      const randomName1 =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
      const newFile1 = new File([props.imageFile as File], randomName1, {
        type: (props?.imageFile as File)?.type ?? 'image/jpeg',
      });

      formData.append('image', newFile1);
      props.filename1Ref.current = randomName1;
      await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const promptResponse = await axios.post(
        'https://api.promptperfect.jina.ai/optimize',
        {
          data: {
            prompt: props.prompt,
            targetModel: 'sdxl',
          },
        },
        {
          headers: {
            'x-api-key': `token ${process.env.NEXT_PUBLIC_PROMPT_PERFECT_SECRET}`,
            'content-type': 'application/json',
          },
        },
      );

      const positivePrompt = promptResponse.data.result.promptOptimized
        .replaceAll('\n', ' ')
        .split('Negative')[0];
      const negativePrompt = promptResponse.data.result.promptOptimized
        .replaceAll('\n', ' ')
        .split('Negative prompt:')[1];

      outfit_workflow['74']['inputs']['text'] = positivePrompt ?? '';
      outfit_workflow['75']['inputs']['text'] =
        negativePrompt +
          ', naked, gloves, (deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, elongated neck, (embedding:baddream:1), (embedding:unrealisticdream:1), (embedding:badhands:1), (embedding:betterhands:1), (embedding:fastnegative:1), (embedding:negativehand:1)' ??
        '';
      outfit_workflow['45']['inputs']['image'] = '../input/' + props.filename1Ref.current + '.jpg';
      outfit_workflow['91']['inputs']['filename_prefix'] = props.filename1Ref.current ?? '';
      outfit_workflow['77']['inputs']['seed'] = Math.floor(Math.random() * 1_500_000);

      await axios.post(
        `${process.env.NEXT_PUBLIC_COMFY_API_URL}/prompt?url=${process.env.NEXT_PUBLIC_COMFY_UI_URL}`,
        {
          prompt: outfit_workflow,
        },
      );

      const randomName2 =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
      props.filename2Ref.current = randomName2;

      outfit_workflow['45']['inputs']['image'] = '../input/' + props.filename1Ref.current + '.jpg';
      outfit_workflow['91']['inputs']['filename_prefix'] = props.filename2Ref.current ?? '';
      outfit_workflow['77']['inputs']['seed'] = Math.floor(Math.random() * 1_500_000);
      await axios.post(
        `${process.env.NEXT_PUBLIC_COMFY_API_URL}/prompt?url=${process.env.NEXT_PUBLIC_COMFY_UI_URL}`,
        {
          prompt: outfit_workflow,
        },
      );

      const randomName3 =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
      props.filename3Ref.current = randomName3;

      outfit_workflow['45']['inputs']['image'] = '../input/' + props.filename1Ref.current + '.jpg';
      outfit_workflow['91']['inputs']['filename_prefix'] = props.filename3Ref.current ?? '';
      outfit_workflow['77']['inputs']['seed'] = Math.floor(Math.random() * 1_500_000);
      await axios.post(
        `${process.env.NEXT_PUBLIC_COMFY_API_URL}/prompt?url=${process.env.NEXT_PUBLIC_COMFY_UI_URL}`,
        {
          prompt: outfit_workflow,
        },
      );

      const randomName4 =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
      props.filename4Ref.current = randomName4;

      outfit_workflow['45']['inputs']['image'] = '../input/' + props.filename1Ref.current + '.jpg';
      outfit_workflow['91']['inputs']['filename_prefix'] = props.filename4Ref.current ?? '';
      outfit_workflow['77']['inputs']['seed'] = Math.floor(Math.random() * 1_500_000);
      await axios.post(
        `${process.env.NEXT_PUBLIC_COMFY_API_URL}/prompt?url=${process.env.NEXT_PUBLIC_COMFY_UI_URL}`,
        {
          prompt: outfit_workflow,
        },
      );

      const randomName5 =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
      props.filename5Ref.current = randomName5;

      outfit_workflow['45']['inputs']['image'] = '../input/' + props.filename1Ref.current + '.jpg';
      outfit_workflow['91']['inputs']['filename_prefix'] = props.filename5Ref.current ?? '';
      outfit_workflow['77']['inputs']['seed'] = Math.floor(Math.random() * 1_500_000);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_COMFY_API_URL}/prompt?url=${process.env.NEXT_PUBLIC_COMFY_UI_URL}`,
        {
          prompt: outfit_workflow,
        },
      );

      if (response.status === 200) {
        try {
          setTimeout(() => props.setShouldFetch(true), 1000);
        } catch (error) {
          props.setIsLoading(false);
          console.error('Error:', error);
        }
      }
    } catch (error) {
      props.setIsLoading(false);
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (!props.shouldFetch) return;
    const intervalId = setInterval(() => {
      fetchImageByFileName(
        `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file?filename=${props.filename1Ref.current}`,
        1,
      );
      fetchImageByFileName(
        `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file?filename=${props.filename2Ref.current}`,
        2,
      );
      fetchImageByFileName(
        `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file?filename=${props.filename3Ref.current}`,
        3,
      );
      fetchImageByFileName(
        `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file?filename=${props.filename4Ref.current}`,
        4,
      );
      fetchImageByFileName(
        `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file?filename=${props.filename5Ref.current}`,
        5,
      );
    }, 10_000);

    return () => clearInterval(intervalId);
  }, [props.shouldFetch]);

  const handlePromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    props.promptRef.current = event.target.value;
    props.setPrompt(event.target.value);
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
        <Header />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            // justifyContent: 'space-between',
            width: '100%',
            gap: '1%',
            // rowGap: 10,
            marginLeft: 15,
            marginRight: 10,
          }}
        >
          {[
            props.outputImage1,
            props.outputImage2,
            props.outputImage3,
            props.outputImage4,
            props.outputImage5,
          ].map(
            (img, index) =>
              img && (
                <div key={index}>
                  <ConversationImageCard src={img} alt="" loading={false} />
                </div>
              ),
          )}
          {/* <div style={{ display: 'flex', flex: 1, justifyContent: 'center', width: '100%' }}>
          {props.outputImage ? (
            <div
              style={{
                alignItems: 'center',
                borderRadius: 20,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                marginTop: 10,
                position: 'relative',
                width: '70%',
              }}
            > */}
          {/* <Image alt="Output" height={700} src={props.outputImage} />{' '} */}
          {/* <img
                alt="Output"
                style={{ height: '500px', width: 'auto' }}
                src={props.outputImage}
              />
            </div>
          ) : (
            <div
              style={{
                alignItems: 'center',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                minHeight: '28rem',
                position: 'relative',
                width: '100%',
              }}
            >
              {props.isLoading ? (
                <>
                  <div style={{ position: 'absolute', right: '1rem', top: '0.25rem' }}>
                    {props.timeSpent.toFixed(2)} s
                  </div>
                  <RingLoader color="white" />
                </>
              ) : (
                <Empty
                  description={<span>No Image Generated</span>}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </div>
          )} */}
        </div>
        {/* <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: '10px',
            marginTop: 10,
            marginBottom: 10,
            width: '100%',
          }}
        >
          {[props.outputImage1, props.outputImage2, props.outputImage3, props.outputImage4, props.outputImage5].some(
            (img) => img,
          ) && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: '10px',
                  marginTop: 10,
                  marginBottom: 10,
                  width: '100%',
                }}
              >
                {[props.outputImage1, props.outputImage2, props.outputImage3, props.outputImage4, props.outputImage5].map(
                  (img, index) =>
                    img && (
                      <div
                        key={index}
                        style={{
                          border: selectedImage === img ? '2px solid white' : '1px solid #2E2E2E',
                          borderRadius: '12px',
                          padding: '10px',
                          width: 80,
                          height: 80,
                        }}
                      >
                        <label>
                          <input
                            type="radio"
                            name="image"
                            checked={selectedImage === img}
                            style={{ appearance: 'none', position: 'absolute', opacity: 0 }}
                          />
                          <img
                            alt=""
                            src={img}
                            onClick={() => {
                              props.setOutputImage(img);
                              setSelectedImage(img);
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                            }}
                          />
                        </label>
                      </div>
                    ),
                )}
              </div>
            )}
        </div> */}
      </div>

      {/* <ChatInput handleCreateImage={handleCreateImage} handlePromptChange={handlePromptChange} /> */}
      <PromptInput
        text={props.prompt}
        handlePromptChange={handlePromptChange}
        onGenerateClick={handleCreateImage}
        isPromptGenLoading={props.isLoading}
      />

      <HotKeys />
    </>
  );
});

export default Conversation;
