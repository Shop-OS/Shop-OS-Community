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

import { useStyles } from '../styles';
import PromptImageTemplateList from '@/components/PromptImageTemplateList';
import { brushnetTemplates } from '@/const/dataConst';
import Cookies from 'js-cookie';


interface AgentAssetsProps {
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
}

const AgentAssets: React.FC<AgentAssetsProps> = ({
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
}) => {
  const [uploadType, setUploadType] = React.useState('');

  const { styles } = useStyles();

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
        {/* <span style={{
          fontSize: "12px",
          color: '#AAA',
        }}> (Flatshots of clothes are not supported)</span> */}
      </h3>
      <div style={{ padding: '0 20px' }}>
        <Upload
          accept="image/jpg, image/jpeg, image/png, image/avif"
          beforeUpload={async (file) => {
            setFileUploadLoading(true);
            await upload(file);
            // await handleCreateImage(file);
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
          Backgrounds
        </p>
      </div>

      <div style={{
        height: `${Cookies.get("hom_isEmailNotVerified") == "true" ? `calc(100vh - 265px)` : `calc(100vh - 225px)`}`,
        scrollbarWidth: 'none',
        overflow: 'auto',
      }}>
        <PromptImageTemplateList
          templates={brushnetTemplates}
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
          uploader={false}
        />
      </div>
    </>
  );
};

export default AgentAssets;
