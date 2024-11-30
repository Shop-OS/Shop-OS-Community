import { Button } from 'antd';
import { LucidePlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const AssetImageList = ({
  templates,
  setPrompt,
  selectedTemplate,
  setSelectedTemplate,
  setTemplate,
  uploader = false,
  setBgImageFile,
  setSelectedTemplateForCanvas,
  selectedTemplateForCanvas,
}: {
  templates: any[];
  setPrompt: any;
  setTemplate: any;
  selectedTemplate: any;
  setSelectedTemplate: (templateId: any) => void;
  uploader?: boolean;
  setBgImageFile?: any;
  setSelectedTemplateForCanvas: any;
  selectedTemplateForCanvas: any;
}) => {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [uploadedBgRefs, setUploadedBgRefs] = useState<any[]>([]);
  const [uploadedBgRefFiles, setUploadedBgRefFiles] = useState<any[]>([]);
  const [selectedCustomBg, setSelectedCustomBg] = useState<any>(null);

  const handleUploadClick = (event: any) => {
    setSelectedTemplate(null);
    setTemplate('');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
      setUploadedBgRefs((prev) => [reader.result, ...prev]);
    };

    if (file) {
      reader.readAsDataURL(file);
      setUploadedBgRefFiles((prev) => [file, ...prev]);
    }
  };

  return (
    <>
      <div style={{ marginTop: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 4px' }}>
          {uploader && (
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
                  border: '2px dashed white',
                  height: '112px',
                  width: '132px',
                  display: 'flex',
                  gap: '5px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: '12px',
                }}
              >
                {bgImage ? (
                  <img
                    style={{
                      borderRadius: '10px',
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover',
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
            uploadedBgRefs.map((template, index) => (
              <div key={index}>
                <div
                  title={'Background ' + (index + 1)}
                  onClick={() => {
                    setSelectedCustomBg(template);
                    setSelectedTemplate(null);
                    setBgImageFile && setBgImageFile(uploadedBgRefFiles[index]);
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

          {templates.map((template) => (
            <div key={template.id}>
              <div
                title={template.label}
                onClick={() => {
                  setPrompt(template.prompt);
                  setSelectedCustomBg(null);
                  setSelectedTemplate(template.id);
                  setTemplate(template.label);
                  setBgImageFile(null);
                  setSelectedTemplateForCanvas(template);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  //   border: selectedTemplate === template.id ? '2px solid white' : 'none',
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
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%', // or any specific height you want
                    }}
                  >
                    <img
                      src={
                        template.image ??
                        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
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
          ))}
        </div>
      </div>
    </>
  );
};

export default AssetImageList;
