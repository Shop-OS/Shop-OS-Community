'use client';

import { useEffect, useRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import PageTitle from '../features/PageTitle';
import LeftMainSideBar from './LeftMainSideBar';
import AgentInput from './features/AgentInput';
import Conversation from './features/Conversation';
import Layout from './layout.desktop';

const DesktopPage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageHeight, setImageHeight] = useState(0);
  const imageRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [outputImage, setOutputImage] = useState<any>(null);
  const [outputImage1, setOutputImage1] = useState<any>(null);
  const [outputImage2, setOutputImage2] = useState<any>(null);
  const [outputImage3, setOutputImage3] = useState<any>(null);
  const [outputImage4, setOutputImage4] = useState<any>(null);
  const [outputImage5, setOutputImage5] = useState<any>(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [agentInputComponent, setAgentInputComponent] = useState('assets');

  const filename1Ref = useRef<string>();
  const filename2Ref = useRef<string>();
  const filename3Ref = useRef<string>();
  const filename4Ref = useRef<string>();
  const filename5Ref = useRef<string>();
  const promptRef = useRef<string>();

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

  return (
    <Layout>
      <LeftMainSideBar
        setAgentInputComponent={setAgentInputComponent}
        agentInputComponent={agentInputComponent}
      />
      <AgentInput
        image={image}
        imageFile={imageFile}
        imageHeight={imageHeight}
        imageRef={imageRef}
        setImage={setImage}
        setImageFile={setImageFile}
        setImageHeight={setImageHeight}
        setOutputImage={setOutputImage}
        setOutputImage1={setOutputImage1}
        setOutputImage2={setOutputImage2}
        setOutputImage3={setOutputImage3}
        setOutputImage4={setOutputImage4}
        setOutputImage5={setOutputImage5}
        setPrompt={setPrompt}
        promptRef={promptRef}
        selectedTags={selectedTags}
        tags={tags}
      />
      <Flexbox
        flex={2}
        height={'100%'}
        id={'lobe-conversion-container'}
        style={{ display: 'flex', position: 'relative' }}
      >
        <PageTitle />
        <Flexbox flex={1} height={'calc(100% - 64px)'}>
          <Conversation
            filename1Ref={filename1Ref}
            filename2Ref={filename2Ref}
            filename3Ref={filename3Ref}
            filename4Ref={filename4Ref}
            filename5Ref={filename5Ref}
            imageFile={imageFile}
            isLoading={isLoading}
            outputImage={outputImage}
            outputImage1={outputImage1}
            outputImage2={outputImage2}
            outputImage3={outputImage3}
            outputImage4={outputImage4}
            outputImage5={outputImage5}
            prompt={prompt}
            promptRef={promptRef}
            setIsLoading={setIsLoading}
            setOutputImage={setOutputImage}
            setOutputImage1={setOutputImage1}
            setOutputImage2={setOutputImage2}
            setOutputImage3={setOutputImage3}
            setOutputImage4={setOutputImage4}
            setOutputImage5={setOutputImage5}
            setPrompt={setPrompt}
            setShouldFetch={setShouldFetch}
            setTimeSpent={setTimeSpent}
            shouldFetch={shouldFetch}
            timeSpent={timeSpent}
          />
        </Flexbox>
      </Flexbox>
    </Layout>
  );
};
export default DesktopPage;
