import {
  CloudUploadOutlined,
  FormatPainterOutlined,
  LoadingOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { ActionIcon, Icon } from '@lobehub/ui';
import { Button, Collapse, Divider, Empty, Modal, Radio, Skeleton, Spin, Upload } from 'antd';
import Input from 'antd/es/input/Input';
import { LucideLoader2, Trash2 } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Center } from 'react-layout-kit';

import { MotionBrushSVG } from '@/components/IconSvg';

import { useStyles } from '../styles';
import MotionMaskModal from './MotionMaskModal/MotionMaskModal';

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
  image: any;
  maskImage: any;
  setMaskImage: any;
  setMaskImageFile: any;
  handleCreateImage: any;
  isMaskLoading: any;
  isOpenMotionEdit: any;
  setIsOpenMotionEdit: any;
  productMaskDescription: any;
  setProductMaskDescription: any;
  handleCreateMask: any;
  imageFile: any;
  setBlendedImageFile: any;
  setIsMaskLoading: any;
  fileUploadLoading: any;
  setFileUploadLoading: any;
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
  setSelectedImageFile,
  setAgentInputComponent,
  image,
  maskImage,
  setMaskImage,
  setMaskImageFile,
  handleCreateImage,
  isMaskLoading,
  isOpenMotionEdit,
  setIsOpenMotionEdit,
  productMaskDescription,
  setProductMaskDescription,
  handleCreateMask,
  imageFile,
  setBlendedImageFile,
  setIsMaskLoading,
  fileUploadLoading,
  setFileUploadLoading,
}) => {
  const { t } = useTranslation('chat');
  const [uploadType, setUploadType] = React.useState('');

  const { styles } = useStyles();

  const toggleMotionEdit = () => {
    setIsOpenMotionEdit(!isOpenMotionEdit);
  };

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

  return (
    <>
      <h3 style={{
        marginLeft: 20, marginTop: 10, color: 'white',
        fontFamily: 'BDO Grotesk, sans-serif',
        fontSize: '16px',
      }}>Assets
        <span style={{
          fontSize: "12px",
          color: '#AAA',
        }}> (Flatshots of clothes are not supported)</span>
      </h3>
      <div style={{ padding: '0 20px' }}>
        <Upload
          accept="image/jpg, image/jpeg, image/png, image/avif"
          beforeUpload={async (file) => {
            setFileUploadLoading(true);
            await upload(file);
            await handleCreateImage(file);
            setUploadType('direct');
            return false;
          }}
          listType="picture"
          multiple={false}
          onChange={handleChange}
          onPreview={handlePreview}
          showUploadList={{
            removeIcon: <Trash2 size={16} style={{ marginTop: "2px" }} />,
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

      {fileList.length >= 1 && (
        <>
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
                  setIsOpenMotionEdit(!isOpenMotionEdit);
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
                {/* <div
                    style={{
                      border: 'none',
                      backgroundColor: 'rgba(33,33,33,1)',
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      color: 'rgba(244,173,255,1)',
                      minWidth: '53px',
                      height: '35px',
                      width: '53px',
                      cursor: 'pointer',
                      display: 'flex',
                      borderRadius: '8px',
                      textAlign: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    Beta
                  </div> */}
              </div>
            </div>
          )}
        </>
      )}

      {isOpenMotionEdit && (
        <Modal
          footer={null}
          onCancel={() => {
            toggleMotionEdit();
            setProductMaskDescription('');
          }}
          open={isOpenMotionEdit}
          closeIcon={false}
          width={'80%'}
          maskClosable={false}
          styles={{
            content: {
              backgroundColor: '#202020',
              padding: '16px',
            },
          }}
        >
          <MotionMaskModal
            isMaskLoading={isMaskLoading}
            imageFile={imageFile}
            productMaskDescription={productMaskDescription}
            setProductMaskDescription={setProductMaskDescription}
            setAgentInputComponent={setAgentInputComponent}
            previewImage={image}
            toggleMotionEdit={toggleMotionEdit}
            maskImage={maskImage}
            setMaskImage={setMaskImage}
            setMaskImageFile={setMaskImageFile}
            handleCreateMask={handleCreateMask}
            setBlendedImageFile={setBlendedImageFile}
            setIsMaskLoading={setIsMaskLoading}
          />
        </Modal>
      )}
      {/* <Divider plain>
        <span style={{ color: '#5F5F5F', cursor: 'default' }}>or</span>
      </Divider>

      <div style={{ marginLeft: 20, marginRight: 20, cursor: 'not-allowed' }}>
        <div
          style={{
            border: '1px solid #242424',
            borderRadius: '10px',
            bottom: 5,
            display: 'flex',
            justifyContent: 'between',
            left: '10%',
            margin: 'auto',
            padding: '5px 7px',
            width: '100%',

          }}
        >
          <Input
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your link here"
            size="small"
            style={{
              border: 'none',
              padding: '2px',
              width: '85',
              cursor: 'not-allowed',
              fontSize: '14px',
              pointerEvents: 'none',
            }}
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
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            disabled={true}
            loading={loading && uploadType === 'from-link'}
            onClick={() => {
              setUploadType('from-link');
              onGetImagesClick();
            }}
          >
            {!loading && <SendOutlined />}
          </Button>
        </div>

        {promptImages?.length > 0 && (
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
        )}
      </div> */}
    </>
  );
};

export default AgentAssets;
