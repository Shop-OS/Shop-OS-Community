import {
  CaretDownOutlined,
  CloudUploadOutlined,
  FormatPainterOutlined,
  LoadingOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { ActionIcon, Icon, TextArea } from '@lobehub/ui';
import { Button, Collapse, Divider, Dropdown, Empty, MenuProps, Modal, Radio, Skeleton, Spin, Upload } from 'antd';
import { LucideLoader2, Trash2 } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Center } from 'react-layout-kit';

import { useStyles } from '../styles';
import PromptImageTemplateList from '@/components/PromptImageTemplateList';
import { ootdModelTemplateList } from '@/const/dataConst';
import Cookies, { set } from 'js-cookie';
import MaskingModal from './MaskingModal/MaskingModal';
import useOutfit from '../../provider/useOutfit';
import { MotionBrushSVG } from '@/components/IconSvg';
import axios from 'axios';
import AxiosProvider from '@/utils/axios';
import bg_workflow from './workflow/workflow__bg_change_api_1_3.json';


// const ootdMenuType: MenuProps['items'] = [
//   {
//     label: <span>Upper Body</span>,
//     key: 'upper_half',
//   },
//   {
//     label: <span>Lower Body</span>,
//     key: 'lower_half',
//   },
//   {
//     label: <span>Full Body</span>,
//     key: 'full_body',
//   },
// ];
const ootdMenuType: MenuProps['items'] = [
  {
    label: <span>Upper Body</span>,
    key: 'upper_body',
  },
  {
    label: <span>Lower Body</span>,
    key: 'lower_body',
  },
  {
    label: <span>Full Body</span>,
    key: 'dresses',
  },
];

interface AgentAssetsProps {
  image: any;
  imageFile: any;
  theme: any;
  fileList: any;
  // selectedImage: any;
  loading: any;
  upload: any;
  handleChange: any;
  handlePreview: any;
  handleCancel: any;
  previewOpen: any;
  previewTitle: any;
  previewImage: any;
  fileUploadLoading: any;
  setFileUploadLoading: any;
  setBackgroundPrompt: any;
  setBackgroundNegativePrompt: any;
  selectedBackgroundTemplate: any;
  setBackgroundLora: any;
  setBackgroundLoraModelStrength: any;
  setBackgroundLoraClipStrength: any;
  setSelectedBackgroundTemplate: any;
  setBgModel: any;
  bgImageFile: any;
  setBgImageFile: any;
  ootdType: any;
  setOotdType: any;
  prompt: any;
  setPrompt: any;
}

const AgentAssets: React.FC<AgentAssetsProps> = ({
  image,
  imageFile,
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
  fileUploadLoading,
  setFileUploadLoading,
  setBackgroundPrompt,
  setBackgroundNegativePrompt,
  selectedBackgroundTemplate,
  setBackgroundLora,
  setBackgroundLoraModelStrength,
  setBackgroundLoraClipStrength,
  setSelectedBackgroundTemplate,
  setBgModel,
  bgImageFile,
  setBgImageFile,
  ootdType,
  setOotdType,
  prompt,
  setPrompt,
}) => {
  const [uploadType, setUploadType] = React.useState('');
  const {
    isMaskingModalOpen,
    setIsMaskingModalOpen,
    maskImage,
    setMaskImage,
    setPinkMaskImage,
    isMaskLoading,
    setIsMaskLoading,
    productMaskDescription,
    setProductMaskDescription,
    maskImageFile,
    setMaskImageFile,
  } = useOutfit();
  const [maskImageShouldFetch, setMaskImageShouldFetch] = React.useState(false);
  const [maskInputImage, setMaskInputImage] = React.useState('');

  const [maskInputFile, setMaskInputFile] = React.useState<File>();

  const [showMaskingButton, setShowMaskingButton] = React.useState(false);

  const { styles } = useStyles();
  const maskFileNameRef = useRef('');
  const fetchQueueRef = useRef<string[]>([]);

  function renderContent() {
    if (loading && uploadType === 'direct') {
      return (
        <Center height={36} width={36}>
          <Icon
            color={theme.colorTextSecondary}
            icon={LucideLoader2}
            size={{ fontSize: 18 }}
            spin
          ></Icon>
        </Center>
      );
    } else if (fileList.length >= 1) {
      return null;
    } else {
      return (
        <div
          style={{
            alignItems: 'center',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            margin: 'auto',
            border: '1px solid #2a2a2a',
            borderRadius: '10px',
            padding: '12px 63.5px 12px 63.5px',
            background: '#1F1F1F',
            fontSize: '14px',
            fontFamily: 'BDO Grotesk, sans-serif',
          }}
        >
          <CloudUploadOutlined style={{ color: '#989494', fontSize: "18px" }} />
          <span style={{ color: '#989494', marginLeft: '10px', fontWeight: 500 }}>
            Upload your file
          </span>
        </div>
      );
    }
  }

  useEffect(() => {
    if (fetchQueueRef.current.length === 0 || maskImageShouldFetch === false) return;
    const intervalId = setInterval(() => {
      if (fetchQueueRef.current.length === 0) {
        setMaskImageShouldFetch(false);
        clearInterval(intervalId);
        return;
      }
      fetchQueueRef.current.forEach((filename) => {
        fetchImageByFileName(
          `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file?filename=${filename}`,
          filename,
        );
      });
    }, 3_000);

    return () => clearInterval(intervalId);
  }, [maskImageShouldFetch]);

  const fetchImageByFileName = async (url: string, imageFileName: string) => {
    try {
      const response = await axios.get(url, {
        responseType: 'blob',
      });
      if (response.status === 204) {
        return;
      } else if (response.status === 200) {
        fetchQueueRef.current = fetchQueueRef.current.filter(
          (filename) => filename !== imageFileName,
        );

        const blob = new Blob([response.data], { type: 'image/png' });
        const objectURL = URL.createObjectURL(blob);

        const file = new File([blob], 'maskImage', { type: 'image/png' });
        setMaskImage(objectURL);
        setMaskImageFile(file);
        setIsMaskLoading(false);
        setIsMaskingModalOpen(true);
        // if (props.imageFile) {
        //   handleFetchProductDescription(props.imageFile);
        // }
      }
    } catch (error) {
      console.error('Error:', error);
      setIsMaskLoading(false);
    }
  };

  const handleCreateImage = async function (file: File) {
    try {
      setIsMaskLoading(true);
      const formData = new FormData();
      const randomName1 =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
      const newFile1 = new File([file as File], randomName1, {
        type: (file as File)?.type ?? 'image/jpeg',
      });

      formData.append('image', newFile1);
      maskFileNameRef.current = randomName1;
      await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (productMaskDescription.trim().length > 0) {
        bg_workflow['4']['inputs']['prompt'] = productMaskDescription;
      } else {
        bg_workflow['4']['inputs']['prompt'] = 'clothes, pants';
      }
      bg_workflow['1']['inputs']['image'] = '../input/' + maskFileNameRef.current + '.jpg';
      bg_workflow['8']['inputs']['filename_prefix'] = maskFileNameRef.current ?? '';

      const response = await AxiosProvider.post(`/prompt`, { prompt: bg_workflow, front: true });

      if (response.status === 200) {
        try {
          setMaskImageShouldFetch(true);
          setPinkMaskImage(null);
          for (let i = 1; i < 2; i++) {
            fetchQueueRef.current.push(maskFileNameRef.current + '_0000' + i);
          }
        } catch (error) {
          setIsMaskLoading(false);
          console.error('Error:', error);
        }
      }
    } catch (error) {
      setIsMaskLoading(false);
      console.error('Error:', error);
    }
  };

  return (
    <>
      <h3 style={{
        marginLeft: 20, color: 'white',
        fontFamily: 'BDO Grotesk, sans-serif',
        fontSize: '16px',
      }}>Assets
        {/* <span style={{
          fontSize: "12px",
          color: '#AAA',
          paddingLeft: '4px',
        }}>
          (Only Flatshots of the clothes are supported)
        </span> 
        */}
      </h3>
      <div style={{ padding: '0 20px' }}>
        <Upload
          accept="image/jpg, image/jpeg, image/png, image/avif"
          beforeUpload={async (file) => {
            setFileUploadLoading(true);
            await upload(file);
            setUploadType('direct');
            return false;
          }}
          listType="picture"
          multiple={false}
          onChange={handleChange}
          onPreview={handlePreview}
          showUploadList={{
            removeIcon: <Trash2 size={16} />,
          }}
          className={styles.upload}
          fileList={fileList}
          disabled={fileUploadLoading}
        >
          {fileUploadLoading ? (
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
                padding: '12px 63.5px 12px 63.5px',
                background: '#1F1F1F',
              }}
            >
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              <span style={{ paddingLeft: '18px' }}>Uploading...</span>
            </div>
          ) : (
            renderContent()
          )}
        </Upload>
      </div>

      <Modal
        footer={null}
        onCancel={handleCancel}
        open={previewOpen}
        title={previewTitle}
        maskClosable={false}
      >
        <img
          alt="example"
          height={500}
          src={previewImage}
          width={470}
          style={{ objectFit: 'contain' }}
        />
      </Modal>

      {isMaskingModalOpen && (
        <Modal
          footer={null}
          onCancel={() => { }}
          open={isMaskingModalOpen}
          closeIcon={false}
          width={'80%'}
          styles={{
            content: {
              backgroundColor: '#202020',
              padding: '16px',
            },
          }}
          maskClosable={false}
        >
          <MaskingModal
            isMaskLoading={isMaskLoading}
            imageFile={maskInputImage}
            productMaskDescription={productMaskDescription}
            setProductMaskDescription={setProductMaskDescription}
            previewImage={maskInputImage}
            toggleMotionEdit={() => {
              setIsMaskingModalOpen(false);
            }}
            setMaskImageFile={setMaskImageFile}
            handleCreateMask={() => {
              if (maskInputFile) {
                handleCreateImage(maskInputFile)
              }
            }}
            setIsMaskLoading={setIsMaskLoading}
          />
          {/* <MaskingModal
            imageSrc={maskInputImage}
            previewImage={maskInputImage}
            toggleModal={() => {
              setIsMaskingModalOpen(false);
            }}
            setMagicMaskImageFile={setMaskImage}
            idx={1}
            magicFix={(idx: any, image: any) => {
              setMaskImage(image);
            }}
          /> */}
        </Modal>
      )}
      <div style={{ padding: "0 16px" }}>
        <h3 style={{ padding: '20px 0 12px', color: 'white' }}>Describe your product</h3>
        <div className="main-container">
          <div className="description">
            <TextArea
              autoFocus
              onBlur={(e) => {
                setPrompt(e?.target.value);
              }}
              onChange={(e) => {
                setPrompt(e?.target.value);
              }}
              placeholder="Describe you product here..."
              showCount={false}
              size="small"
              value={prompt}
              className="textarea"
              type={'pure'}
              autoSize={{ minRows: 4, maxRows: 5 }}
            />
          </div>
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
          padding: '20px 16px 10px',
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
          Garment category
        </p>
      </div>
      <div style={{
        padding: "0 20px",
        width: "100%",
      }}>
        <Dropdown
          menu={{
            items: ootdMenuType,
            onClick: (value) => {
              setOotdType(value.key);
            },
          }}
        >
          <Button
            onClick={(e) => e.preventDefault()}
            style={{
              border: '#2A2A2A 1px solid',
              background: '#0B0B0B',
              borderRadius: '10px',
              padding: '10px 10px',
              height: '45px',
              width: '100%',
              marginTop: '4px',
              marginRight: '5px',
            }}
          >
            <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span
                style={{
                  fontSize: '14px',
                  color: 'white',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {ootdType === 'upper_body' ? 'Upper Body' : ootdType === 'lower_body' ? 'Lower Body' : 'Full Body'}
              </span>
              <CaretDownOutlined style={{ marginLeft: 4 }} />
            </span>
          </Button>
        </Dropdown>
      </div>
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
          padding: '20px 16px 10px',
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
          Models
        </p>
      </div>

      {showMaskingButton && <>
        {isMaskLoading ? (
          <div
            className="m-5"
            style={{
              backgroundColor: '#181717',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minWidth: '275px',
              padding: '7px',
              borderRadius: '8px',
              margin: '14px',
              opacity: isMaskLoading ? 0.5 : 1,
            }}
          >
            <Skeleton.Button active size="large" block={true} />{' '}
          </div>
        ) : (
          <div
            className="m-5"
            style={{
              backgroundColor: '#181717',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minWidth: '275px',
              padding: '7px',
              borderRadius: '8px',
              margin: '14px',
              opacity: isMaskLoading ? 0.5 : 1,
              pointerEvents: isMaskLoading ? 'none' : 'auto',
            }}
            onClick={() => {
              if (!isMaskLoading) {
                setIsMaskingModalOpen(!isMaskingModalOpen);
              }
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start',
                flexWrap: 'nowrap',
                flexGrow: '0',
                flexShrink: '0',
                flexBasis: 'auto',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(33,33,33,1)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  width: '34px',
                  height: '34px',
                  flexGrow: '0',
                  flexShrink: '0',
                  flexBasis: 'auto',
                  borderRadius: '8px ',
                }}
              >
                <MotionBrushSVG />
              </div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'white',
                  whiteSpace: 'pre-wrap',
                  flexGrow: '0',
                  flexShrink: '0',
                  flexBasis: 'auto',
                  marginLeft: '10px',
                }}
              >
                Mask Brush
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'end',
                flexDirection: 'column',
                width: '26.05%',
                flexGrow: '0',
                flexShrink: '0',
                flexBasis: 'auto',
                paddingLeft: '15px',
              }}
            >
            </div>
          </div>
        )}
      </>}

      <div style={{
        height: `${Cookies.get("hom_isEmailNotVerified") == "true" ? `calc(100vh - 530px)` : `calc(100vh - 490px)`}`,
        scrollbarWidth: 'none',
        overflow: 'auto',
      }}>
        <PromptImageTemplateList
          templates={ootdModelTemplateList}
          setPrompt={setBackgroundPrompt}
          setBackgroundNegativePrompt={setBackgroundNegativePrompt}
          selectedTemplate={selectedBackgroundTemplate}
          setBackgroundLora={setBackgroundLora}
          setBackgroundLoraModelStrength={setBackgroundLoraModelStrength}
          setBackgroundLoraClipStrength={setBackgroundLoraClipStrength}
          setSelectedTemplate={setSelectedBackgroundTemplate}
          setBgModel={setBgModel}
          bgImageFile={bgImageFile}
          setBgImageFile={setBgImageFile}
          uploader={true}
          imageStyle={{ objectFit: "contain" }}
          showUploadTitle={false}
          maskModel={async (image: any, isUrl: boolean = false) => {
            setMaskImage(null);
            setPinkMaskImage(null);
            let file = image;
            if (isUrl) {
              //convert to file
              const response = await fetch(image);
              const blob = await response.blob();
              file = new File([blob], 'maskImage', { type: 'image/png' });
              setMaskInputImage(image);
            } else {
              setMaskInputImage(URL.createObjectURL(image));
            }
            setShowMaskingButton(true);
            setMaskInputFile(file);
            await handleCreateImage(file);
            // setIsMaskingModalOpen(true);
          }}
        />
      </div>
    </>
  );
};

export default AgentAssets;
