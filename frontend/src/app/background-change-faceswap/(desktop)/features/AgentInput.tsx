import { CloudUploadOutlined, SendOutlined } from '@ant-design/icons';
import { ActionIcon, DraggablePanelBody, Icon } from '@lobehub/ui';
import { Button, Collapse, Divider, Empty, GetProp, Image, Modal, Radio, Spin, Upload } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import Input from 'antd/es/input/Input';
import { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
import axios from 'axios';
import JSZip from 'jszip';
import { LucideLoader2, LucideUpload } from 'lucide-react';
// import Image from 'next/image';
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Center } from 'react-layout-kit';
import styled from 'styled-components';

import FolderPanel from '@/features/FolderPanel';

import PromptTemplateList from './PromptTemplateList';
import tag_workflow from './workflow_tag_api.json';

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

const StyledUpload = styled(Upload)`
  .ant-upload-select,
  .ant-upload-list-item-container {
    width: 100% !important;
    height: 150px !important;
  }
`;

interface AgentInputProps {
  faceImage: string | null;
  faceImageFile: File | null;
  faceImageHeight: number;
  faceImageRef: MutableRefObject<any>;
  filenameRef: MutableRefObject<string | undefined>;
  image: string | null;
  imageFile: File | null;
  imageHeight: number;
  imageRef: MutableRefObject<any>;
  selectedTags: string[];
  setFaceImage: Dispatch<SetStateAction<string | null>>;
  setFaceImageFile: Dispatch<SetStateAction<File | null>>;
  setFaceImageHeight: Dispatch<SetStateAction<number>>;
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
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
  setTags: Dispatch<SetStateAction<string[]>>;
  tags: string[];
  tagsRef: MutableRefObject<string | undefined>;
  agentInputComponent: string;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => resolve(reader.result as string));
    reader.onerror = (error) => reject(error);
  });

const AgentInput = (props: AgentInputProps) => {
  const { styles } = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('chat');
  const [loading, setLoading] = useState(false);
  const [AccordionLoading, setAccordionLoading] = useState(false);
  // const [tags, setTags] = useState<string[]>([]);
  const [isTagsLoading, setIsTagsLoading] = useState(false);

  const [previewOpen1, setPreviewOpen1] = useState(false);
  const [previewImage1, setPreviewImage1] = useState('');
  const [previewTitle1, setPreviewTitle1] = useState('');
  const [fileList1, setFileList1] = useState<UploadFile[]>([]);

  const [previewOpen2, setPreviewOpen2] = useState(false);
  const [previewImage2, setPreviewImage2] = useState('');
  const [previewTitle2, setPreviewTitle2] = useState('');
  const [fileList2, setFileList2] = useState<UploadFile[]>([]);

  const [backgroundPrompt, setBackgroundPrompt] = useState('');
  const [cameraEffectsPrompt, setCameraEffectsPrompt] = useState('');

  const [selectedImage, setSelectedImage] = useState<string>();
  const [text, setText] = useState('');
  const [promptImages, setPromptImages] = useState([]);
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
  const uploadFace = async (file: RcFile) => {
    setLoading(true);

    if (file) {
      props.setFaceImageFile(file);
      props.setFaceImageHeight(0);
      props.setFaceImage(URL.createObjectURL(file));
    }
    setLoading(false);
  };

  const fetchLatestFiles = async (url: string) => {
    try {
      const response = await axios.get(url, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/zip' });

      const zip = new JSZip();
      zip.loadAsync(blob).then((zip) => {
        for (const filename of Object.keys(zip.files)) {
          zip.files[filename].async('blob').then((fileBlob) => {
            if (filename.endsWith('.txt')) {
              const reader = new FileReader();
              reader.addEventListener('load', function (event) {
                const textContent = event.target?.result;
                props.tagsRef.current = textContent as string;
                const tags = typeof textContent === 'string' ? textContent.split(',') : [];
                props.setTags(tags);
                props.setSelectedTags(tags);
                setIsTagsLoading(false);
              });
              // eslint-disable-next-line unicorn/prefer-blob-reading-methods
              reader.readAsText(fileBlob);
            }
          });
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCreateTags = async () => {
    props.setOutputImage(null);
    setIsTagsLoading(true);

    try {
      const formData = new FormData();
      const randomName =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
      const newFile = new File([props.imageFile as File], randomName, {
        type: (props.imageFile as File).type,
      });

      formData.append('image', newFile);
      props.filenameRef.current = randomName;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
    } catch (error) {
      console.error('Error:', error);
      return;
    }

    try {
      setTimeout(async () => {
        tag_workflow['10']['inputs']['image'] = '../input/' + props.filenameRef.current + '.jpg';

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_COMFY_API_URL}/prompt?url=${process.env.NEXT_PUBLIC_COMFY_UI_URL}`,
          {
            prompt: tag_workflow,
          },
        );

        if (response.status === 200) {
          setTimeout(
            () => fetchLatestFiles(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/latest-tags`),
            10_000,
          );
        }
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTagSelection = (tag: string) => {
    if (props.selectedTags.includes(tag)) {
      props.setSelectedTags(props.selectedTags.filter((t) => t !== tag));
    } else {
      props.setSelectedTags([...props.selectedTags, tag]);
    }
  };

  const handleClearInputs = () => {
    props.setImage(null);
    props.setFaceImage(null);
    props.setImageHeight(0);
    props.setFaceImageHeight(0);
    props.setTags([]);
    props.setPrompt('');
    props.setOutputImage(null);
    props.setOutputImage1(null);
    props.setOutputImage2(null);
    props.setOutputImage3(null);
    props.setOutputImage4(null);
    props.setOutputImage5(null);
    setBackgroundPrompt('');
    setCameraEffectsPrompt('');
    props.tagsRef.current = '';
    props.imageRef.current = null;
    props.faceImageRef.current = null;
  };

  const handleCancel = (uploadNumber: number) => {
    if (uploadNumber === 1) {
      setPreviewOpen1(false);
    } else {
      setPreviewOpen2(false);
    }
  };

  const handlePreview = async (file: UploadFile, uploadNumber: number) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    if (uploadNumber === 1) {
      setPreviewImage1(file.url || (file.preview as string));
      setPreviewOpen1(true);
      setPreviewTitle1(file.name || file.url!.slice(Math.max(0, file.url!.lastIndexOf('/') + 1)));
    } else {
      setPreviewImage2(file.url || (file.preview as string));
      setPreviewOpen2(true);
      setPreviewTitle2(file.name || file.url!.slice(Math.max(0, file.url!.lastIndexOf('/') + 1)));
    }
  };

  const handleChange1: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList1(newFileList);

  const handleChange2: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList2(newFileList);

  const backgroundTemplates = [
    {
      id: 9,
      label: 'Beach',
      prompt:
        '((sunny beach, clear blue sea, sandy shore, tropical), palm trees, gentle waves, sunbathing, ((vivid colors, vibrant, high resolution)))',
    },
    {
      id: 10,
      label: 'City',
      prompt:
        '(city street, urban), cinematic, (dramatic lighting, wide angle, (night), rain, (futuristic, cyberpunk, Blade Runner style, neon lights), HD), UHD, (high contrast, gritty), dark',
    },
    {
      id: 11,
      label: 'Forest',
      prompt:
        '(dense forest, tall trees, foliage, lush greenery, sunlight filtering through leaves, dappled light), moss-covered branches, thick undergrowth, wildlife, birds, squirrels, nature photography, (high resolution, HD, 4k), foggy, misty, soft focus',
    },
    {
      id: 12,
      label: 'Mountain',
      prompt:
        '((majestic snow-capped mountain, landscape, winter), alpine glow, dramatic lighting, HDR, high-resolution, 8k), wilderness',
    },
  ];

  const cameraEffectsTemplates = [
    {
      id: 13,
      label: 'Bokeh effect',
      prompt:
        'portrait, bokeh effect, blurred background, focused subject, dramatic lighting, (high resolution, 4k, HD, (vivid colors, shallow depth of field, professional photograph))',
    },
    {
      id: 14,
      label: 'Lens flare',
      prompt:
        '((dramatic lens flare), cinematic, dramatic lighting, intense contrast), HD, telephoto lens, wide angle, vivid colors, high quality, professional photograph',
    },
    {
      id: 15,
      label: 'Chromatic aberration',
      prompt: '(vintage, lo-fi look, chromatic aberration, retro, film grain, VHS effect)',
    },
    {
      id: 16,
      label: 'Lens Distortion',
      prompt:
        '((fisheye effect, lens distortion), wide field of view, barrel distortion, (ultra-wide angle lens)), vintage look, (spherical), retro, cinematic, high quality, (exaggerated perspective)',
    },
    {
      id: 17,
      label: 'Tilt-shift',
      prompt:
        '(tilt-shift effect, miniature model-like scene, bright colors, vibrant, artificial lighting, sunny day, cheerful atmosphere, tiny people, small cars, detailed buildings, toy-like, shallow depth of field, exaggerated bokeh, professional photograph, HD)',
    },
    {
      id: 18,
      label: 'Vintage',
      prompt:
        '((nostalgic vintage scene, old-fashioned look, sepia tone, film grain, 35mm camera, vintage filter), aged paper texture, antique feel), soft focus, classic cars, retro fashion',
    },
    {
      id: 19,
      label: 'Zoom burst',
      prompt:
        '((zoom burst effect, sense of motion or action), high resolution, vibrant colors, (dynamic composition, fast shutter speed, wide aperture), bokeh, HDR, professional photograph, cinematic), trending on Instagram',
    },
    {
      id: 20,
      label: 'Heat distortion',
      prompt:
        '((heat distortion effect, hot and hazy atmosphere), sunset, long exposure, dramatic lighting, HD, close-up, landscape, photorealistic, cinematic, HDR, telephoto lens, soft focus)',
    },
    {
      id: 21,
      label: 'Prismatic film filters',
      prompt:
        '(psychedelic and colorful effect, prismatic film filters, vibrant colors, kaleidoscopic patterns), trippy, vibrant, surreal, abstract art, experimental, bokeh, vibrant lights, lens flare',
    },
    {
      id: 22,
      label: 'Helios swirly bokeh',
      prompt:
        '(dreamy, swirling bokeh effect, Helios lens, vintage style, soft lighting), artistic, masterpiece, high quality, portrait photography, vintage, classic, retro, shallow depth of field, circular bokeh',
    },
    {
      id: 23,
      label: 'Prism',
      prompt:
        '(((refraction of light, prism, interesting light effects, dramatic lighting, high resolution, HDR, Bokeh, professional photograph), vivid colors, rainbow, color spectrum))',
    },
  ];

  useEffect(() => {
    const newPrompt = `${backgroundPrompt ? backgroundPrompt + ',' : ''} ${cameraEffectsPrompt ? cameraEffectsPrompt + ',' : ''}`;
    props.setPrompt(newPrompt.trim());
  }, [backgroundPrompt, cameraEffectsPrompt]);

  function extractLinks(text: string) {
    const urlRegex = /(https?:\/\/\S+)/g;
    return text.match(urlRegex);
  }
  const onGetImagesClick = async () => {
    setAccordionLoading(true);
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
      setAccordionLoading(false);
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
        Background Change + Faceswap
      </h1>

      {/* <Modal
        footer={null}
        onCancel={() => handleCancel(1)}
        open={previewOpen1}
        title={previewTitle1}
      >
        <Image alt="example" height={500} src={previewImage1} width={470} />
      </Modal> */}

      {props.agentInputComponent === 'assets' ? (
        <>
          <h3 style={{ marginLeft: 20, marginTop: 10 }}>Assets</h3>
          <div style={{ display: 'flex', width: '100%', marginTop: 10, paddingLeft: '20px' }}>
            {/* <Upload
          accept="image/*"
          beforeUpload={async (file) => {
            await upload(file);
            return false;
          }}
          fileList={fileList1}
          listType="picture-card"
          multiple={false}
          onChange={handleChange1}
          onPreview={(file) => handlePreview(file, 1)}
          showUploadList={true}
          style={{ marginTop: 20, width: '100%' }}
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
          ) : fileList1.length >= 1 ? null : (
            <div
              style={{
                alignItems: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
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
              <p style={{ color: '#989494' }}>Upload Product Image</p>
            </div>
          )}
        </Upload> */}
            {/* <div style={{ marginTop: 20 }} /> */}
            <Upload
              accept="image/*"
              beforeUpload={async (file) => {
                await uploadFace(file);
                return false;
              }}
              fileList={fileList2}
              listType="picture"
              className="upload-list-inline"
              multiple={false}
              onChange={handleChange2}
              onPreview={(file) => handlePreview(file, 2)}
              showUploadList={true}
              style={{ marginTop: 20, width: '100%' }}
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
              ) : fileList2.length >= 1 ? null : (
                <div
                  style={{
                    alignItems: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '270px',
                    border: '1px solid #2a2a2a',
                    borderRadius: '10px',
                  }}
                >
                  <ActionIcon
                    icon={CloudUploadOutlined}
                    placement={'bottom'}
                    title={t('upload.actionTooltip')}
                  />
                  <p style={{ color: '#989494' }}>Upload your file</p>
                </div>
              )}
            </Upload>
          </div>
          <Modal
            footer={null}
            onCancel={() => handleCancel(2)}
            open={previewOpen2}
            title={previewTitle2}
          >
            <Image alt="example" height={500} src={previewImage2} width={470} />
          </Modal>

          <Divider plain>
            <p style={{ color: '#5F5F5F' }}>or</p>
          </Divider>

          {/* <h3 style={{ marginLeft: 20, marginTop: 7 }}>Product link</h3> */}
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
            {promptImages?.length > 0 && (
              <Spin spinning={AccordionLoading}>
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
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No images generated"
                          />
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
            )}
          </div>
        </>
      ) : props.agentInputComponent === 'edit' ? (
        <>
          <h3 style={{ marginLeft: 20, marginTop: 10 }}>Edit</h3>

          {/* {selectedImage && (
        <>
          <h3 style={{ marginLeft: 20, marginTop: 20 }}>Preview</h3>
          <div style={{ marginLeft: 20, marginRight: 20 }}>
            <img src={selectedImage} style={{ width: 250, height: 250 }} alt="" />
          </div>
        </>
      )} */}

          <h3 style={{ marginLeft: 20, marginTop: 20 }}>Tags</h3>
          {props.tags && props.tags.length < 1 && (
            <Empty description={<span>No tags</span>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
          {props.tags && props.tags.length > 0 ? (
            <div
              style={{
                boxShadow:
                  '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
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
                    onChange={() => handleTagSelection(tag)}
                    type="checkbox"
                  />
                  {tag}
                </div>
              ))}
            </div>
          ) : (
            <Button onClick={handleCreateTags} style={{ marginLeft: 20, marginRight: 20 }}>
              {isTagsLoading ? 'Fetching Tags...' : 'Get Tags'}
            </Button>
          )}
          {/* {tags && tags.length > 0 && (
        <Upload
          accept="image/*"
          beforeUpload={async (file) => {
            await uploadFace(file);
            return true;
          }}
          multiple={false}
          showUploadList={true}
          style={{ width: '100%' }}
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
          ) : (
            <div
              style={{
                alignItems: 'center',
                border: '0.5px solid',
                borderColor: 'white',
                borderRadius: 20,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                marginLeft: 20,
                marginRight: 20,
                marginTop: 20,
                width: '100%',
              }}
            >
              <ActionIcon
                icon={LucideImage}
                placement={'bottom'}
                title={t('upload.actionTooltip')}
              />
              <p>Upload your face</p>
            </div>
          )}
        </Upload>
      )} */}
        </>
      ) : null}
      <PromptTemplateList
        heading="Background Type"
        templates={backgroundTemplates}
        setPrompt={setBackgroundPrompt}
      />
      <PromptTemplateList
        heading="Camera Effects"
        templates={cameraEffectsTemplates}
        setPrompt={setCameraEffectsPrompt}
      />
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
