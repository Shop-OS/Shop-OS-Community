import { Button } from 'antd';
import { LucidePlus } from 'lucide-react';
import React, { useRef, useState } from 'react';

const PromptImageTemplateList = ({
  templates,
  setPrompt,
  setFaceDetailerPrompt,
  setModelLora,
  selectedTemplate,
  setSelectedTemplate,
  setBgModel,
  uploader = false,
  bgImageFile,
  setBgImageFile,
  setBackgroundNegativePrompt,
  setBackgroundLora,
  setBackgroundLoraModelStrength,
  setBackgroundLoraClipStrength,
  loraPrompt,
  setLoraPrompt,
  imageStyle,
  showUploadTitle = true,
  maskModel,
}: {
  templates: any[];
  setPrompt: any;
  setFaceDetailerPrompt?: any;
  setSelectedTemplate: (templateId: any) => void;
  setModelLora?: any;
  selectedTemplate: any;
  setBgModel?: any;
  uploader?: boolean;
  bgImageFile?: string;
  setBgImageFile?: any;
  setBackgroundNegativePrompt?: any;
  setBackgroundLora?: any;
  setBackgroundLoraModelStrength?: any;
  setBackgroundLoraClipStrength?: any;
  loraPrompt?: any;
  setLoraPrompt?: any;
  imageStyle?: any;
  showUploadTitle?: boolean;
  maskModel?: any;
}) => {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [uploadedBgRefs, setUploadedBgRefs] = useState<any[]>([]);
  const [uploadedBgRefFiles, setUploadedBgRefFiles] = useState<any[]>([]);
  const [selectedCustomBg, setSelectedCustomBg] = useState<any>(null);

  const handleUploadClick = (event: any) => {
    setSelectedTemplate(null);
    setBgImageFile(null);
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
      <div style={{ marginTop: "10px" }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
            uploadedBgRefs.map((template, index) => (
              <div key={index}>
                <div
                  title={'Background ' + (index + 1)}
                  onClick={() => {
                    setSelectedCustomBg(template);
                    setSelectedTemplate(null);
                    setBgImageFile && setBgImageFile(uploadedBgRefFiles[index]);
                    maskModel && maskModel(uploadedBgRefFiles[index]);
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
                        objectFit: imageStyle?.objectFit ?? 'cover',
                      }}
                    />
                  </div>
                  {showUploadTitle && <div
                    style={{
                      display: 'flex',
                      width: '100px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {'Background ' + (index + 1)}
                  </div>}
                </div>
              </div>
            ))}

          {templates.map((template) => (
            <div key={template.id}>
              <div
                title={template.label}
                onClick={() => {
                  if (template.disabled) return;
                  setSelectedCustomBg(null);
                  setBackgroundNegativePrompt &&
                    setBackgroundNegativePrompt(template.negativePrompt);
                  setBackgroundLora && template.lora && setBackgroundLora(template.lora.name);
                  setBackgroundLoraModelStrength &&
                    template.lora &&
                    setBackgroundLoraModelStrength(template.lora.strength_model);
                  setBackgroundLoraClipStrength &&
                    template.lora &&
                    setBackgroundLoraClipStrength(template.lora.strength_clip);
                  setPrompt(template.prompt);
                  setLoraPrompt && setLoraPrompt(template.loraPrompt);
                  if (setFaceDetailerPrompt && template?.faceDetailer)
                    setFaceDetailerPrompt(template.faceDetailer);
                  if (setModelLora && template?.lora) setModelLora(template.lora);
                  setSelectedTemplate(template.id);
                  setBgModel && setBgModel(template.label);
                  setBgImageFile && setBgImageFile(null);
                  maskModel && maskModel(template.previewImage, true);
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
                      objectFit: imageStyle?.objectFit ?? 'cover',
                      opacity: template.disabled ? 0.4 : 1, // make the image look faded when disabled
                      pointerEvents: template.disabled ? 'none' : 'auto', // prevent clicks when disabled
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    opacity: template.disabled ? 0.4 : 1, // make the image look faded when disabled
                    whiteSpace: 'nowrap',
                    fontFamily: 'BDO Grotesk, sans-serif',
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

export default PromptImageTemplateList;
