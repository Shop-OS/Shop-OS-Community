'use client';

import { useEffect, useRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import PageTitle from '../features/PageTitle';
import AgentInput from './features/AgentInput';
import Conversation from './features/Conversation';
import LeftMainSideBar from './features/LeftMainSideBar';
import Layout from './layout.desktop';
import { ProductBGProvider } from '../provider/ProductBGProvider';
import useHomProvider from '@/provider/useHoMProvider';
import Cookies from 'js-cookie';

const DesktopPage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageHeight, setImageHeight] = useState(0);

  const [maskImage, setMaskImage] = useState<string | null>(null);
  const [maskImageFile, setMaskImageFile] = useState<File | null>(null);

  const [canvasImageFile, setCanvasImageFile] = useState<File | null>(null);

  const imageRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBgRemoveLoading, setIsBgRemoveLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [prompt, setPrompt] = useState<string>('');
  const [faceDetailerPrompt, setFaceDetailerPrompt] = useState<string>('');
  const [modelLora, setModelLora] = useState<string>();
  const [fetchCount, setFetchCount] = useState<number>(4);
  const [outputImages, setOutputImages] = useState<string[]>([
    // 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jp',
  ]);
  const [agentInputComponent, setAgentInputComponent] = useState('assets');
  const [isManual, setIsManual] = useState(false);
  const [template, setTemplate] = useState<any>({});
  const [bgImageFile, setBgImageFile] = useState<File | null>(null);
  const [manualModelPrompt, setManualModelPrompt] = useState<object[]>([]);
  const [manualSurroundingPrompt, setManualSurroundingPrompt] = useState<object>([]);
  const [manualBackgroundPrompt, setManualBackgroundPrompt] = useState<object>([]);
  const [manualPrompt, setManualPrompt] = useState<object>([]);

  const [productPrompt, setProductPrompt] = useState('');
  const [bgReferencePrompt, setBgReferencePrompt] = useState<string>('');
  const elementsRef = useRef<any>([]);

  const [selectedTemplateForCanvas, setSelectedTemplateForCanvas] = useState<any>('');
  const [selectedBgTemplate, setSelectedBgTemplate] = useState(null);
  const [renderStrength, setRenderStrength] = useState(0.8);

  const filename1Ref = useRef<string>();
  const promptRef = useRef<string>();
  const textAreaRef = useRef<any>();

  const { setShowTour, setTourType } = useHomProvider();

  useEffect(() => {
    let showTour = Cookies.get('hom_tour_product_bg_enhancer') == 'true' ? true : false;

    if (!showTour) {
      Cookies.set('hom_tour_product_bg_enhancer', 'true', { expires: 365 });
      setShowTour(true);
      setTourType('Product Background Enhancer');
    }
  }, []);

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
    if (tab === 'assets') {
      const templatePrompt = generateTemplatePrompt({
        product: productPrompt,
        elements: elementsRef.current,
        referenceImage: bgReferencePrompt,
      });
      setIsManual(false);
      setPrompt(templatePrompt.trim());
    } else if (tab === 'editor') {
      const userPrompt = generateEditorPrompt(
        productPrompt,
        manualPrompt
      );
      setPrompt(userPrompt);
      setIsManual(true);
    }
    setAgentInputComponent(tab);
  };

  useEffect(() => {
    if (isManual) {
      const userPrompt = generateEditorPrompt(
        productPrompt,
        manualPrompt,
      );
      setPrompt(userPrompt);
    }
  }, [manualPrompt, productPrompt]);

  return (
    <Layout>
      <ProductBGProvider>
        <LeftMainSideBar
          setAgentInputComponent={onTabChange}
          agentInputComponent={agentInputComponent}
        />
        <AgentInput
          canvasImageFile={canvasImageFile}
          setCanvasImageFile={setCanvasImageFile}
          agentInputComponent={agentInputComponent}
          setAgentInputComponent={onTabChange}
          image={image}
          imageFile={imageFile}
          imageHeight={imageHeight}
          imageRef={imageRef}
          selectedTemplateForCanvas={selectedTemplateForCanvas}
          setSelectedTemplateForCanvas={setSelectedTemplateForCanvas}
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
          isBgRemoveLoading={isBgRemoveLoading}
          setIsBgRemoveLoading={setIsBgRemoveLoading}
          setTemplate={setTemplate}
          maskImage={maskImage}
          setMaskImage={setMaskImage}
          maskImageFile={maskImageFile}
          setMaskImageFile={setMaskImageFile}
          productPrompt={productPrompt}
          setProductPrompt={setProductPrompt}
          setBgReferencePrompt={setBgReferencePrompt}
          elementsRef={elementsRef}
          setBgImageFile={setBgImageFile}
          bgReferencePrompt={bgReferencePrompt}
          manualPrompt={manualPrompt}
          setManualPrompt={setManualPrompt}
          template={template}
          selectedBgTemplate={selectedBgTemplate}
          setSelectedBgTemplate={setSelectedBgTemplate}
          bgImageFile={bgImageFile}
          renderStrength={renderStrength}
          setRenderStrength={setRenderStrength}
        />
        <Flexbox
          flex={1}
          height={'100%'}
          width={'100%'}
          id={'lobe-conversion-container'}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <PageTitle />
          <Flexbox
            flex={1}
            height={'calc(100% - 64px)'}
            style={{
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            <Conversation
              agentInputComponent={agentInputComponent}
              filename1Ref={filename1Ref}
              textAreaRef={textAreaRef}
              image={image}
              canvasImageFile={canvasImageFile}
              imageFile={imageFile}
              setImageFile={setImageFile}
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
              selectedTemplateForCanvas={selectedTemplateForCanvas}
              isManual={isManual}
              manualModelPrompt={manualModelPrompt}
              manualSurroundingPrompt={manualSurroundingPrompt}
              manualBackgroundPrompt={manualBackgroundPrompt}
              template={template}
              productPrompt={productPrompt}
              bgImageFile={bgImageFile}
              bgReferencePrompt={bgReferencePrompt}
              elementsRef={elementsRef}
              renderStrength={renderStrength}
            />
          </Flexbox>
        </Flexbox>
      </ProductBGProvider>
    </Layout>
  );
};
export default DesktopPage;


const generateEditorPrompt = (productInfo: string, manualPrompt: any) => {
  let prompt = productInfo || '';

  let onPrompt = manualPrompt.find((item: any) => item.key === 'on')?.userPrompt || '';
  let nextPrompt = manualPrompt.find((item: any) => item.key === 'next to')?.userPrompt || '';
  let inPrompt = manualPrompt.find((item: any) => item.key === 'in')?.userPrompt || '';
  let withThemePrompt = manualPrompt.find((item: any) => item.key === 'with')?.userPrompt || '';
  let layingPrompt = manualPrompt.find((item: any) => item.key === 'lying on')?.userPrompt || '';
  let surroundedPrompt = manualPrompt.find((item: any) => item.key === 'Surrounded by')?.userPrompt || '';
  let inFrontPrompt = manualPrompt.find((item: any) => item.key === 'In front of')?.userPrompt || '';
  let withPrompt = manualPrompt.find((item: any) => item.key === 'With')?.userPrompt || '';

  if (withPrompt) {
    prompt += ` with ${withPrompt},`
  }

  //background dropdown
  if (inFrontPrompt) {
    prompt += ` in front of ${inFrontPrompt},`
  }
  if (nextPrompt) {
    prompt += ` next to ${nextPrompt},`
  }
  if (withThemePrompt) {
    prompt += ` with ${withThemePrompt},`
  }

  //placement dropdown
  if (onPrompt) {
    prompt += ` on ${onPrompt},`
  }
  if (inPrompt) {
    prompt += ` in ${inPrompt},`
  }
  if (layingPrompt) {
    prompt += ` lying on ${layingPrompt},`
  }

  //surrounding dropdown
  if (surroundedPrompt) {
    prompt += ` surrounded by ${surroundedPrompt},`
  }

  return prompt;
};

export const generateTemplatePrompt = ({ product, elements, referenceImage }: any) => {
  product = product.replace(/[.,]$/, ''); // Remove trailing comma or period
  const elementsArray = [...new Set(elements)].map((element: unknown) => (element as string).trim()); // Remove duplicates
  elementsArray.filter((item: any) => item === 'productImage'); // Sometimes when we delete elements from the canvas, 'productImage' string is suddenly pushed to this array. This is a workaround to remove it.
  if (elements.length === 0) {
    if (!product || !referenceImage) return '';
    return `${product}, ${referenceImage}`;
  }

  let elementsPrompt;
  if (elementsArray.length === 1) {
    elementsPrompt = elementsArray[0];
  } else if (elementsArray.length === 2) {
    elementsPrompt = `${elementsArray[0]} and ${elementsArray[1]}`;
  } else {
    const lastElement = elementsArray.pop();
    elementsPrompt = `${elementsArray.join(', ')} and ${lastElement}`;
  }

  return `${product}, with ${elementsPrompt + ','} ${referenceImage}`;
};