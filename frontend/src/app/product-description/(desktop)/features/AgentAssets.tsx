import {
  CloseOutlined,
  CloudUploadOutlined,
  GatewayOutlined,
  LoadingOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { client } from '@gradio/client';
import { ActionIcon, Icon, TextArea } from '@lobehub/ui';
import {
  Button,
  Collapse,
  ConfigProvider,
  Divider,
  Empty,
  Modal,
  Radio,
  Slider,
  Space,
  Spin,
  Switch,
  Upload,
} from 'antd';
import axios from 'axios';
import { CircleFadingPlus, LucideLoader2, MessageCirclePlus, PlusCircle, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Center } from 'react-layout-kit';
import { toast } from 'react-toastify';

import { useStyles } from '../styles';
import useProductDescription from '../../provider/useProductDescription';
import { set } from 'lodash';

interface AgentAssetsProps {
  theme: any;
  loading: any;
  upload: any;
  handleChange: any;
  handlePreview: any;
  handleCancel: any;
}

const AgentAssets: React.FC<AgentAssetsProps> = ({
  theme,
  loading,
  upload,
  handleChange,
  handlePreview,
  handleCancel,
}) => {
  const { styles } = useStyles();

  const [uploadType, setUploadType] = React.useState('');
  const [fileUploadLoading, setFileUploadLoading] = useState(false);

  const {
    imageFile,
    setImageFile,
    previewOpen,
    previewImage,
    previewTitle,
    fileList,
    setFileList,
    setSteps,
    setProductDescription,
    setUploadedImageUrl,
    setOutput,
  } = useProductDescription();

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
            padding: '12px ',
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <div style={{ padding: '20px' }}>
        <div style={{ fontSize: '16px', color: 'white', fontWeight: 500, marginBottom: '10px' }}>
          Assets
        </div>
        <Upload
          accept="image/jpg, image/jpeg, image/png, image/avif"
          beforeUpload={async (file) => {
            await upload(file);
            setImageFile(file);
            // await handleCreateImage(file);
            setSteps(["Analyzing Image"]);

            setTimeout(() => {
              setSteps(["form"]);
              setProductDescription('Product Details');
            }, 3000);
            setUploadType('direct');
            return false;
          }}
          listType="picture"
          className={styles.upload}
          onRemove={(file) => {
            setImageFile(null);
            setUploadedImageUrl('');
          }}
          showUploadList={{
            removeIcon: <Trash2 size={16} style={{ marginTop: "2px" }} />,
          }}
          multiple={false}
          onChange={handleChange}
          onPreview={handlePreview}
          fileList={fileList}
          disabled={fileUploadLoading}
        // itemRender={(originNode, file, currFileList) => {
        //   return (
        //     <ImagePreview
        //       file={imageFile}
        //       onRemove={() => {
        //         setImageFile(null);
        //         setFileList([]);
        //         setUploadedImageUrl('');
        //         setOutput([]);
        //         setSteps(['empty']);
        //       }}
        //     />
        //   );
        // }}
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
      <Modal footer={null} onCancel={handleCancel} open={previewOpen} title={previewTitle}>
        <img
          alt="example"
          height={500}
          src={previewImage}
          width={470}
          style={{ objectFit: 'contain' }}
        />
      </Modal>
      {/* {imageFile && (
        <div style={{ padding: '0px 20px', }}>
          <Button
            onClick={() => {
            }}
            size="large"
            type={'primary'}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
              background: '#FFFFFF1C',
              gap: '10px',
            }}
            loading={false}
            disabled
          >
            <PlusCircle color='#989494' size={18} />
            <span
              style={{
                color: '#9A9A9A',
                fontFamily: 'BDO Grotesk, sans-serif',
                fontSize: '12px',
              }}
            >
              Add More
            </span>
          </Button>
        </div>
      )} */}
    </div>
  );
};

export default AgentAssets;

function ImagePreview({ file, onRemove }: any) {
  const [src, setSrc] = useState<any>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!file) {
      setSrc('');
      return;
    }
    setIsLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSrc(reader?.result || '');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }, [file]);

  return isLoading ? (
    <>
      <Spin
        style={{
          height: '250px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#151515',
          borderRadius: 10,
          margin: '20px 0 0',
        }}
        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
      />
    </>
  ) : (
    <div
      style={{
        borderRadius: 10,
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#151515',
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
      <Trash2
        size={24}
        color='#AEAEAE'
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          color: '#707070',
          cursor: 'pointer',
          padding: '4px',
          border: '0.63px solid #2A2A2A',
          borderRadius: '8px',
          backgroundColor: '#000000',
        }}
        onClick={() => {
          setSrc('');
          onRemove();
        }}
      />
    </div>
  );
}
