import { Input, TabsNav, TextArea } from '@lobehub/ui';
import { ConfigProvider, Modal, Skeleton, Switch, Tooltip, Upload } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useRef, useState } from 'react';
import PromptImageTemplateList from '@/components/PromptImageTemplateList';
import { Info } from 'lucide-react';

const useStyles = createStyles(({ css, prefixCls, token }) => {
  return {
    tabNav: css`
      font-family: 'BDO Grotesk', sans-serif;
    `,
    upload: css`
    .ant-upload {
      width: 100% !important;
    }
  `,
  };
});

interface AgentTemplatesProps {
  fileList: any;
  handlePreview: any;
  handleCancel: any;
  previewOpen: any;
  previewTitle: any;
  previewImage: any;
  selectedTab: any;
  handleTabChange: (event: any, newValue: any) => void;
  variant: any;
  modelTemplates: any;
  setModelPrompt: (prompt: any) => void;
  selectedModalTemplate: any;
  setSelectedModalTemplate: (template: any) => void;
  backgroundTemplates: any;
  setBackgroundPrompt: (prompt: any) => void;
  selectedBackgroundTemplate: any;
  setSelectedBackgroundTemplate: (template: any) => void;
  cameraEffectsTemplates: any;
  setCameraEffectsPrompt: (prompt: any) => void;
  selectedEffectTemplate: any;
  setSelectedEffectTemplate: (template: any) => void;
  setFaceDetailerPrompt: any;
  setModelLora: any;
  setBgModel: any;
  bgImageFile: any;
  setBgImageFile: any;
  productPrompt: any;
  setProductPrompt: any;
  isBlurBg: any;
  setIsBlurBg: any;
  setBackgroundNegativePrompt: any;
  setBackgroundLora: any;
  setBackgroundLoraModelStrength: any;
  setBackgroundLoraClipStrength: any;
  isProductDescriptionLoading: any;
  loraPrompt: any;
  setLoraPrompt: any;
}

const AgentTemplates: React.FC<AgentTemplatesProps> = ({
  fileList,
  handlePreview,
  handleCancel,
  previewOpen,
  previewTitle,
  previewImage,
  selectedTab,
  handleTabChange,
  variant,
  modelTemplates,
  setModelPrompt,
  selectedModalTemplate,
  setSelectedModalTemplate,
  backgroundTemplates,
  setBackgroundPrompt,
  selectedBackgroundTemplate,
  setSelectedBackgroundTemplate,
  cameraEffectsTemplates,
  setCameraEffectsPrompt,
  selectedEffectTemplate,
  setSelectedEffectTemplate,
  setFaceDetailerPrompt,
  setModelLora,
  setBgModel,
  bgImageFile,
  setBgImageFile,
  productPrompt,
  setBackgroundNegativePrompt,
  setProductPrompt,
  isBlurBg,
  setIsBlurBg,
  setBackgroundLora,
  setBackgroundLoraModelStrength,
  setBackgroundLoraClipStrength,
  isProductDescriptionLoading,
  loraPrompt,
  setLoraPrompt,
}) => {
  const { styles } = useStyles();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '0 20px', fontFamily: 'BDO Grotesk, sans-serif' }}>
        {fileList.length > 0 && <h3 style={{
          marginTop: 10, color: 'white',
          fontFamily: 'BDO Grotesk, sans-serif',
          fontSize: '16px',
        }}>Assets</h3>}
        <div style={{ padding: '0 0 10px' }}>
          <Upload
            accept="image/jpg, image/jpeg, image/png, image/avif"
            onPreview={handlePreview}
            listType="picture"
            multiple={false}
            showUploadList={{
              showRemoveIcon: false,
            }}
            className={styles.upload}
            fileList={fileList}
          ></Upload>
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
        <div style={{ display: "flex", justifyItems: "center", gap: "4px", alignItems: "center" }}>
          <span style={{ fontSize: '14px', fontWeight: 400 }}>Not getting the clothing correct?</span>
          <ConfigProvider
            theme={{
              components: {
                Tooltip: {
                  fontFamily: 'BDO Grotesk, sans-serif',
                },
              },
            }}
          >
            <Tooltip
              title={"If you see useless additions to the clothing, try playing around with the clothing description. Hint: Only describe the clothing areas on which you see extra parts added."}
            >

              <Info size={16} />
            </Tooltip>
          </ConfigProvider>
        </div>
        {/* {isProductDescriptionLoading ? (
          <div style={{ padding: '6px 0' }}>
            <Skeleton.Button active size="default" block={true} />
          </div>
        ) : (
          <Input
            onChange={(e: any) => {
              setProductPrompt(e.target.value);
            }}
            size="small"
            style={{
              border: '#2A2A2A 1px solid',
              background: '#222224',
              borderRadius: '5px',
              padding: '10px 15px',
              marginTop: '4px',
              marginBottom: '15px',
              fontFamily: 'BDO Grotesk, sans-serif',
            }}
            value={productPrompt}
          />
        )} */}
        {isProductDescriptionLoading ? (
          <div
            className="m-5"
            style={{
              backgroundColor: '#1F1F1F',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '10px',
              opacity: 0.5,
              marginTop: '10x',
            }}
          >
            <Skeleton.Button
              active
              size="large"
              style={{ height: 88, backgroundColor: '#1F1F1F' }}
              block={true}
            />
          </div>
        ) : (
          <div className="main-container">
            <div className="description">
              <TextArea
                autoFocus
                onBlur={(e) => {
                  setProductPrompt(e.target.value);
                }}
                onChange={(e) => {
                  setProductPrompt(e.target.value);
                }}
                placeholder="Please describe the clothing that's not appearing correctly."
                showCount={false}
                size="small"
                value={productPrompt}
                className="textarea"
                type={'pure'}
                autoSize={{ minRows: 4, maxRows: 5 }}
              />
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .main-container {
          margin-top: 10px;
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
      `}</style>
      {/* <div style={{ padding: "10px 20px", display: "flex", justifyContent: "space-between" }}>
        <span>
          Blur Background
        </span>
        <Switch
          value={isBlurBg}
          onChange={(value) => { setIsBlurBg(value) }}
        />
      </div> */}
      < h3
        style={{
          marginLeft: 20,
          marginTop: 10,
          color: 'white',
          fontSize: '16px',
          fontFamily: 'BDO Grotesk, sans-serif',
        }}
      >
        Templates
      </h3 >
      <div style={{ marginLeft: 16, marginRight: 20 }}>
        <TabsNav
          activeKey={selectedTab}
          items={[
            {
              key: 'model',
              label: 'Model',
            },
            {
              key: 'background',
              label: 'Background',
            },
            // {
            //   key: 'effects',
            //   label: 'Effects',
            //   disabled: true,
            // },
          ]}
          onChange={handleTabChange as any}
          variant={variant}
          className={styles.tabNav}
        />
        <div
          style={{
            flex: '1 1 auto',
            overflowY: 'auto',
            height: `${fileList.length > 0 ? 'calc(100vh - 425px)' : 'calc(100vh - 350px)'}`,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {selectedTab === 'model' ? (
            <PromptImageTemplateList
              templates={modelTemplates}
              setPrompt={setModelPrompt}
              setFaceDetailerPrompt={setFaceDetailerPrompt}
              setModelLora={setModelLora}
              selectedTemplate={selectedModalTemplate}
              setSelectedTemplate={setSelectedModalTemplate}
            />
          ) : selectedTab === 'background' ? (
            <PromptImageTemplateList
              templates={backgroundTemplates}
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
              loraPrompt={loraPrompt}
              setLoraPrompt={setLoraPrompt}
            />
          ) : (
            <PromptImageTemplateList
              templates={cameraEffectsTemplates}
              setPrompt={setCameraEffectsPrompt}
              selectedTemplate={selectedEffectTemplate}
              setSelectedTemplate={setSelectedEffectTemplate}
            />
          )}
        </div>
      </div>
    </div >
  );
};

export default AgentTemplates;