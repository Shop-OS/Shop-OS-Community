'use client';

import { useEffect, useRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import PageTitle from '../features/PageTitle';
import AgentInput from './features/AgentInput';
import Conversation from './features/Conversation';
import LeftMainSideBar from './features/LeftMainSideBar';
import Layout from './layout.desktop';
import useHomProvider from '@/provider/useHoMProvider';
import Cookies from 'js-cookie';

export type OutputImage = {
  id: string;
  src: string;
  fileName: string;
  progress: number;
}

const DesktopPage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [maskImage, setMaskImage] = useState<string | null>(null);
  const [maskImageFile, setMaskImageFile] = useState<File | null>(null);
  const [magicMaskImageFile, setMagicMaskImageFile] = useState<File | null>(null);
  const [blendedImageFile, setBlendedImageFile] = useState<File | null>(null);

  const [imageHeight, setImageHeight] = useState(0);
  const imageRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMaskLoading, setMaskIsLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [prompt, setPrompt] = useState<string>('');
  const [loraPrompt, setLoraPrompt] = useState<string>('');
  const [faceDetailerPrompt, setFaceDetailerPrompt] = useState<string>('');
  const [modelLora, setModelLora] = useState<string>();
  const [fetchCount, setFetchCount] = useState<number>(4);
  const [outputImages, setOutputImages] = useState<OutputImage[]>([]);
  const [agentInputComponent, setAgentInputComponent] = useState('assets');
  const [isManual, setIsManual] = useState(false);
  const [bgModel, setBgModel] = useState<string>('City');
  const [bgImageFile, setBgImageFile] = useState<File | null>(null);
  const [productInfo, setProductInfo] = useState<string>('');
  const [manualModelPrompt, setManualModelPrompt] = useState<object[]>([
    {
      key: 'Is',
      label: 'Is',
      configuredPrompt: 'Model is ',
      userPrompt: 'Indian',
    },
    {
      key: 'Color',
      label: 'Is of color',
      configuredPrompt: 'Model is of color ',
      userPrompt: 'White',
    },
    {
      key: 'Gender',
      label: 'Is of gender',
      configuredPrompt: 'Model is of gender ',
      userPrompt: 'Male',
    },
    {
      key: 'Ethnicity',
      label: 'Is of ethnicity',
      configuredPrompt: `Model is of ethnicity`,
      userPrompt: 'Caucasian',
    },
  ]);
  const [manualSurroundingPrompt, setManualSurroundingPrompt] = useState<object[]>([
    {
      key: 'Surrounded by',
      label: 'Surrounded by',
      configuredPrompt: 'Model is surrounded by ',
      userPrompt: 'City',
    },
  ]);
  const [manualBackgroundPrompt, setManualBackgroundPrompt] = useState<object[]>([
    {
      key: 'In front of',
      label: 'In front of',
      configuredPrompt: 'Model is in front of ',
      userPrompt: 'Fountain',
    },
  ]);
  const [modelPrompt, setModelPrompt] = useState('');
  const [backgroundPrompt, setBackgroundPrompt] = useState('');
  const [productPrompt, setProductPrompt] = useState('');
  const [isBlurBg, setIsBlurBg] = useState(true);
  const [blurStatePrompt, setBlurStatePrompt] = useState<string>('sharp background');
  const [blurStateNegativePrompt, setBlurStateNegativePrompt] = useState<string>(
    'blurry background, depth of field',
  );

  const [backgroundNegativePrompt, setBackgroundNegativePrompt] = useState('');
  const [backgroundLora, setBackgroundLora] = useState<string>();
  const [backgroundLoraModelStrength, setBackgroundLoraModelStrength] = useState<number>(0);
  const [backgroundLoraClipStrength, setBackgroundLoraClipStrength] = useState<number>(0);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);

  const [isSideNavDisabled, setIsSideNavDisabled] = useState(true);
  const [renderStrength, setRenderStrength] = useState(0.8);

  const { setShowTour, setTourType } = useHomProvider();

  useEffect(() => {
    let showTour = Cookies.get('hom_tour_apparel') == 'true' ? true : false;

    if (!showTour) {
      Cookies.set('hom_tour_apparel', 'true', { expires: 365 });
      setShowTour(true);
      setTourType('Apparel Shoots');
    }
  }, []);

  // useEffect(() => {
  //   if (isBlurBg === true) {
  //     setBlurStatePrompt('blurry background, depth of field');
  //     setBlurStateNegativePrompt('sharp background');
  //   } else {
  //     setBlurStatePrompt('sharp background');
  //     setBlurStateNegativePrompt('blurry background, depth of field');
  //   }
  // }, [isBlurBg]);

  const filename1Ref = useRef<string>();
  const promptRef = useRef<string>();
  const textAreaRef = useRef<any>();

  useEffect(() => {
    // eslint-disable-next-line no-undef
    let intervalId: NodeJS.Timeout;

    if (shouldFetch) {
      intervalId = setInterval(() => {
        setTimeSpent((timeSpent) => timeSpent + 0.05);
      }, 50);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [shouldFetch, timeSpent]);

  const onTabChange = (tab: string) => {
    if (tab === 'templates') {
      const templatePrompt = `${modelPrompt ? modelPrompt + ',' : ''} ${productPrompt ? 'wearing ' + productPrompt + ',' : ''} ${backgroundPrompt ? backgroundPrompt + ',' : ''}`;
      setIsManual(false);
      setPrompt(templatePrompt.trim());
    } else if (tab === 'editor') {
      const userPrompt = generateEditorPrompt(
        manualModelPrompt,
        productInfo,
        manualSurroundingPrompt,
        manualBackgroundPrompt,
      );
      setIsManual(true);
      setPrompt(userPrompt);
    } else if (tab === 'history') {
      // setPrompt('');
    }
    setAgentInputComponent(tab);
  };

  useEffect(() => {
    if (isManual) {
      const userPrompt = generateEditorPrompt(
        manualModelPrompt,
        productInfo,
        manualSurroundingPrompt,
        manualBackgroundPrompt,
      );
      setPrompt(userPrompt);
    }
  }, [manualModelPrompt, productInfo, manualSurroundingPrompt, manualBackgroundPrompt]);


  useEffect(() => {
    if (fileUploadLoading || isMaskLoading) {
      setIsSideNavDisabled(true);
    } else {
      setIsSideNavDisabled(false);
    }
  }, [fileUploadLoading, isMaskLoading]);

  return (
    <Layout>
      <LeftMainSideBar
        setAgentInputComponent={onTabChange}
        agentInputComponent={agentInputComponent}
        isDisabled={isSideNavDisabled}
      />
      <AgentInput
        agentInputComponent={agentInputComponent}
        setAgentInputComponent={onTabChange}
        image={image}
        imageFile={imageFile}
        imageHeight={imageHeight}
        imageRef={imageRef}
        setImage={setImage}
        setImageFile={setImageFile}
        setImageHeight={setImageHeight}
        setOutputImages={setOutputImages}
        setPrompt={setPrompt}
        setFaceDetailerPrompt={setFaceDetailerPrompt}
        setModelLora={setModelLora}
        promptRef={promptRef}
        textAreaRef={textAreaRef}
        setIsManual={setIsManual}
        setManualModelPrompt={setManualModelPrompt}
        setManualSurroundingPrompt={setManualSurroundingPrompt}
        setManualBackgroundPrompt={setManualBackgroundPrompt}
        fetchCount={fetchCount}
        setFetchCount={setFetchCount}
        maskImage={maskImage}
        setMaskImage={setMaskImage}
        maskImageFile={maskImageFile}
        setMaskImageFile={setMaskImageFile}
        isMaskLoading={isMaskLoading}
        setIsMaskLoading={setMaskIsLoading}
        manualModelPrompt={manualModelPrompt}
        manualSurroundingPrompt={manualSurroundingPrompt}
        manualBackgroundPrompt={manualBackgroundPrompt}
        setBgModel={setBgModel}
        setBgImageFile={setBgImageFile}
        bgImageFile={bgImageFile}
        productInfo={productInfo}
        setProductInfo={setProductInfo}
        blendedImageFile={blendedImageFile}
        setBlendedImageFile={setBlendedImageFile}
        modelPrompt={modelPrompt}
        setModelPrompt={setModelPrompt}
        backgroundPrompt={backgroundPrompt}
        setBackgroundPrompt={setBackgroundPrompt}
        setBackgroundNegativePrompt={setBackgroundNegativePrompt}
        setBackgroundLora={setBackgroundLora}
        setBackgroundLoraModelStrength={setBackgroundLoraModelStrength}
        setBackgroundLoraClipStrength={setBackgroundLoraClipStrength}
        productPrompt={productPrompt}
        setProductPrompt={setProductPrompt}
        isBlurBg={isBlurBg}
        setIsBlurBg={setIsBlurBg}
        blurStatePrompt={blurStatePrompt}
        fileUploadLoading={fileUploadLoading}
        setFileUploadLoading={setFileUploadLoading}
        renderStrength={renderStrength}
        setRenderStrength={setRenderStrength}
        loraPrompt={loraPrompt}
        setLoraPrompt={setLoraPrompt}
      />
      <Flexbox
        flex={1}
        height={'100%'}
        id={'lobe-conversion-container'}
        style={{ position: 'relative' }}
      >
        <PageTitle />
        <Flexbox
          flex={1}
          height={'calc(100% - 64px)'}
          style={{ overflowY: 'auto', overflowX: 'hidden' }}
        >
          <Conversation
            agentInputComponent={agentInputComponent}
            filename1Ref={filename1Ref}
            textAreaRef={textAreaRef}
            image={image}
            imageFile={imageFile}
            maskImageFile={maskImageFile}
            isLoading={isLoading}
            prompt={prompt}
            promptRef={promptRef}
            setIsLoading={setIsLoading}
            setPrompt={setPrompt}
            setShouldFetch={setShouldFetch}
            setTimeSpent={setTimeSpent}
            shouldFetch={shouldFetch}
            timeSpent={timeSpent}
            fetchCount={fetchCount}
            outputImages={outputImages}
            setOutputImages={setOutputImages}
            faceDetailerPrompt={faceDetailerPrompt}
            modelLora={modelLora}
            isManual={isManual}
            manualModelPrompt={manualModelPrompt}
            manualSurroundingPrompt={manualSurroundingPrompt}
            manualBackgroundPrompt={manualBackgroundPrompt}
            bgModel={bgModel}
            bgImageFile={bgImageFile}
            productInfo={productInfo}
            blendedImageFile={blendedImageFile}
            setBlendedImageFile={setBlendedImageFile}
            modelPrompt={modelPrompt}
            setModelPrompt={setModelPrompt}
            backgroundPrompt={backgroundPrompt}
            setBackgroundPrompt={setBackgroundPrompt}
            magicMaskImageFile={magicMaskImageFile}
            setMagicMaskImageFile={setMagicMaskImageFile}
            isBlurBg={isBlurBg}
            backgroundLora={backgroundLora}
            backgroundLoraModelStrength={backgroundLoraModelStrength}
            backgroundLoraClipStrength={backgroundLoraClipStrength}
            backgroundNegativePrompt={backgroundNegativePrompt}
            setBackgroundNegativePrompt={setBackgroundNegativePrompt}
            blurStatePrompt={blurStatePrompt}
            blurStateNegativePrompt={blurStateNegativePrompt}
            renderStrength={renderStrength}
            loraPrompt={loraPrompt}
            setLoraPrompt={setLoraPrompt}
          />
        </Flexbox>
      </Flexbox>
    </Layout>
  );
};
export default DesktopPage;

export const generateEditorPrompt = (
  manualModelPrompt: any,
  productInfo: any,
  manualSurroundingPrompt: any,
  manualBackgroundPrompt: any,
): any => {
  return `a ${manualModelPrompt.find((item: any) => item.key === 'Color')?.userPrompt ?? 'white'} ${manualModelPrompt.find((item: any) => item.key === 'Ethnicity')?.userPrompt ?? 'caucasian'} ${manualModelPrompt.find((item: any) => item.key === 'Gender')?.userPrompt ?? 'man'} wearing a ${productInfo}  surrounded by ${manualSurroundingPrompt.find((item: any) => item.key === 'Surrounded by')?.userPrompt ?? 'city'} in front of a ${manualBackgroundPrompt.find((item: any) => item.key === 'In front of')?.userPrompt ?? 'fountain'}`.trim();
};
