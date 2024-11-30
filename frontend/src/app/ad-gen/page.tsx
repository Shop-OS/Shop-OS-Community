'use client';

import { useControls, useCreateStore } from '@lobehub/ui';
import { Player } from '@remotion/player';
import { storage } from '@root/firebase.config';
import axios from 'axios';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import html2canvas from 'html2canvas';
// import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import { RingLoader } from 'react-spinners';

import imageWorkflow from '../ad-gen/workflows/workflow_svd_image_api.json';
import videoWorkflow from '../ad-gen/workflows/workflow_svd_video_api.json';
import '../globals.css';
import PromptInput from './(desktop)/PromptInput';
import SideBar from './(desktop)/SideBar';
import Layout from './(desktop)/layout.desktop';
import Canvas from './components/Canvas';
import { RenderControls } from './components/RenderControls';
import Header from './features/AgentHeader';
import { Main } from './remotion/MyComp/Main';
import useImageStore from './store/ImageStore';
import {
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  defaultMyCompProps,
} from './types/constants';

const container = {
  borderRadius: 'var(--geist-border-radius)',
  // boxShadow: '0 0 200px rgba(0, 0, 0, 0.15)',
  boxShadow: 'none',
  height: '100%',
  margin: 'auto',
  // marginBottom: 20,
  // marginTop: 10,
  // padding: 20,
  // overflow: 'hidden',
  width: 768,
};

const player = {
  backgroundImage:
    'linear-gradient(to right, #111111 1px, transparent 1px), linear-gradient(to bottom, #111111 1px, transparent 1px)',
  backgroundSize: '5px 5px',
  border: '1px dashed rgb(46, 46, 46)',
  borderRadius: '12px',
  width: '85%',
};

function extractLinks(text: string) {
  const urlRegex = /(https?:\/\/\S+)/g;
  return text.match(urlRegex);
}

const Page = () => {
  const store = useCreateStore();
  const [logoSrc, setLogoSrc] = useState(defaultMyCompProps.logoSrc);
  const [productSrc, setProductSrc] = useState(defaultMyCompProps.productSrc);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPromptGenLoading, setIsPromptGenLoading] = useState(false);
  const [text, setText] = useState<string>('');
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const shouldFetchRef1 = useRef<boolean>(false);
  const shouldFetchRef2 = useRef<boolean>(false);
  const shouldFetchRef3 = useRef<boolean>(false);
  const shouldFetchRef4 = useRef<boolean>(false);
  const shouldFetchRef5 = useRef<boolean>(false);
  const filenameRef = useRef<string>();
  const filename1Ref = useRef<string>();

  const mixtralFileRef = useRef<string | null>(null);
  const svdPromptRef = useRef(null);
  const canvasRef = useRef(null);

  const { variant }: any = useControls(
    {
      variant: {
        options: ['default', 'compact'],
        value: 'compact',
      },
    },
    { store },
  );

  const {
    selectedLogo,
    setCopyText,
    copyText,
    setTaglines,
    selectedProduct,
    backgroundImage,
    backgroundVideo,
    selectedOption,
    setSelectedOption,
    setBackgroundImage,
    setBackgroundImage1,
    setBackgroundImage2,
    setBackgroundImage3,
    setBackgroundImage4,
    setBackgroundImage5,
    setBackgroundVideo,
    setBackgroundVideo1,
    setBackgroundVideo2,
    setBackgroundVideo3,
    setBackgroundVideo4,
    setBackgroundVideo5,
    setLoadingCopyText,
    setLoadingBackgroundVideo,
    setLoadingBackgroundImage,
  } = useImageStore();

  const inputProps = useMemo(() => {
    console.log(selectedLogo, selectedProduct, backgroundImage, backgroundVideo, copyText);
    return {
      backgroundImage: backgroundImage ? backgroundImage : undefined,
      backgroundVideo: backgroundVideo ? backgroundVideo : undefined,
      copyText: copyText ? copyText : undefined,
      logoSrc: selectedLogo ? selectedLogo : undefined,
      productSrc: selectedProduct ? selectedProduct : undefined,
      selectedOption,
    };
  }, [selectedLogo, selectedProduct, backgroundImage, backgroundVideo, copyText]);

  const handleTabChange = (activeKey: string) => {
    // setBackgroundImage(null);
    setSelectedOption(activeKey);
  };

  const uploadFiletoS3 = async (file: any, fetchCount: number) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/s3-upload', formData);
      const data = response.data;
      console.log(data);
      console.log(response.status);

      const downloadURL = `${process.env.NEXT_PUBLIC_AWS_S3_URL}/${data.fileName}`;
      console.log(downloadURL);
      if (selectedOption !== 'fully-animated') {
        setLoadingBackgroundImage(true);
        setBackgroundImage(downloadURL);

        switch (fetchCount) {
          case 1:
            shouldFetchRef1.current = false;
            setBackgroundImage1(downloadURL);
            break;
          case 2:
            shouldFetchRef2.current = false;
            setBackgroundImage2(downloadURL);
            break;
          case 3:
            shouldFetchRef3.current = false;
            setBackgroundImage3(downloadURL);
            break;
          case 4:
            shouldFetchRef4.current = false;
            setBackgroundImage4(downloadURL);
            break;
          case 5:
            shouldFetchRef5.current = false;
            setBackgroundImage5(downloadURL);
            setShouldFetch(false);
            break;
        }
        setLoadingBackgroundImage(false);
      }
      if (selectedOption === 'fully-animated') {
        setLoadingBackgroundVideo(true);
        setBackgroundVideo(downloadURL);

        switch (fetchCount) {
          case 1:
            setBackgroundVideo1(downloadURL);
            break;
          case 2:
            setBackgroundVideo2(downloadURL);
            break;
          case 3:
            setBackgroundVideo3(downloadURL);
            break;
          case 4:
            setBackgroundVideo4(downloadURL);
            break;
          case 5:
            setBackgroundVideo5(downloadURL);
            setShouldFetch(false);
            break;
        }
        setLoadingBackgroundVideo(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsPromptGenLoading(false);
      setShouldFetch(false);
    }
  };

  const uploadBackground = async (file: any, fetchCount: number) => {
    if (file) {
      const storageRef = ref(storage, `background/${Math.floor(100000 + Math.random() * 900000)}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.info('Media available at', downloadURL);
            if (selectedOption !== 'Fully Animated') {
              setLoadingBackgroundImage(true);
              setBackgroundImage(downloadURL);

              switch (fetchCount) {
                case 1:
                  setBackgroundImage1(downloadURL);
                  break;
                case 2:
                  setBackgroundImage2(downloadURL);
                  break;
                case 3:
                  setBackgroundImage3(downloadURL);
                  break;
                case 4:
                  setBackgroundImage4(downloadURL);
                  break;
                case 5:
                  setBackgroundImage5(downloadURL);
                  setShouldFetch(false);
                  break;
              }
              setLoadingBackgroundImage(false);
            }
            if (selectedOption === 'Fully Animated') {
              setLoadingBackgroundVideo(true);
              setBackgroundVideo(downloadURL);

              switch (fetchCount) {
                case 1:
                  setBackgroundVideo1(downloadURL);
                  break;
                case 2:
                  setBackgroundVideo2(downloadURL);
                  break;
                case 3:
                  setBackgroundVideo3(downloadURL);
                  break;
                case 4:
                  setBackgroundVideo4(downloadURL);
                  break;
                case 5:
                  setBackgroundVideo5(downloadURL);
                  setShouldFetch(false);
                  break;
              }
              setLoadingBackgroundVideo(false);
            }
          });
        },
      );
    }
  };
  const fetchByFileName = async (url: string, fetchCount: number) => {
    switch (fetchCount) {
      case 1:
        shouldFetchRef1.current = false;
        break;
      case 2:
        shouldFetchRef2.current = false;
        break;
      case 3:
        shouldFetchRef3.current = false;
        break;
      case 4:
        shouldFetchRef4.current = false;
        break;
      case 5:
        shouldFetchRef5.current = false;
        break;
    }
    console.log('FETCHCOUNT: ', fetchCount);
    try {
      const response = await axios.get(url, {
        responseType: 'blob',
      });
      if (response.status === 204) {
        switch (fetchCount) {
          case 1:
            shouldFetchRef1.current = true;
            break;
          case 2:
            shouldFetchRef2.current = true;
            break;
          case 3:
            shouldFetchRef3.current = true;
            break;
          case 4:
            shouldFetchRef4.current = true;
            break;
          case 5:
            shouldFetchRef5.current = true;
            break;
        }
        return;
      }

      const blob = new Blob([response.data], {
        type: selectedOption === 'Fully Animated' ? 'video/mp4' : 'image/png',
      });

      uploadFiletoS3(blob, fetchCount);
    } catch (error) {
      console.error('Error:', error);
      setIsPromptGenLoading(false);
      setShouldFetch(false);
    } finally {
      setIsPromptGenLoading(false);
    }
  };

  useEffect(() => {
    if (!shouldFetch) return;
    const intervalId = setInterval(() => {
      if (shouldFetchRef1.current === true) {
        console.log('Fetching file: ', 1);
        fetchByFileName(
          `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file?filename=${filename1Ref.current + '_00001'}`,
          1,
        );
      }
      if (shouldFetchRef2.current === true) {
        console.log('Fetching file: ', 2);
        console.log(shouldFetchRef2.current);
        fetchByFileName(
          `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file?filename=${filename1Ref.current + '_00002'}`,
          2,
        );
      }
      if (shouldFetchRef3.current === true) {
        console.log('Fetching file: ', 3);
        fetchByFileName(
          `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file?filename=${filename1Ref.current + '_00003'}`,
          3,
        );
      }
      if (shouldFetchRef4.current === true) {
        console.log('Fetching file: ', 4);
        fetchByFileName(
          `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file?filename=${filename1Ref.current + '_00004'}`,
          4,
        );
      }
      if (shouldFetchRef5.current === true) {
        fetchByFileName(
          `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file?filename=${filename1Ref.current + '_00005'}`,
          5,
        );
      }
    }, 10_000);

    return () => clearInterval(intervalId);
  }, [
    shouldFetch,
    shouldFetchRef1.current,
    shouldFetchRef2.current,
    shouldFetchRef3.current,
    shouldFetchRef4.current,
    shouldFetchRef5.current,
  ]);

  const onGenerateClick = async () => {
    setIsPromptGenLoading(true);
    setLoadingCopyText(true);
    const prompt = btoa(text);
    const links = extractLinks(text);
    const mistralApiUrl = btoa(process.env.NEXT_PUBLIC_MISTRAL_API_URL!);
    const hasQueryParams = links && links[0].includes('?');
    const separator = hasQueryParams ? '&' : '?';
    mixtralFileRef.current =
      Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
    const url = `${links && links[0]}${separator}adgen=true&prompt=${prompt}&mistralUrl=${mistralApiUrl}&exec=extractNameAndDescription&filename=${mixtralFileRef.current}`;
    window.open(url, '_blank');
    setBackgroundImage1(null);
    setBackgroundImage2(null);
    setBackgroundImage3(null);
    setBackgroundImage4(null);
    setBackgroundImage5(null);

    setTimeout(async () => {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_MISTRAL_API_URL}/result?filename=${mixtralFileRef.current}`,
      );
      setTaglines(data.data.tagline.split(';'));
      setCopyText(data.data.tagline.split(';')[0]);
      setLoadingCopyText(false);
      const randomName =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
      filenameRef.current = randomName;
      filename1Ref.current = randomName + '_1';
      svdPromptRef.current = data.data.svdPrompt;

      const workflow = selectedOption === 'Fully Animated' ? videoWorkflow : imageWorkflow;

      workflow[18].inputs.text = 'wavy particle effect, white background, ' + svdPromptRef.current;
      if (selectedOption === 'Fully Animated') {
        (workflow as any)['23'].inputs.filename_prefix = filename1Ref.current ?? '';
        (workflow as any)['3'].inputs.seed = Number.parseInt(
          (Math.random() * 1_500_000).toString(),
        );
      } else {
        (workflow as any)['28'].inputs.filename_prefix = filename1Ref.current ?? '';
        (workflow as any)['17'].inputs.seed = Number.parseInt(
          (Math.random() * 1_500_000).toString(),
        );
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_COMFY_API_URL}/prompt?url=${process.env.NEXT_PUBLIC_COMFY_UI_URL}`,
        { prompt: workflow },
      );

      if (response.status === 200) {
        try {
          setTimeout(() => {
            setShouldFetch(true);
            shouldFetchRef1.current = true;
            shouldFetchRef2.current = true;
            shouldFetchRef3.current = true;
            shouldFetchRef4.current = true;
            shouldFetchRef5.current = true;
          }, 1_000);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }, 30_000);
  };

  const generateImage = async () => {
    setDownloadLoading(true);

    const container = canvasRef.current;
    if (container) {
      await html2canvas(container, { logging: true }).then((canvas) => {
        const dataURL = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = dataURL;
        downloadLink.download = 'generated_image.png';
        document.body.append(downloadLink);
        downloadLink.click();
        downloadLink.remove();
      });
    }

    setDownloadLoading(false);
  };

  const onDownloadClick = () => {
    generateImage();
  };

  return (
    <Layout>
      <Flexbox style={{ height: '100%' }} horizontal>
        <Flexbox
          flex={1}
          //  position: 'relative' is required, ChatInput's absolute position needs it
          style={{ position: 'relative' }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
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
              <Header
                isStatic={selectedOption === 'Static'}
                onDownloadClick={onDownloadClick}
                inputProps={inputProps}
                logoSrc={logoSrc}
                productSrc={productSrc}
                setLogoSrc={setLogoSrc}
                setProductSrc={setProductSrc}
                handleTabChange={handleTabChange}
                selectedOption={selectedOption}
              />
            </div>

            {selectedOption === 'Static' ? (
              <div className="ml-52" style={{ height: '100%' }}>
                {downloadLoading ? (
                  <div
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                      height: '55vh',
                      justifyContent: 'center',
                    }}
                  >
                    <RingLoader color="#36D7B7" size={50} />
                  </div>
                ) : (
                  <Canvas canvasRef={canvasRef} />
                )}
                {/* </Flexbox> */}
              </div>
            ) : (
              <div className="cinematics" style={container}>
                {/* <Flexbox
            align="center"
            direction="horizontal"
            justify="center"
            style={{ height: '100%' }}
          > */}
                <div
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <Player
                    component={Main}
                    compositionHeight={VIDEO_HEIGHT}
                    compositionWidth={VIDEO_WIDTH}
                    controls
                    durationInFrames={DURATION_IN_FRAMES}
                    fps={VIDEO_FPS}
                    inputProps={inputProps}
                    style={player}
                  />
                  <RenderControls
                    inputProps={inputProps}
                    logoSrc={logoSrc}
                    productSrc={productSrc}
                    setLogoSrc={setLogoSrc}
                    setProductSrc={setProductSrc}
                    // text={text}
                    // setText={setText}
                  ></RenderControls>
                </div>
              </div>
            )}
            {/* <div
              style={{
                border: '1px solid #242424',
                borderRadius: '12px',
                bottom: 5,
                display: 'flex',
                justifyContent: 'between',
                left: '10%',
                margin: 'auto',
                padding: '10px',
                // position: 'fixed',
                width: '80%',
              }}
            >
              <TextArea
                autoFocus
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your prompt here..."
                showCount={false}
                size="small"
                style={{ border: 'none', width: '80%', resize: 'none', boxShadow: 'none' }}
                type={'pure'}
              />
              <Button
                onClick={onGenerateClick}
                style={{
                  height: '45px',
                  marginBottom: 'auto',
                  marginLeft: 10,
                  marginTop: 'auto',
                  width: '20%',
                }}
                type={'primary'}
                loading={isPromptGenLoading}
              >
                {!isPromptGenLoading && <Icon fill="normal" icon={Sparkles} />}
                {isPromptGenLoading ? 'Generating...' : 'Generate'}
              </Button>
            </div> */}
            <PromptInput
              // text={props.prompt}
              handlePromptChange={(e) => setText(e.target.value)}
              onGenerateClick={onGenerateClick}
              isPromptGenLoading={isPromptGenLoading}
            />
          </div>
        </Flexbox>
      </Flexbox>

      {/* <ChatInput
        handleCreateImage={onGenerateClick}
        handlePromptChange={(e) => setText(e.target.value)}
        isPromptGenLoading={isPromptGenLoading}
      /> */}
    </Layout>
  );
};

export default Page;
