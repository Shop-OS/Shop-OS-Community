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
  const [prompt, setPrompt] = useState<string>('');
  const [agentInputComponent, setAgentInputComponent] = useState('assets');

  const filename1Ref = useRef<string>();

  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [faceImageFile, setFaceImageFile] = useState<File | null>(null);
  const [faceImageHeight, setFaceImageHeight] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const faceImageRef = useRef<any>(null);
  const filenameRef = useRef<string>();
  const faceFilenameRef = useRef<string>();
  const promptRef = useRef<string>();
  const tagsRef = useRef<string>();

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
        agentInputComponent={agentInputComponent}
        faceImage={faceImage}
        faceImageFile={faceImageFile}
        faceImageHeight={faceImageHeight}
        faceImageRef={faceImageRef}
        filenameRef={filenameRef}
        image={image}
        imageFile={imageFile}
        imageHeight={imageHeight}
        imageRef={imageRef}
        selectedTags={selectedTags}
        setFaceImage={setFaceImage}
        setFaceImageFile={setFaceImageFile}
        setFaceImageHeight={setFaceImageHeight}
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
        setSelectedTags={setSelectedTags}
        setTags={setTags}
        tags={tags}
        tagsRef={tagsRef}
      />
      <Flexbox
        flex={1}
        height={'100%'}
        id={'lobe-conversion-container'}
        style={{ position: 'relative' }}
      >
        <PageTitle />
        <Flexbox flex={1} height={'calc(100% - 64px)'}>
          <Conversation
            filenameRef={filenameRef}
            filename1Ref={filename1Ref}
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
            tags={tags}
            tagsRef={tagsRef}
            timeSpent={timeSpent}
            selectedTags={selectedTags}
            faceImageFile={faceImageFile}
            faceFilenameRef={faceFilenameRef}
          />
        </Flexbox>
      </Flexbox>
    </Layout>
  );
};
export default DesktopPage;
