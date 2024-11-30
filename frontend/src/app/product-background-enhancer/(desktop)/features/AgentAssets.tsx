import { CloudUploadOutlined, GatewayOutlined, SendOutlined } from '@ant-design/icons';
import { ActionIcon, Icon, TextArea } from '@lobehub/ui';
import { Button, Collapse, Divider, Empty, Flex, Modal, Radio, Skeleton, Spin, Switch, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import Input from 'antd/es/input/Input';
import axios from 'axios';
import { LucideLoader2, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Center } from 'react-layout-kit';

import PromptImageTemplateList from '../../components/PromptImageTemplateList';
import { useStyles } from '../styles';
import MotionMaskModal from './MotionMaskModal';
import useProductBG from '../../provider/useProductBG';
import Cookies from 'js-cookie';

interface AgentAssetsProps {
  theme: any;
  fileList: any;
  selectedImage: any;
  loading: any;
  upload: any;
  handleChange: any;
  handlePreview: any;
  handleCancel: any;
  previewOpen: any;
  previewTitle: any;
  previewImage: any;
  setText: any;
  onGetImagesClick: any;
  promptImages: any;
  setSelectedImageFile: any;
  setAgentInputComponent: any;
  handleCreateImage: any;
  setTemplate: any;
  productPrompt: any;
  setProductPrompt: any;
  image: any;
  imageFile: any;
  maskImage: any;
  maskImageFile: any;
  setMaskImage: any;
  setMaskImageFile: any;
  setCanvasImageFile: any;
  isRemoveBgLoading: any;
  setBgImageFile: any;
  isProductMaskLoading: any;
  uploadedBgRefs: any;
  setUploadedBgRefs: any;
  uploadedBgRefFiles: any;
  setUploadedBgRefFiles: any;
  selectedCustomBg: any;
  setSelectedCustomBg: any;
  selectedBgTemplate: any;
  setSelectedBgTemplate: any;
  setBgReferencePrompt: any;
  setManualPrompt: any;
  isProductDescriptionLoading: any;
}

const AgentAssets: React.FC<AgentAssetsProps> = ({
  selectedImage,
  theme,
  loading,
  upload,
  fileList,
  handleChange,
  handlePreview,
  handleCancel,
  previewOpen,
  previewTitle,
  previewImage,
  setText,
  onGetImagesClick,
  promptImages,
  image,
  imageFile,
  setSelectedImageFile,
  setAgentInputComponent,
  handleCreateImage,
  setTemplate,
  productPrompt,
  setProductPrompt,
  maskImageFile,
  maskImage,
  setMaskImage,
  setMaskImageFile,
  setCanvasImageFile,
  isRemoveBgLoading,
  setBgImageFile,
  isProductMaskLoading,
  uploadedBgRefs,
  setUploadedBgRefs,
  uploadedBgRefFiles,
  setUploadedBgRefFiles,
  selectedCustomBg,
  setSelectedCustomBg,
  selectedBgTemplate,
  setBgReferencePrompt,
  setSelectedBgTemplate,
  isProductDescriptionLoading,
  setManualPrompt,
}) => {
  useEffect(() => {
    if (maskImageFile) {
      setIsOpenMotionEdit(true);
    }
  }, [maskImageFile]);

  const removeProductBackground = async (file: File) => {
    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'full');
    formData.append('format', 'png');

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-api-key': process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY,
      },
    };

    await axios
      .post('https://sdk.photoroom.com/v1/segment', formData, {
        ...config,
        responseType: 'blob',
      })
      .then((response) => {
        const contentType = response.headers['content-type'];
        const blob = new Blob([response.data], { type: contentType });

        const file = new File([blob], 'output', { type: contentType });
        setCanvasImageFile(file);
      })
      .catch((error) => {
        setCanvasImageFile(file);
        console.error(error);
      });
    await handleCreateImage(file);
  };

  const { t } = useTranslation('chat');
  const [uploadType, setUploadType] = React.useState('');
  const [modelPrompt, setModelPrompt] = useState('');
  const [isMaskLoading, setIsMaskLoading] = useState(false);
  const [isOpenMotionEdit, setIsOpenMotionEdit] = useState(false);
  const { styles } = useStyles();

  const { isProductDescriptionShow, setIsProductDescriptionShow, modalProductDescription, setModalProductDescription } = useProductBG();

  return (
    <div style={{ height: '90%', padding: '20px 24px', fontFamily: 'BDO Grotesk, sans-serif' }}>
      <h3 style={{ color: 'white' }}>Assets</h3>
      <div>
        <ImgCrop
          showGrid
          rotationSlider
          aspectSlider
          showReset
          modalTitle="Remove Background"
          modalOk="Remove"
        >
          <Upload
            accept="image/*"
            beforeUpload={async (file) => {
              await upload(file);
              removeProductBackground(file);
              setUploadType('direct');
              return false;
            }}
            listType="picture"
            onRemove={(file) => {
              setCanvasImageFile(null);
            }}
            multiple={false}
            onChange={handleChange}
            onPreview={handlePreview}
            fileList={fileList}
            className={styles.upload}
            showUploadList={{
              removeIcon: <Trash2 size={16} />,
            }}
          >
            {loading && uploadType === 'direct' ? (
              <Center height={36} width={36} >
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
                  width: '100%',
                  border: '1px solid #2a2a2a',
                  borderRadius: '10px',
                  padding: '12px',
                  background: '#1F1F1F',
                }}
              >
                <CloudUploadOutlined style={{ color: '#989494' }} />
                <span
                  style={{
                    color: '#989494',
                    marginLeft: '10px',
                    fontWeight: 500,
                    fontFamily: 'BDO Grotesk, sans-serif',
                  }}
                >
                  Upload your file
                </span>
              </div>
            )}
          </Upload>
        </ImgCrop>
      </div>
      <Modal footer={null} onCancel={handleCancel} open={previewOpen} title={previewTitle}>
        <img
          alt="example"
          height={500}
          src={previewImage}
          width={470}
          style={{ objectFit: 'contain' }}
        />
      </Modal>

      <Modal
        onCancel={() => { setIsProductDescriptionShow(false) }}
        open={isProductDescriptionShow} title={"Product Details"}
        width={"40%"}
        footer={null}
      >
        <div style={{ display: "flex", justifyContent: "center", borderRadius: "5px", padding: "8px 0px" }}>
          <img
            alt="example"
            height={300}
            src={image}
            width={470}
            style={{
              objectFit: 'contain',
              borderRadius: "5px",
              // border: "1px solid rgba(58,58,58,1)",
              // padding: "4px",
            }}
          />
        </div>
        <h4 style={{ padding: '8px 8px 0px', color: 'white' }}
        >Describe your product</h4>
        <div className="main-container" style={{ marginBottom: "12px" }}>
          <div className="description">
            <TextArea
              autoFocus
              onBlur={(e) => {
                setModalProductDescription?.(e?.target.value);
              }}
              onChange={(e) => {
                setModalProductDescription?.(e?.target.value);
              }}
              placeholder="Describe your product here..."
              showCount={false}
              size="small"
              value={modalProductDescription}
              className="textarea"
              type={'pure'}
              autoSize={{ minRows: 4, maxRows: 5 }}
            />
          </div>
        </div>
        {/* <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: "12px" }}>
          Describe the product
          <TextArea
            style={{
              width: '80%',
              height: 'auto',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(58,58,58,1)',
              color: 'white',
            }}
            autoFocus
            onChange={(e) => setModalProductDescription(e?.target.value)}
            showCount={false}
            size="small"
            value={modalProductDescription}
            className="textarea"
            type={'pure'}
            autoSize={{ minRows: 1, maxRows: 2 }}
          />
        </div> */}

        <div style={{ display: "flex", justifyContent: "end" }}>
          <Button
            onClick={() => {
              setProductPrompt?.(modalProductDescription);
              setIsProductDescriptionShow(false);
            }}
            type='primary'
            style={{
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'BDO Grotesk, sans-serif',
              marginLeft: '10px',
            }}
          >
            Confirm
          </Button>
        </div>
      </Modal>

      <h3 style={{ padding: '20px 0 12px', color: 'white' }}>Describe your product</h3>
      {isProductDescriptionLoading ? <div
        className="m-5"
        style={{
          backgroundColor: '#1F1F1F',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '10px',
          opacity: isMaskLoading ? 0.5 : 1,
        }}
      >
        <Skeleton.Button active size="large" style={{ height: 88, backgroundColor: '#1F1F1F' }} block={true} />
      </div> :
        <div className="main-container">
          <div className="description">
            <TextArea
              autoFocus
              onBlur={(e) => {
                setProductPrompt?.(e?.target.value);
              }}
              onChange={(e) => {
                setProductPrompt?.(e?.target.value);
              }}
              placeholder="Type your prompt here..."
              showCount={false}
              size="small"
              value={productPrompt}
              className="textarea"
              type={'pure'}
              autoSize={{ minRows: 4, maxRows: 5 }}
            />
          </div>
        </div>
      }
      {/* <div style={{ marginLeft: 20, marginRight: 20 }}>
        <Button
          onClick={() => {
            handleCreateMask();
            // if (!isMaskLoading) {
            //   setIsOpenMotionEdit(!isOpenMotionEdit);
            // }
          }}
          style={{
            border: '1px solid #2a2a2a',
            backgroundColor: 'rgba(31,31,31,1)',
            fontSize: '14px',
            fontWeight: '500',
            color: 'rgba(152,148,148,1)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            borderRadius: '8px',
            borderColor: 'rgba(42,42,42,1)',
            width: '100%',
            padding: '8px',
            gap: '10px',
          }}
          loading={isProductMaskLoading}
        >
          {!isProductMaskLoading && <GatewayOutlined style={{ color: '#989494' }} />}
          {isProductMaskLoading ? "Loading.." : "Remove Background"}
        </Button>
      </div> */}

      {isOpenMotionEdit && (
        <Modal
          footer={null}
          onCancel={() => setIsOpenMotionEdit(!isOpenMotionEdit)}
          open={isOpenMotionEdit}
          closeIcon={false}
          width={'60%'}
          style={{ padding: '0px' }}
        >
          <MotionMaskModal
            setCanvasImageFile={setCanvasImageFile}
            previewImage={image}
            previewImageFile={imageFile}
            toggleMotionEdit={() => setIsOpenMotionEdit(!isOpenMotionEdit)}
            maskImage={maskImage}
            setMaskImage={setMaskImage}
            setMaskImageFile={setMaskImageFile}
          />
        </Modal>
      )}

      <div style={{ padding: '10px 0' }}>
        {/* <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            gap: '8px', // Adjusted to match the gap-2 from the original class
            flexGrow: '0',
            flexShrink: '0',
            flexBasis: 'auto',
            marginTop: '3px',
          }}
        >
          <p
            style={{
              fontSize: '16px', // Converted from text-base to rem
              fontWeight: '500', // Converted from font-medium to 500
              color: 'white',
              whiteSpace: 'pre-wrap',
              flexGrow: '0',
              flexShrink: '0',
              flexBasis: 'auto',
              margin: '0',
            }}
          >
            Real-time Preview
          </p>
          <div style={{ flexGrow: '0', flexShrink: '0', flexBasis: 'auto' }}>
            <Switch defaultChecked onChange={() => { }} style={{}} />
          </div>
        </div> */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            gap: '8px', // Adjusted to match the gap-2 from the original class
            flexGrow: '0',
            flexShrink: '0',
            flexBasis: 'auto',
            paddingTop: '16px',
          }}
        >
          <p
            style={{
              fontSize: '16px', // Converted from text-base to rem
              fontWeight: '500', // Converted from font-medium to 500
              color: 'white',
              whiteSpace: 'pre-wrap',
              flexGrow: '0',
              flexShrink: '0',
              flexBasis: 'auto',
              margin: '0',
            }}
          >
            Themes
          </p>
          {/* <div style={{ flexGrow: '0', flexShrink: '0', flexBasis: 'auto', cursor: 'pointer' }}>
            View all
          </div> */}
        </div>

        <div style={{
          height: `${Cookies.get("hom_isEmailNotVerified") == "true" ? `calc(100vh - 465px)` : `calc(100vh - 425px)`}`,
          scrollbarWidth: 'none',
          overflow: 'auto',
        }}>
          <PromptImageTemplateList
            templates={modelTemplates}
            setBgReferencePrompt={setBgReferencePrompt}
            setTemplate={setTemplate}
            setPrompt={setModelPrompt}
            selectedTemplate={selectedBgTemplate}
            setSelectedTemplate={setSelectedBgTemplate}
            uploader={false}
            setBgImageFile={setBgImageFile}
            uploadedBgRefs={uploadedBgRefs}
            setUploadedBgRefs={setUploadedBgRefs}
            uploadedBgRefFiles={uploadedBgRefFiles}
            setUploadedBgRefFiles={setUploadedBgRefFiles}
            selectedCustomBg={selectedCustomBg}
            setSelectedCustomBg={setSelectedCustomBg}
            setManualPrompt={setManualPrompt}
          />
        </div>
      </div>
      <style jsx>{`
        .main-container {
          justify-content: space-between;
          border-radius: 12px;
          border: 1px solid #242424;
          background-color: #0e0e0e;
          display: flex;
          width: 100%;
          gap: 20px;
          font-size: 14px;
          line-height: 46px;
          padding: 7px 7px 7px 12px;
        }
        @media (max-width: 991px) {
          .main-container {
            max-width: 100%;
            flex-wrap: wrap;
            padding-left: 20px;
          }
        }
        .description {
          color: rgba(185, 176, 176, 0.21);
          font-family:
            BDO Grotesk,
            sans-serif;
          flex-grow: 1;
          flex-basis: auto;
          margin: auto 0;
          display: flex;
          width: 70%;
          align-items: center;
        }
        .image-wrapper {
          border-radius: 8px;
          border: 1px solid #000;
          background-color: #fff;
          display: flex;
          justify-content: space-between;
          gap: 0px;
          color: #000;
          white-space: nowrap;
          text-align: center;
          padding: 12px 15px;
        }
        @media (max-width: 991px) {
          .image-wrapper {
            white-space: initial;
          }
        }
        .img {
          aspect-ratio: 1;
          object-fit: auto;
          object-position: center;
          width: 24px;
          align-self: start;
        }
        .button {
          font-family:
            BDO Grotesk,
            sans-serif;
          flex-grow: 1;
        }
        .textarea {
          overflow: hidden;
          resize: none;
          border: 0;
          background: none;
          font-size: 14px;
          line-height: 1.5;
          width: 100%;
          margin-right: 10px;
          outline: none;
        }
      `}</style>
      {/* <Divider plain>
        <span style={{ color: '#5F5F5F' }}>or</span>
      </Divider> */}

      {/* <h3 style={{ marginLeft: 20, marginTop: 7 }}>Product link</h3> */}
      <div style={{ marginLeft: 20, marginRight: 20 }}>
        {/* <div
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
            loading={loading && uploadType === 'from-link'}
            onClick={() => {
              setUploadType('from-link');
              onGetImagesClick();
            }}
          >
            {!loading && <SendOutlined />}
          </Button>
        </div> */}

        {/* Image output from prompt link */}
        {/* {promptImages?.length > 0 && (
          <>
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
                          {promptImages?.map((img: any, index: number) => (
                            <div key={index} style={{ display: 'flex' }}>
                              <label>
                                <Radio
                                  name="image"
                                  checked={selectedImage === img}
                                  onChange={() => {
                                    setSelectedImageFile(img);
                                  }}
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
            <Button
              onClick={() => {
                setAgentInputComponent('templates');
              }}
              style={{ marginTop: 20, width: '100%' }}
              size="large"
              type={'primary'}
            >
              Next
            </Button>
          </>
        )} */}
      </div>
    </div>
  );
};

export default AgentAssets;

const modelTemplates = [
  {
    id: 1,
    label: 'Basket',
    image: '/prodBGRef/basket.png',
    previewImage: '/prodBGPreview/Basket.png',
    prompt: 'a laundry basket, in front of a beige background',
    manualPrompt: [
      {
        key: 'on',
        label: 'on',
        userPrompt: 'a laundry basket',
      },
      {
        key: 'In front of',
        label: 'In front of',
        userPrompt: 'a beige background',
      },
    ],
  },
  {
    id: 2,
    label: 'Smoke',
    image: '/prodBGRef/smoke.png',
    previewImage: '/prodBGPreview/Smoke.png',
    prompt: 'surrounded by smoky particles, in front of a black background',
    manualPrompt: [
      {
        key: 'Surrounded by',
        label: 'Surrounded by',
        userPrompt: 'smoky particles',
      },
      {
        key: 'In front of',
        label: 'In front of',
        userPrompt: 'a black background',
      },
    ],
  },
  {
    id: 3,
    label: 'Podium',
    image: '/prodBGRef/podium.png',
    previewImage: '/prodBGPreview/Podium.png',
    prompt: 'a podium, surrounded by leaves, in front of a green background',
    manualPrompt: [
      {
        key: 'on',
        label: 'on',
        userPrompt: 'a podium',
      },
      {
        key: 'Surrounded by',
        label: 'Surrounded by',
        userPrompt: 'leaves',
      },
      {
        key: 'In front of',
        label: 'In front of',
        userPrompt: 'a green background',
      },
    ],
  },
  {
    id: 4,
    label: '',
    image: '/prodBGRef/img-1.png',
    previewImage: '/prodBGPreview/Beige.png',
    prompt: 'in front of a natural beige background',
    manualPrompt: [
      {
        key: 'In front of',
        label: 'In front of',
        userPrompt: 'a natural beige background',
      },
    ],
  },
  {
    id: 11,
    label: '',
    image: '/prodBGRef/img-11.png',
    previewImage: '/prodBGPreview/Gray_Room.png',
    prompt: 'in a gray shadowy room with sunlight streaming down',
    manualPrompt: [
      {
        key: 'in',
        label: 'in',
        userPrompt: 'a gray shadowy room',
      },
      {
        key: 'with',
        label: 'with',
        userPrompt: 'sunlight streaming down',
      },
    ],
  },
  {
    id: 5,
    label: '',
    image: '/prodBGRef/img-10.png',
    previewImage: '/prodBGPreview/Red_Background.png',
    prompt: 'a rock surrounded by blooming red flowers, in front of a red background',
    manualPrompt: [
      {
        key: 'on',
        label: 'on',
        userPrompt: 'a rock',
      },
      {
        key: 'Surrounded by',
        label: 'Surrounded by',
        userPrompt: 'blooming red flowers',
      },
      {
        key: 'In front of',
        label: 'In front of',
        userPrompt: 'a red background',
      },
    ],
  },
  {
    id: 7,
    label: '',
    image: '/prodBGRef/img-3.png',
    previewImage: '/prodBGPreview/Wooden_table_orchids.png',
    prompt: 'a wooden small table next to orchids, in front of a dark background',
    manualPrompt: [
      {
        key: 'on',
        label: 'on',
        userPrompt: 'a wooden small table next to orchids',
      },
      {
        key: 'In front of',
        label: 'In front of',
        userPrompt: 'a dark background',
      },
    ],
  },
  {
    id: 8,
    label: '',
    image: '/prodBGRef/img-4.png',
    previewImage: '/prodBGPreview/Yellow_flowers.png',
    prompt: 'a black table surrounded by yellow flowers, in front of white background',
    manualPrompt: [
      {
        key: 'on',
        label: 'on',
        userPrompt: 'a black table',
      },
      {
        key: 'Surrounded by',
        label: 'Surrounded by',
        userPrompt: 'yellow flowers',
      },
      {
        key: 'In front of',
        label: 'In front of',
        userPrompt: 'a white background',
      },
    ],
  },
  {
    id: 9,
    label: '',
    image: '/prodBGRef/img-5.png',
    previewImage: '/prodBGPreview/Blueberries_rock.png',
    prompt: 'a grassy rock surrounded by blueberries, in front of beige background',
    manualPrompt: [
      {
        key: 'on',
        label: 'on',
        userPrompt: 'a grassy rock',
      },
      {
        key: 'Surrounded by',
        label: 'Surrounded by',
        userPrompt: 'blueberries',
      },
      {
        key: 'In front of',
        label: 'In front of',
        userPrompt: 'a beige background',
      },
    ],
  },
  // {
  //   id: 10,
  //   label: '',
  //   image: '/prodBGRef/img-6.png',
  //   previewImage: '/prodBGPreview/img-6.png',
  //   prompt: 'the ocean floor, with light streaming through dark blue water',
  // },
  {
    id: 12,
    label: '',
    image: '/prodBGRef/img-8.png',
    previewImage: '/prodBGPreview/Clover_flowers.png',
    prompt:
      'pebbles surrounded by clover and flowers, with sunlight streaming in the background and bokeh',
    manualPrompt: [
      {
        key: 'on',
        label: 'on',
        userPrompt: 'pebbles',
      },
      {
        key: 'Surrounded by',
        label: 'Surrounded by',
        userPrompt: 'clover and flowers',
      },
      {
        key: 'with',
        label: 'with',
        userPrompt: 'sunlight streaming in the background and bokeh',
      },
    ],
  },
  {
    id: 13,
    label: '',
    image: '/prodBGRef/img-9.png',
    previewImage: '/prodBGPreview/Moss_foliage.png',
    prompt: 'moss surrounded by plants and foliage, with sunshine streaming down',
    manualPrompt: [
      {
        key: 'on',
        label: 'on',
        userPrompt: 'a moss',
      },
      {
        key: 'Surrounded by',
        label: 'Surrounded by',
        userPrompt: 'plants and foliage',
      },
      {
        key: 'with',
        label: 'with',
        userPrompt: 'sunshine streaming down',
      },
    ],
  },
  {
    id: 14,
    label: '',
    image: '/prodBGRef/img-12.jpg',
    previewImage: '/prodBGPreview/Purple_sky.png',
    prompt: 'top a brown rock, in front of a purple tinted sky with dark clouds',
    manualPrompt: [
      {
        key: 'on',
        label: 'on',
        userPrompt: 'top a brown rock',
      },
      {
        key: 'In front of',
        label: 'In front of',
        userPrompt: 'a purple tinted sky with dark clouds',
      },
    ],
  },
  {
    id: 15,
    label: '',
    image: '/prodBGRef/img-13.jpg',
    previewImage: '/prodBGPreview/White_couch.png',
    prompt: 'an armrest of a white cloth couch',
    manualPrompt: [
      {
        key: 'on',
        label: 'on',
        userPrompt: 'an armrest of a white cloth couch',
      },
    ],
  },
  {
    id: 16,
    label: '',
    image: '/prodBGRef/img-14.jpg',
    previewImage: '/prodBGPreview/Black_cloth.png',
    prompt: 'lying on a black cloth',
    manualPrompt: [
      {
        key: 'lying on',
        label: 'lying on',
        userPrompt: 'a black cloth',
      },
    ],
  },
  // {
  //   id: 17,
  //   label: '',
  //   image: '/prodBGRef/img-15.jpg',
  //   previewImage: '/prodBGPreview/img-15.png',
  //   prompt: 'a podium, in a blue room',
  // },
  {
    id: 18,
    label: '',
    image: '/prodBGRef/img-16.jpg',
    previewImage: '/prodBGPreview/Wooden_podium_nature.png',
    prompt: 'a wooden podium, in front of blurred nature leaves',
    manualPrompt: [
      {
        key: 'on',
        label: 'on',
        userPrompt: 'a wooden podium',
      },
      {
        key: 'In front of',
        label: 'In front of',
        userPrompt: 'blurred nature leaves',
      },
    ],
  },
  {
    id: 19,
    label: '',
    image: '/prodBGRef/img-17.jpg',
    previewImage: '/prodBGPreview/White_stone_podium.png',
    prompt: 'a white stone podium, in a white room',
    manualPrompt: [
      {
        key: 'on',
        label: 'on',
        userPrompt: 'a white stone podium',
      },
      {
        key: 'in',
        label: 'in',
        userPrompt: 'a white room',
      },
    ],
  },
  {
    id: 20,
    label: '',
    image: '/prodBGRef/img-18.png',
    previewImage: '/prodBGPreview/Dock.png',
    prompt: 'a dock, in front of the sea',
    manualPrompt: [
      {
        key: 'on',
        label: 'on',
        userPrompt: 'a dock',
      },
      {
        key: 'In front of',
        label: 'In front of',
        userPrompt: 'the sea',
      },
    ],
  },
  {
    id: 21,
    label: '',
    image: '/prodBGRef/i-1.jpg',
    previewImage: '/prodBGPreview/bedroom.png',
    prompt: 'a wooden floor, in a bedroom, in front of a bed with pillows and a window',
    manualPrompt: [
      {
        key: 'on',
        label: 'on',
        userPrompt: 'a wooden floor',
      },
      {
        key: 'in',
        label: 'in',
        userPrompt: 'a bedroom',
      },
      {
        key: 'In front of',
        label: 'In front of',
        userPrompt: 'a bed with pillows and a window',
      },
      {
        key: 'with',
        label: 'with',
        userPrompt: 'pillows and a window',
      },
    ],
  },
  {
    id: 22,
    label: '',
    image: '/prodBGRef/i-2.png',
    previewImage: '/prodBGPreview/bathroom.png',
    prompt: 'a bathroom counter, in front of luxurious bathroom',
    manualPrompt: [
      {
        key: 'on',
        label: 'on',
        userPrompt: 'a bathroom counter',
      },
      {
        key: 'in',
        label: 'in',
        userPrompt: 'a luxurious bathroom',
      },
    ],
  },
  {
    id: 23,
    label: '',
    image: '/prodBGRef/i-3.png',
    previewImage: '/prodBGPreview/beach.png',
    prompt: 'a wooden table, in front of beach umbrellas and party',
    manualPrompt: [
      {
        key: 'on',
        label: 'on',
        userPrompt: 'a wooden table',
      },
      {
        key: 'In front of',
        label: 'In front of',
        userPrompt: 'beach umbrellas and party',
      },
    ],
  },
  {
    id: 24,
    label: '',
    image: '/prodBGRef/i-4.png',
    previewImage: '/prodBGPreview/office.png',
    prompt: 'an office desk next to houseplant and books, in front of window with blue skies',
    manualPrompt: [
      {
        key: 'on',
        label: 'on',
        userPrompt: 'an office desk next to houseplant and books',
      },
      {
        key: 'In front of',
        label: 'In front of',
        userPrompt: 'window with blue skies',
      },
      {
        key: 'with',
        label: 'with',
        userPrompt: 'blue skies',
      },
    ],
  },
];
