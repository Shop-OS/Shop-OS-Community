import { CloudUploadOutlined, SendOutlined } from '@ant-design/icons';
import { ActionIcon, DraggablePanelBody, Icon } from '@lobehub/ui';
import { Button, Collapse, Empty, GetProp, Image, Modal, Radio, Spin, Upload } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import Input from 'antd/es/input/Input';
import { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
import axios from 'axios';
import { LucideLoader2 } from 'lucide-react';
// import Image from 'next/image';
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Center } from 'react-layout-kit';

// import styled from 'styled-components';
import FolderPanel from '@/features/FolderPanel';

import PromptTemplateList from './PromptTemplateList';

// const StyledUpload = styled(Upload)`
//   .ant-upload-select,
//   .ant-upload-list-item-container {
//     width: 100% !important;
//     height: 200px !important;
//   }
// `;

const useStyles = createStyles(({ stylish, css, cx }) =>
  cx(
    stylish.noScrollbar,
    css`
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 8px 8px 0;
    `,
  ),
);

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => resolve(reader.result as string));
    reader.onerror = (error) => reject(error);
  });

interface AgentInputProps {
  image: string | null;
  imageFile: File | null;
  imageHeight: number;
  imageRef: MutableRefObject<any>;
  setImage: Dispatch<SetStateAction<string | null>>;
  setImageFile: Dispatch<SetStateAction<File | null>>;
  setImageHeight: Dispatch<SetStateAction<number>>;
  setOutputImage: Dispatch<SetStateAction<string | null>>;
  setOutputImage1: Dispatch<SetStateAction<string | null>>;
  setOutputImage2: Dispatch<SetStateAction<string | null>>;
  setOutputImage3: Dispatch<SetStateAction<string | null>>;
  setOutputImage4: Dispatch<SetStateAction<string | null>>;
  setOutputImage5: Dispatch<SetStateAction<string | null>>;
  setPrompt: Dispatch<SetStateAction<string>>;
  promptRef: MutableRefObject<string | undefined>;
  tags: string[];
  selectedTags: string[];
}

const AgentInput = (props: AgentInputProps) => {
  const { styles } = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('chat');
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>();
  const [text, setText] = useState('');
  const [promptImages, setPromptImages] = useState([]);
  const [clothingPrompt, setClothingPrompt] = useState('');
  const [genderPrompt, setGenderPrompt] = useState('');
  const [isTagsLoading, setIsTagsLoading] = useState(false);

  const mixtralFileRef = useRef<string | null>(null);

  const upload = async (file: RcFile) => {
    setLoading(true);

    if (file) {
      props.setImageFile(file);
      props.setImageHeight(0);
      props.setImage(URL.createObjectURL(file));
    }
    setLoading(false);
  };

  const handleClearInputs = () => {
    props.setImage(null);
    props.setPrompt('');
    props.setOutputImage(null);
    props.setOutputImage1(null);
    props.setOutputImage2(null);
    props.setOutputImage3(null);
    props.setOutputImage4(null);
    props.setOutputImage5(null);
    setGenderPrompt('');
    setClothingPrompt('');
    props.imageRef.current = null;
    props.promptRef.current = '';
    setPromptImages([]);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.slice(Math.max(0, file.url!.lastIndexOf('/') + 1)));
  };
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleCancel = () => setPreviewOpen(false);

  const clothingTemplates = [
    {
      id: 1,
      label: 'T-shirt',
      prompt: 'T-Shirt, casual wear, casual fashion, cool design',
    },
    {
      id: 2,
      label: 'Suit',
      prompt: 'Suit, formal wear, business attire, office wear, professional attire, business suit',
    },
    {
      id: 3,
      label: 'Jacket',
      prompt: 'Leather Jacket, winter wear, winter fashion, dark color',
    },
    {
      id: 4,
      label: 'Sweater',
      prompt: 'Sweater, winter wear, winter fashion, warm clothing, cozy wear',
    },
  ];

  const genderTemplates = [
    {
      id: 1,
      label: 'Male',
      prompt: 'Male, Young',
    },
    {
      id: 2,
      label: 'Female',
      prompt: 'Female, Young',
    },
  ];

  useEffect(() => {
    const newPrompt = `${genderPrompt ? genderPrompt + ',' : ''} ${clothingPrompt ? clothingPrompt + ',' : ''}`;
    props.setPrompt(newPrompt.trim());
  }, [clothingPrompt, genderPrompt]);

  function extractLinks(text: string) {
    const urlRegex = /(https?:\/\/\S+)/g;
    return text.match(urlRegex);
  }
  const onGetImagesClick = async () => {
    setLoading(true);
    const links = extractLinks(text);
    const mistralApiUrl = btoa(process.env.NEXT_PUBLIC_MISTRAL_API_URL!);
    const hasQueryParams = links && links[0].includes('?');
    const separator = hasQueryParams ? '&' : '?';
    mixtralFileRef.current =
      Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
    const url = `${links && links[0]}${separator}mistralUrl=${mistralApiUrl}&exec=getAllImages&filename=${mixtralFileRef.current}`;
    window.open(url, '_blank');

    setTimeout(async () => {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_MISTRAL_API_URL}/get-images?filename=${mixtralFileRef.current}`,
      );
      const modifiedImages = data.data.images.map((img: string) => {
        return img.replace('/128/128', '/1024/1024');
      });
      setPromptImages(modifiedImages);
      setLoading(false);
    }, 20000);
  };

  async function getImageBlobFromSrc(src: string) {
    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

      const imageBlob = await response.blob();
      return imageBlob;
    } catch (error) {
      console.error('Error getting ImageFile from src:', error);
    }
  }

  const setSelectedImageFile = async (src: string) => {
    setSelectedImage(src);
    if (src) {
      const imageBlob = await getImageBlobFromSrc(src);
      if (imageBlob) {
        const imageFile = new File([imageBlob], 'imagefile', { type: imageBlob.type });
        props.setImageFile(imageFile);
        props.setImage(URL.createObjectURL(imageFile));
      }
    }
  };

  return (
    <FolderPanel>
      <h1
        style={{ color: 'white', fontWeight: 700, marginBottom: 10, marginLeft: 20, marginTop: 20 }}
      >
        House of Models
      </h1>

      <h3 style={{ marginLeft: 20, marginTop: 7 }}>Product link</h3>
      <div style={{ marginLeft: 20, marginRight: 20 }}>
        <div
          style={{
            border: '1px solid #242424',
            borderRadius: '10px',
            bottom: 5,
            display: 'flex',
            justifyContent: 'between',
            left: '10%',
            margin: 'auto',
            padding: '7px',
            width: '100%',
          }}
        >
          <Input
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your link here"
            size="small"
            style={{ border: 'none', padding: '5px', width: '85' }}
          // value={props.prompt}
          />
          <Button
            style={{
              backgroundColor: 'white',
              color: 'black',
              padding: '5px',
              marginBottom: 'auto',
              marginLeft: 10,
              marginTop: 'auto',
              width: '15%',
            }}
            onClick={onGetImagesClick}
          >
            <SendOutlined />
          </Button>
        </div>

        {/* Image output from prompt link */}
        <Spin spinning={loading}>
          <Collapse
            style={{ marginTop: 10, width: '100%' }}
            size="small"
            bordered={false}
            activeKey={promptImages?.length > 0 ? ['1'] : ['']}
            items={[
              {
                key: '1',
                label: 'Images',
                children:
                  promptImages?.length === 0 ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No images generated" />
                  ) : (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2,1fr)',
                        gap: '5px',
                      }}
                    >
                      {promptImages?.map((img, index) => (
                        <div key={index} style={{ display: 'flex' }}>
                          <label>
                            <Radio
                              name="image"
                              checked={selectedImage === img}
                              onChange={() => setSelectedImageFile(img)}
                              style={{
                                display: 'none',
                                position: 'absolute',
                                left: 3,
                                top: 3,
                                zIndex: 2,
                              }}
                            />
                            <div
                              style={{
                                padding: '6px',
                                borderRadius: '10px',
                                border: selectedImage === img ? '2px solid white' : 'none',
                              }}
                            >
                              <img
                                width={120}
                                src={img}
                                style={{
                                  borderRadius: '10px',
                                }}
                              />
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  ),
              },
            ]}
          />
        </Spin>
      </div>

      {/* {selectedImage && (
        <>
          <h3 style={{ marginLeft: 20, marginTop: 20 }}>Preview</h3>
          <div style={{ marginLeft: 20, marginRight: 20 }}>
            <img src={selectedImage} style={{ width: 250, height: 250 }} alt="" />
          </div>
        </>
      )} */}

      {/* <h3 style={{ marginLeft: 20, marginTop: 20 }}>Templates</h3>
      <div style={{ marginLeft: 20, marginRight: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {templates.map((template) => (
            <div key={template.id}>
              <Button
                title={template.temp}
                onClick={() => props.setPrompt(template.temp)}
                style={{
                  display: 'flex',
                  // flexWrap: 'wrap',
                  backgroundColor: '#1D1D1D',
                  color: 'white',
                  padding: '5px',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    // flexWrap: 'wrap',
                    width: '98%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {template.temp}
                </div>
              </Button>
            </div>
          ))}
        </div>
      </div> */}

      <h3 style={{ marginLeft: 20, marginTop: 10 }}>Assets</h3>
      <div style={{ marginLeft: 20, marginRight: 20 }}>
        <Upload
          accept="image/*"
          beforeUpload={async (file) => {
            await upload(file);
            return false;
          }}
          listType="picture"
          className="upload-list-inline"
          multiple={false}
          onChange={handleChange}
          onPreview={handlePreview}
          showUploadList={true}
          style={{
            width: '100%',
            border: '1px solid #242424',
            borderRadius: '10px',
            backgroundColor: '#2A2A2A',
          }}
        >
          {loading ? (
            <Center height={36} width={36}>
              <Icon
                color={theme.colorTextSecondary}
                icon={LucideLoader2}
                size={{ fontSize: 18 }}
                spin
              ></Icon>
            </Center>
          ) : fileList.length >= 1 ? null : (
            <div
              style={{
                alignItems: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                marginLeft: 20,
                marginRight: 20,
                width: '100%',
              }}
            >
              <ActionIcon
                icon={CloudUploadOutlined}
                placement={'bottom'}
                title={t('upload.actionTooltip')}
              />
              <p style={{ color: '#989494' }}>Upload you image here</p>
            </div>
          )}
        </Upload>
      </div>
      <Modal footer={null} onCancel={handleCancel} open={previewOpen} title={previewTitle}>
        <Image alt="example" height={500} src={previewImage} width={470} />
      </Modal>

      <h3 style={{ marginLeft: 20, marginTop: 20 }}>Tags</h3>
      {props.tags && props.tags.length < 1 && (
        <Empty description={<span>No tags</span>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      {props.tags && props.tags.length > 0 ? (
        <div
          style={{
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexWrap: 'wrap',
            fontSize: '0.875rem',
            gap: '0.5rem',
            maxWidth: '300px',
            padding: '1rem',
          }}
        >
          {props.tags.map((tag, index) => (
            <div
              key={index}
              style={{
                alignItems: 'center',
                // backgroundColor: '#edf2f7',
                border: '1px solid',
                borderColor: '#edf2f7',
                borderRadius: '9999px',
                // color: '#2d3748',
                display: 'flex',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
              }}
            >
              <input
                checked={props.selectedTags.includes(tag)}
                // onChange={() => handleTagSelection(tag)}
                type="checkbox"
              />
              {tag}
            </div>
          ))}
        </div>
      ) : (
        <Button
          // onClick={handleCreateTags}
          style={{ marginLeft: 20, marginRight: 20 }}
        >
          {isTagsLoading ? 'Fetching Tags...' : 'Get Tags'}
        </Button>
      )}

      {/* <PromptTemplateList
        heading="Gender"
        templates={genderTemplates}
        setPrompt={setGenderPrompt}
      />

      <PromptTemplateList
        heading="Clothing"
        templates={clothingTemplates}
        setPrompt={setClothingPrompt}
      /> */}

      <DraggablePanelBody className={styles}></DraggablePanelBody>
      <Button
        onClick={handleClearInputs}
        style={{ marginLeft: 20, marginRight: 20, marginBottom: 10 }}
      >
        Clear All
      </Button>
    </FolderPanel>
  );
};

export default AgentInput;
