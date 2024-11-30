import {
  memo,
  use,
  useEffect,
  useRef,
  useState
} from 'react';

import PromptInput from './PromptInput';
import ProductDetailsForm from '../../components/ProductDetailsForm/ProductDetailsForm';
import ProductOutput from '../../components/ProductOutput/ProductOutput';
import useProductDescription from '../../provider/useProductDescription';
import { Shuffle } from 'lucide-react';
import ProductOutputSuggestion from '../../components/ProductOutput/ProductOutputSuggestion';
import LoadingAnimation from '../../components/DotLoading';
import { toast } from 'react-toastify';
import axios, { CancelTokenSource } from 'axios';
import { Modal, Tabs } from 'antd';
import TranslatedBox from '../../components/TranslatedBox/TranslatedBox';
import Header from '@/components/AgentHeader';
import Cookies from 'js-cookie';


interface ConversationProps {
  setShouldFetch: (shouldFetch: boolean) => void;
  shouldFetch: boolean;
}

const Conversation = memo((props: ConversationProps) => {
  const {
    steps,
    setSteps,
    output,
    setOutput,
    imageFile,
    showTranslation,
    setShowTranslation,
    translatedOutput,
    setTranslatedOutput,
    uploadedImageUrl,
    setUploadedImageUrl,
    prompt,
    setPrompt,
    conversationHistory,
    setConversationHistory,
    productDetailsAnswer,
    setProductDetailsAnswer,
    setIsLoading,
    generationIdRef,
  } = useProductDescription();
  const endOfMessagesRef = useRef<any>(null);
  const cancelToken = useRef<CancelTokenSource | null>(null);

  const [shouldFetch, setShouldFetch] = useState(false);
  const [queueSize, setQueueSize] = useState(0);

  const generateDescription = async (isRewrite = false) => {
    if (!imageFile) {
      toast.error("Please upload an image to generate the description.");
      return;
    }
    const randomId =
      Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
    generationIdRef.current = randomId;
    setIsLoading(true);
    let newSteps = ['output', 'Generating'];
    if (isRewrite) {
      newSteps = ['output', 'rewrite'];
    }
    setSteps(newSteps);

    if (uploadedImageUrl) {
      fetchDescriptionProvider();
      return;
    }

    try {
      cancelToken.current = axios.CancelToken.source();
      const formData = new FormData();
      const randomName1 =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);

      const ext = imageFile?.name.split('.').pop();
      const newFile = new File([imageFile as File], randomName1 + "." + ext, {
        type: (imageFile as File)?.type ?? 'image/jpeg',
      });

      formData.append('image', newFile);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_PRODUCT_DESCRIPTION_API}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        cancelToken: cancelToken.current.token,
      });
      setUploadedImageUrl(response.data.downloadURL);
    } catch (e) {
      if (axios.isCancel(e)) {
        cancelToken.current = null;
        console.log('Request canceled by user');
      } else {
        toast.error("An error occurred while generating the description. Please try again later.");
      }
      setSteps(['output', 'suggestion']);
      setIsLoading(false);
    }
  }

  const fetchDescription = async (msg = "") => {
    setSteps(['output', 'Generating']);
    try {
      let url = `${process.env.NEXT_PUBLIC_PRODUCT_DESCRIPTION_API}/generate_description?image_url=${uploadedImageUrl}&generationId=${generationIdRef.current}`;

      let userInput = "";
      if (Object.keys(productDetailsAnswer)?.length > 0) {
        //loop throught the a object key and value and append on varaible
        for (const [key, value] of Object.entries(productDetailsAnswer)) {
          userInput += `${key} ${value} `;
        }

        setProductDetailsAnswer({});
      }

      let body;
      let tempPrompt;

      if (userInput) {
        tempPrompt = "<image-placeholder>" + userInput;
      }
      if (prompt) {
        tempPrompt += prompt;
      }

      if (msg) {
        tempPrompt = msg;
      }
      if (tempPrompt) {
        url += `&prompt=${tempPrompt}`;
        body = {
          "conv": "[]",
        }
      }

      if (conversationHistory.length > 0) {
        body = {
          "conv": JSON.stringify(conversationHistory),
        }
      }
      cancelToken.current = axios.CancelToken.source();
      const productDetails = await axios.post(`${url}`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          cancelToken: cancelToken.current.token,
        });

      if (productDetails.status === 200) {
        setShouldFetch(true);
      }
      // setConversationHistory(productDetails.data.conv);
      // setOutput((prev: any) => [...prev, { question: "Product Description", answer: productDetails.data.description }]);
      // setSteps(['output', 'suggestion']);
      // setIsLoading(false);
      // setPrompt("");
      // setProductDetailsAnswer({});
    } catch (error) {
      if (axios.isCancel(error)) {
        cancelToken.current = null;
        console.log('Request canceled by user');
      } else {
        console.log(error)
        toast.error("An error occurred while generating the description. Please try again later.");
      }
      setSteps(['output', 'suggestion']);
      setIsLoading(false);
    }
  }

  const fetchDescriptionChatGPT = async (msg = "") => {
    setSteps(['output', 'Generating']);
    console.log("first response", msg)
    try {
      let userInput = "";
      if (Object.keys(productDetailsAnswer)?.length > 0) {
        //loop throught the a object key and value and append on varaible
        for (const [key, value] of Object.entries(productDetailsAnswer)) {
          userInput += `${key} ${value} `;
        }

        setProductDetailsAnswer({});
      }

      const token = Cookies.get('hom_token');
      cancelToken.current = axios.CancelToken.source();

      let data = JSON.stringify({
        "imageUrl": uploadedImageUrl,
        "prompt": msg ? msg : prompt + userInput,
        "messages": conversationHistory,
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: '/api/description',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        data: data
      };

      let productDetails = await axios.request(config)

      if (productDetails.status === 200) {
        let jsonOutput = JSON.parse(productDetails.data.description);
        setConversationHistory(productDetails.data.conv);
        setOutput((prev: any) => [
          ...prev,
          {
            question: "Product Description",
            answer: jsonOutput.Creative,
            subtitle: "Creative",
            showTitle: true
          },
          {
            question: "Product Description",
            answer: jsonOutput.Balanced,
            subtitle: "Balanced",
          },
          {
            question: "Product Description",
            answer: jsonOutput.Precise,
            subtitle: "Precise",
          },
        ]);
        setSteps(['output', 'suggestion']);
        setIsLoading(false);
        setPrompt("");
        setProductDetailsAnswer({});
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        cancelToken.current = null;
        console.log('Request canceled by user');
      } else {
        console.log(error)
        toast.error("An error occurred while generating the description. Please try again later.");
      }
      setSteps(['output', 'suggestion']);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (uploadedImageUrl) {
      fetchDescriptionProvider();
    }
  }, [uploadedImageUrl]);

  const fetchDescriptionProvider = (msg = "") => {
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === "development") {
      fetchDescriptionChatGPT(msg);
    } else {
      fetchDescription(msg);
    }
  }

  useEffect(() => {
    if (shouldFetch) {
      const interval = setInterval(async () => {
        fetchGenerationDetails();
      }, 5_000);

      return () => clearInterval(interval);
    }
  }, [shouldFetch]);

  const fetchGenerationDetails = async () => {
    try {
      cancelToken.current = axios.CancelToken.source();
      const response = await axios.get(`${process.env.NEXT_PUBLIC_PRODUCT_DESCRIPTION_API}/fetch_description?generationId=${generationIdRef.current}`, {
        cancelToken: cancelToken.current.token,
      });
      if (response.status === 200) {
        if (response?.data?.queue_length >= 0) {
          setQueueSize(response.data.queue_length);
          return;
        } else {
          setQueueSize(0);
          setConversationHistory(response.data.conv);
          setOutput((prev: any) => [
            ...prev,
            {
              question: "Product Description",
              answer: response.data.description,
              showTitle: true
            }]);

          // setOutput((prev: any) => [
          //   ...prev,
          //   {
          //     question: "Product Description",
          //     answer: "Creative",
          //     showTitle: true,
          //   },
          //   {
          //     question: "Product Description",
          //     answer: "Balanced",
          //   },
          //   {
          //     question: "Product Description",
          //     answer: "Precise",
          //   },
          // ]);
          setSteps(['output', 'suggestion']);
          setIsLoading(false);
          setPrompt("");
          setShouldFetch(false);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };


  const getComponent = (step: string) => {
    switch (step) {
      case 'form':
        return <ProductDetailsForm onSubmit={generateDescription} />;
      case 'output':
        return <ProductOutput generateDescription={generateDescription} />;
      case 'suggestion':
        return <ProductOutputSuggestion generateDescription={fetchDescriptionProvider} />;
      case 'rewrite':
        return <div style={{ display: "flex", gap: "10px", alignItems: "center", padding: "12px 0" }}>
          <Shuffle size={18} /> Rewriting  <LoadingAnimation />
        </div>;
      case 'empty':
        return null;
      default:
        return <div style={{ display: "flex", gap: "10px", alignItems: "center", padding: "12px 0" }}>
          <LoadingAnimation />{step}
        </div>;
    }
  }

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [steps, output]);

  return (
    <>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'start',
          // marginBottom: 5,
          // position: 'relative',
          width: '100%',
        }}
      >
        <Header queue_size={queueSize} />
      </div>
      <div style={{
        overflowY: 'auto',
        width: "100%",
      }}>

        <div style={{
          width: "75%",
          margin: "0 auto",
          padding: "10px",
        }}

        >
          {steps.map((step: string, index: number) => getComponent(step))}
          <div ref={endOfMessagesRef} />
        </div>
        <Modal
          footer={null}
          onCancel={() => {
            setTranslatedOutput([])
            setShowTranslation(false)
          }}
          open={showTranslation}
          title={"Product Descriptions"}
          maskClosable={false}
          width={"50%"}
        >
          <Tabs
            defaultActiveKey="0"
            items={translatedOutput.map((item: any, i: number) => {
              const id = String(i);
              return {
                label: item.language,
                key: id,
                children: <TranslatedBox item={item} />,
              };
            })}
          />
        </Modal>
      </div>
      <div style={{ marginTop: "auto" }}>
        <PromptInput
          onGenerateClick={() => { generateDescription(); }}
          onStopGeneration={() => {
            if (cancelToken.current) {
              cancelToken.current.cancel("Operation canceled by the user.");
              setIsLoading(false);
              setSteps(['output', 'suggestion']);
            }
          }}
        />
      </div>

    </>
  );
});

export default Conversation;
