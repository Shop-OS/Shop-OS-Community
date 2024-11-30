import { Empty } from 'antd';
import axios from 'axios';
import { ChangeEvent, MutableRefObject, memo, useEffect, useState } from 'react';
import { RingLoader } from 'react-spinners';

import Header from '@/components/AgentHeader';
import ConversationImageCard from '@/components/ConversationImageCard';

import ChatInput from './ChatInput';
import HotKeys from './HotKeys';
import PromptInput from './PromptInput';
import bg_workflow from './workflow__bg_change_nodepth_xl_api.json';

interface ConversationProps {
  faceFilenameRef: MutableRefObject<string | undefined>;
  faceImageFile: File | null;
  filenameRef: MutableRefObject<string | undefined>;
  filename1Ref: MutableRefObject<string | undefined>;
  isLoading: boolean;
  prompt: string;
  outputImage?: string;
  outputImage1?: string;
  outputImage2?: string;
  outputImage3?: string;
  outputImage4?: string;
  outputImage5?: string;
  selectedTags: string[];
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
  tags: string[];
  tagsRef: MutableRefObject<string | undefined>;
  timeSpent: number;
}

const Conversation = memo((props: ConversationProps) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [shouldFetch1, setShouldFetch1] = useState(false);
  const [shouldFetch2, setShouldFetch2] = useState(false);
  const [shouldFetch3, setShouldFetch3] = useState(false);
  const [shouldFetch4, setShouldFetch4] = useState(false);
  const [shouldFetch5, setShouldFetch5] = useState(false);

  const fetchImageByFileName = async (url: string, fetchCount: number) => {
    try {
      const response = await axios.get(url, {
        responseType: 'blob',
      });
      if (response.status === 204) {
        return;
      } else if (response.status === 200) {
        switch (fetchCount) {
          case 1:
            setShouldFetch1(false);
            break;
          case 2:
            setShouldFetch2(false);
            break;
          case 3:
            setShouldFetch3(false);
            break;
          case 4:
            setShouldFetch4(false);
            break;
          case 5:
            setShouldFetch5(false);
            break;
        }
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

  const handleCreateImage = async () => {
    props.setOutputImage(undefined);
    props.setIsLoading(true);
    props.setTimeSpent(0);

    try {
      const formData = new FormData();
      const randomName =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
      const newFile = new File([props.faceImageFile as File], randomName, {
        type: (props.faceImageFile as File).type,
      });

      formData.append('image', newFile);
      props.filename1Ref.current =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
      props.faceFilenameRef.current = randomName;
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

      props.tagsRef.current = props.selectedTags.join(', ');
      bg_workflow['6']['inputs']['text'] = props.tagsRef.current + ', ' + positivePrompt ?? '';
      bg_workflow['7']['inputs']['text'] =
        negativePrompt +
          ', (deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, elongated neck, (embedding:baddream:1), (embedding:unrealisticdream:1), (embedding:badhands:1), (embedding:betterhands:1), (embedding:fastnegative:1), (embedding:negativehand:1)' ??
        '';
      bg_workflow['10']['inputs']['image'] = '../input/' + props.filenameRef.current + '.jpg';
      bg_workflow['116']['inputs']['image'] = '../input/' + props.faceFilenameRef.current + '.jpg';
      bg_workflow['45']['inputs']['filename_prefix'] = props.filename1Ref.current ?? '';
      bg_workflow['3']['inputs']['seed'] = Math.floor(Math.random() * 1_500_000);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_COMFY_API_URL}/prompt?url=${process.env.NEXT_PUBLIC_COMFY_UI_URL}`,
        {
          prompt: bg_workflow,
        },
      );

      if (response.status === 200) {
        try {
          setTimeout(() => {
            props.setShouldFetch(true);
            setShouldFetch1(true);
            setShouldFetch2(true);
            setShouldFetch3(true);
            setShouldFetch4(true);
            setShouldFetch5(true);
          }, 1_000);
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
      if (shouldFetch1) {
        fetchImageByFileName(
          `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file?filename=${props.filename1Ref.current + '_00001'}`,
          1,
        );
      }
      if (shouldFetch2) {
        fetchImageByFileName(
          `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file?filename=${props.filename1Ref.current + '_00002'}`,
          2,
        );
      }
      if (shouldFetch3) {
        fetchImageByFileName(
          `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file?filename=${props.filename1Ref.current + '_00003'}`,
          3,
        );
      }
      if (shouldFetch4) {
        fetchImageByFileName(
          `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file?filename=${props.filename1Ref.current + '_00004'}`,
          4,
        );
      }
      if (shouldFetch5) {
        fetchImageByFileName(
          `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file?filename=${props.filename1Ref.current + '_00005'}`,
          5,
        );
      }
    }, 10_000);

    return () => clearInterval(intervalId);
  }, [props.shouldFetch, shouldFetch1, shouldFetch2, shouldFetch3, shouldFetch4, shouldFetch5]);

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
                  <ConversationImageCard src={img} alt="" loading={false} key={index} />
                </div>
              ),
          )}
          {/* {props.outputImage ? (
          <div
            style={{
              alignItems: 'center',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
              width: '100%',
            }}
          > */}
          {/* <Image alt="Output" height={600} src={props.outputImage} />{' '} */}
          {/* <img alt="Output" style={{ height: '500px', width: 'auto' }} src={props.outputImage} />
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
          {[
            props.outputImage1,
            props.outputImage2,
            props.outputImage3,
            props.outputImage4,
            props.outputImage5,
          ].some((img) => img) && (
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
              {[
                props.outputImage1,
                props.outputImage2,
                props.outputImage3,
                props.outputImage4,
                props.outputImage5,
              ].map(
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

      {/* <ChatInput
        handleCreateImage={handleCreateImage}
        handlePromptChange={handlePromptChange}
        tags={props.tags}
      /> */}

      <PromptInput
        text={props.prompt}
        handlePromptChange={handlePromptChange}
        onGenerateClick={handleCreateImage}
        isPromptGenLoading={props.isLoading}
        tags={props.tags}
      />
      <HotKeys />
    </>
  );
});

export default Conversation;
