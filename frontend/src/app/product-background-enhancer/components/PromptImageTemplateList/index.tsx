import { Button, ConfigProvider, Tooltip } from 'antd';
import { LucidePlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const PromptImageTemplateList = ({
  templates,
  setPrompt,
  selectedTemplate,
  setSelectedTemplate,
  setTemplate,
  uploader = false,
  setBgImageFile,
  uploadedBgRefs,
  setUploadedBgRefs,
  uploadedBgRefFiles,
  setUploadedBgRefFiles,
  selectedCustomBg,
  setSelectedCustomBg,
  setBgReferencePrompt,
  setManualPrompt,
}: {
  templates: any[];
  setPrompt: any;
  setTemplate: any;
  selectedTemplate: any;
  setSelectedTemplate: (templateId: any) => void;
  uploader?: boolean;
  setBgImageFile?: any;
  uploadedBgRefs?: any[];
  setUploadedBgRefs?: any;
  uploadedBgRefFiles?: any[];
  setUploadedBgRefFiles?: any;
  selectedCustomBg?: any;
  setSelectedCustomBg?: any;
  setBgReferencePrompt?: any;
  setManualPrompt: any;
}) => {
  const [bgImage, setBgImage] = useState<string | null>(null);

  const handleUploadClick = (event: any) => {
    setSelectedTemplate(null);
    setTemplate({});
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
      setUploadedBgRefs((prev: any) => [reader.result, ...prev]);
    };

    if (file) {
      reader.readAsDataURL(file);
      setUploadedBgRefFiles((prev: any) => [file, ...prev]);
    }
  };

  return (
    <>
      <div style={{ paddingTop: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {uploader && (
            // <div
            //   title="Upload"
            //   onClick={() => {
            //     document.getElementById('upload-button')?.click();
            //   }}
            //   style={{
            //     display: 'flex',
            //     flexDirection: 'column',
            //     justifyContent: 'center',
            //     alignItems: 'center',
            //     color: 'white',
            //     overflow: 'hidden',
            //     textOverflow: 'ellipsis',
            //     whiteSpace: 'nowrap',
            //   }}
            // >
            //   <input type="file" accept="image/*" onChange={handleUploadClick} style={{ display: 'none' }} id="upload-button" />
            //   <div
            //     style={{
            //       borderRadius: '10px',
            //       border: '2px dashed white',
            //       height: '112px',
            //       width: '132px',
            //       display: 'flex',
            //       gap: '5px',
            //       justifyContent: 'center',
            //       alignItems: 'center',
            //       cursor: 'pointer',
            //       marginBottom: '12px',
            //     }}
            //   >
            //   </div>
            // </div>
            <div
              title="Upload"
              onClick={() => {
                document.getElementById('upload-button')?.click();
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadClick}
                style={{ display: 'none' }}
                id="upload-button"
              />
              <div
                style={{
                  borderRadius: '10px',
                  border: '1px dashed #747474',
                  height: '122px',
                  width: '132px',
                  display: 'flex',
                  gap: '5px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: '15px',
                }}
              >
                {bgImage ? (
                  <img
                    style={{
                      borderRadius: '10px',
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover',
                      color: '#747474',
                    }}
                    src={bgImage}
                    alt="Uploaded"
                  />
                ) : (
                  <>
                    <LucidePlus size={18} />
                    Upload
                  </>
                )}
              </div>
            </div>
          )}

          {uploader &&
            uploadedBgRefs?.map((template, index) => (
              <div key={index}>
                <div
                  title={'Background ' + (index + 1)}
                  onClick={() => {
                    setSelectedCustomBg(template);
                    setSelectedTemplate(null);
                    setBgImageFile && setBgImageFile(uploadedBgRefFiles?.[index]);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: selectedTemplate === template.id ? 'white' : 'white',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    cursor: template.disabled ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <div
                    style={{
                      padding: '5px',
                      borderRadius: '10px',
                      border: selectedCustomBg === template ? '2px solid white' : 'none',
                      height: '122px',
                      width: '132px',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={
                        template ??
                        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
                      }
                      style={{
                        borderRadius: '10px',
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      width: '100px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {'Background ' + (index + 1)}
                  </div>
                </div>
              </div>
            ))}

          {/* <ConfigProvider
            theme={{
              components: {
                Tooltip: {
                  fontFamily: 'BDO Grotesk, sans-serif',
                },
              },
            }}
          >*/}
          {templates.map((template) => (
            <div key={template.id}>
              {/* <Tooltip placement={'bottom'} title={template.prompt}> */}
              <div
                onClick={() => {
                  setPrompt(template.prompt);
                  setSelectedCustomBg(null);
                  setSelectedTemplate(template.id);
                  setTemplate(template);
                  setBgImageFile();
                  setBgReferencePrompt && setBgReferencePrompt(template.prompt);
                  // setManualPrompt(template.manualPrompt);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: selectedTemplate === template.id ? 'white' : 'white',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  cursor: template.disabled ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <div
                  style={{
                    padding: '5px',
                    borderRadius: '10px',
                    border: selectedTemplate === template.id ? '2px solid white' : 'none',
                    height: '122px',
                    width: '132px',
                    position: 'relative',
                    // objectFit: 'contain',
                  }}
                >
                  <img
                    src={
                      template.previewImage ??
                      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
                    }
                    style={{
                      borderRadius: '10px',
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  {template.disabled && (
                    <div
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.65)',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        cursor: 'not-allowed',
                      }}
                    />
                  )}
                </div>
                {/* <div
                  style={{
                    display: 'flex',
                    width: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {template.label}
                </div> */}
              </div>
              {/* </Tooltip> */}
            </div>
          ))}
          {/* </ConfigProvider> */}
          {/* {templates.map((template) => (
            <div key={template.id}>
              <div
                title={template.label}
                onClick={() => {
                  setPrompt(template.prompt);
                  setSelectedCustomBg(null);
                  setSelectedTemplate(template.id);
                  setTemplate(template.label);
                  setBgImageFile(null);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '10px',
                  border: selectedTemplate === template.id ? '2px solid white' : 'none',
                  color: selectedTemplate === template.id ? 'white' : 'white',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <div
                  style={{
                    padding: '5px',
                    borderRadius: '10px',
                    border: selectedTemplate === template.id ? '2px solid white' : 'none',
                    height: '122px',
                    width: '132px',
                    // objectFit: 'contain',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%', // or any specific height you want
                  }}>
                    <img
                      src={
                        template.image ?? 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
                      }
                      style={{
                        borderRadius: '10px',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    width: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {template.label}
                </div>
              </div>
            </div>
          ))} */}
        </div>
      </div >
    </>
  );
};

export default PromptImageTemplateList;
