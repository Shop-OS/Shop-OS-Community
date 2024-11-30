import { Button, Modal, Popover, Progress, Tooltip } from 'antd';
import { set } from 'lodash';
import { ArrowDownToLine, RotateCw, Scan, Sparkles, Trash2, Image as ImgIcon } from 'lucide-react';
import React, { use, useEffect, useRef, useState } from 'react';

import MagicFixModal from '@/app/apparel-shoots/(desktop)/features/MagicFixModal/MagicFixModal';

import { useStyles } from './styles';
import { OutputImage } from '@/app/apparel-shoots/(desktop)';
import axios from 'axios';

const srcExample = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';

interface ConversationImageCardProps {
  uploadedImage: any;
  src: string;
  alt: string;
  loading: boolean;
  idx: number;
  regenerateImage: any;
  magicFix: any;
  setMagicMaskImageFile: any;
  outputImages: OutputImage[];
  progress: number;
  setVisible: any;
  setCurrentIndex: any;
  deleteGenerationImage: any;
}

const ConversationImageCard: React.FC<ConversationImageCardProps> = ({
  uploadedImage,
  src,
  alt,
  loading,
  idx,
  regenerateImage,
  magicFix,
  setMagicMaskImageFile,
  outputImages,
  progress,
  setVisible,
  setCurrentIndex,
  deleteGenerationImage,
}) => {
  // const [visible, setVisible] = useState(false);
  const [imageDelete, setImageDelete] = useState(false);
  const [isOpenMagicFix, setIsOpenMagicFix] = useState(false);
  // const [currentIndex, setCurrentIndex] = useState(idx || 0);
  // const [maskImage, setMaskImage] = useState<string | null>(null);
  // const [maskImageFile, setMaskImageFile] = useState<File | null>(null);
  const { styles } = useStyles();
  const previewImage = useRef<any>('');
  const [previewImageSrc, setPreviewImageSrc] = useState<Object>({});

  // const onDownload = () => {
  //   if (!loading) {
  //     const link = document.createElement('a');
  //     link.href = src;
  //     link.download = 'image.png';
  //     link.click();
  //     link.remove();
  //   }
  // };

  const onDownload = async () => {
    if (!loading) {
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'image.png';
        link.click();
        link.remove();
        // The URL.revokeObjectURL() static method releases an existing object URL
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    }
  };

  useEffect(() => {
    async function combineImages() {
      // Fetch the images from the URLs
      const response1 = await axios.get(uploadedImage, { responseType: 'blob' });

      // Create object URLs from the responses
      const objectUrl1 = URL.createObjectURL(response1.data);

      // Load the images
      let img1 = new Image();
      img1.src = objectUrl1;
      await new Promise((resolve) => (img1.onload = resolve));


      // for (let i = 0; i < outputImages.length; i++) {
      const response = await axios.get(src, { responseType: 'blob' });
      const objectUrl = URL.createObjectURL(response.data);

      // Load the images
      let img = new Image();
      img.src = objectUrl;
      await new Promise((resolve) => (img.onload = resolve));

      // Get the canvas and its context
      const canvas = document.createElement('canvas');
      const ctx: any = canvas.getContext('2d');

      // Set the canvas size to the size of the images
      canvas.width = img1.width + img.width;
      canvas.height = Math.max(img1.height, img.height);

      const scaleFactor = img1.height / img.height;

      // Draw the images on the canvas
      ctx.drawImage(img1, 0, 0, img1.width, img1.height);
      ctx.drawImage(img, img1.width, 0, img.width, img.height);

      // Convert the canvas to a Data URL
      const dataUrl = canvas.toDataURL();
      // imgArr.push(dataUrl);

      // Clean up
      URL.revokeObjectURL(objectUrl);

      // Clean up
      URL.revokeObjectURL(objectUrl1);

      previewImage.current = dataUrl;
    }

    // combineImages();
  }, [src]);

  useEffect(() => {
    async function combineImages() {
      console.log("inside combine images")
      // Fetch the images from the URLs
      const response1 = await axios.get(uploadedImage, { responseType: 'blob' });

      // Create object URLs from the responses
      const objectUrl1 = URL.createObjectURL(response1.data);

      // Load the images
      let img1 = new Image();
      img1.src = objectUrl1;
      await new Promise((resolve) => (img1.onload = resolve));


      for (let i = 0; i < outputImages.length; i++) {
        console.log("outputImages[i].src", i, outputImages[i].src)
        const response = await axios.get(outputImages[i].src, { responseType: 'blob' });
        const objectUrl = URL.createObjectURL(response.data);

        // Load the images
        let img = new Image();
        img.src = objectUrl;
        await new Promise((resolve) => (img.onload = resolve));

        // Get the canvas and its context
        const canvas = document.createElement('canvas');
        const ctx: any = canvas.getContext('2d');

        // Set the canvas size to the size of the images
        canvas.width = img1.width + img.width;
        canvas.height = Math.max(img1.height, img.height);

        const scaleFactor = img1.height / img.height;

        // Draw the images on the canvas
        ctx.drawImage(img1, 0, 0, img1.width, img1.height);
        ctx.drawImage(img, img1.width, 0, img1.width, img1.height);

        // Convert the canvas to a Data URL
        const dataUrl = canvas.toDataURL();
        setPreviewImageSrc((prev: any) => {
          return {
            ...prev,
            [i]: dataUrl
          }
        });
        // Clean up
        URL.revokeObjectURL(objectUrl);
      }
      // Clean up
      URL.revokeObjectURL(objectUrl1);
    }
    console.log("first image", outputImages)

    // combineImages();
  }, [outputImages])

  // useEffect(() => {
  //   console.log("-----alaa")
  //   mergeImages([{ src: uploadedImage, x: 0, y: 0 }, { src, x: 200, y: 0 }], {
  //     crossOrigin: "anonymous",
  //   }).then((img) => {
  //     console.log("------first image", img);
  //   }).catch((err) => {
  //     console.log("err", err);
  //   });
  // }, []);

  const progressText = (progress: number): string => {
    if (progress == 0) {
      return 'You are in queue';
    }
    if (progress < 30) {
      return 'Processing the scene';
    } else if (progress < 60) {
      return 'Preparing for generation';
    } else if (progress < 90) {
      return 'Generating image';
    } else {
      return 'Applying final touch';
    }
  }


  if (imageDelete) {
    return null;
  }
  return (
    <div style={{ paddingBottom: '16px' }}>
      {/* <AntdImage
        src={previewImage.current}
        style={{ display: 'none' }}
        preview={{
          visible,
          onVisibleChange: (value) => {
            setVisible(value);
          },
          toolbarRender: (_, { transform: { scale }, actions: { onZoomOut, onZoomIn } }) => (
            <Space size={12} className="toolbar-wrapper">
              <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
              <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
            </Space>
          ),
        }}
      /> */}
      {/* <AntdImage.PreviewGroup
        items={Object.values(previewImageSrc)}
        preview={{
          visible,
          classNames: {
            body: styles.imagePreview,
          },
          current: currentIndex,
          onChange: (current, prev) => setCurrentIndex(current),
          onVisibleChange: (visible) => {
            setVisible(visible);
          },
          toolbarRender: (_, { transform: { scale }, actions: { onZoomOut, onZoomIn } }) => (
            <Space size={12} className="toolbar-wrapper">
              <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
              <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
            </Space>
          ),
        }}
      ></AntdImage.PreviewGroup> */}
      {/* <AntdImage.PreviewGroup
        items={outputImages.map((image) => image.src)}
        preview={{
          visible,
          classNames: {
            body: styles.imagePreview,
          },
          current: currentIndex,
          onChange: (current, prev) => setCurrentIndex(current),
          onVisibleChange: (visible) => {
            setVisible(visible);
          },
          imageRender: (originalNode, info) => {
            return (
              <div style={{ height: '90%', transform: `scale(${scale})` }}>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    loading="lazy"
                    src={uploadedImage}
                    style={{ maxWidth: '50%', maxHeight: '80%' }}
                  />
                  <img
                    loading="lazy"
                    src={outputImages[currentIndex].src}
                    style={{ maxWidth: '50%', maxHeight: '80%' }}
                  />
                </div>
              </div>
            );
          },
          toolbarRender: (_, { transform: { scale }, actions: { onZoomOut, onZoomIn } }) => (
            <Space size={12} className="toolbar-wrapper">
            </Space>
          ),
        }}
      ></AntdImage.PreviewGroup> */}

      <div className="div" style={{ maxHeight: '300px', minWidth: "400px" }}>
        <div className="div-2">
          <ImgIcon />
        </div>
        {loading ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 30,
              paddingBottom: 30,
              width: 300,
              height: 300,
            }}
          >
            <Progress type="circle" percent={progress} size={80} strokeColor={'white'} />
            <div style={{ marginTop: 15 }}>
              {progressText(progress)}
              <span className="typewriter">&hellip;</span>
            </div>
          </div>
        ) : (
          <img src={src} style={{ width: 300, height: 300, objectFit: 'contain' }} />
        )}
        <div className="div-3">
          {/* Download Image */}

          <Tooltip placement="right" title={'Download'}>
            <Button
              className="div-4"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '25px',
                height: '25px',
              }}
              type="primary"
              icon={<ArrowDownToLine style={{ width: '15px', height: '15px' }} />}
              onClick={onDownload}
              disabled={loading}
            ></Button>
          </Tooltip>

          {regenerateImage && <Tooltip placement="right" title={'Regenerate'}>
            <div className="div-5">
              {/* Regenerate Image */}
              <div
                onClick={() => !loading && regenerateImage(idx)}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '23px',
                  height: '23px',
                  color: '#aeaeae',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
                className="img-5"
              >
                <RotateCw size={16} />
              </div>
            </div>
          </Tooltip>}
          <div className="div-5">
            <Tooltip placement="right" title={'Delete'}>
              <div
                onClick={() => {
                  if (loading) {
                    return;
                  }
                  setImageDelete(true)
                  deleteGenerationImage && deleteGenerationImage(src, idx)
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '23px',
                  height: '23px',
                  color: '#aeaeae',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
                className="img-5"
              >
                <Trash2 size={16} />
              </div>
            </Tooltip>
          </div>
          {magicFix &&
            <>
              <Popover placement="right" title={"Magic Fix"} content={<>
                <video width="320" height="240" controls autoPlay={true}>
                  <source src="magicFix.mp4" type="video/mp4" />
                </video>
              </>}>
                {/* <Tooltip placement="right" title={'Magic Fix'}> */}
                <div className="div-5">
                  {/* Magic fix */}
                  <div
                    onClick={() => {
                      !loading && setIsOpenMagicFix(true);
                    }}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '23px',
                      height: '23px',
                      color: '#aeaeae',
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                    className="img-5"
                  >
                    <Sparkles size={16} />
                  </div>
                </div>
                {/* </Tooltip> */}
              </Popover>
            </>
          }
          <div className="div-6">
            <Tooltip placement="right" title={'Expand'}>
              <div
                onClick={() => {
                  setCurrentIndex(idx);
                  !loading && setVisible(true)
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '23px',
                  height: '23px',
                  color: '#aeaeae',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
                className="img-5"
              >
                <Scan size={16} />
              </div>
            </Tooltip>
            {/* <img
              onClick={() => !loading && setVisible(true)}
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f10d44da72d1506d95fb14d80dc2e8b8c9ced891e8248cbfd6f9ad7846204168?"
              className="img-4"
            /> */}
          </div>
        </div>
      </div>
      {isOpenMagicFix && (
        <Modal
          footer={null}
          onCancel={() => { }}
          open={isOpenMagicFix}
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
          <MagicFixModal
            imageSrc={src}
            previewImage={src}
            toggleModal={() => {
              setIsOpenMagicFix(false);
            }}
            setMagicMaskImageFile={setMagicMaskImageFile}
            idx={idx}
            magicFix={magicFix}
          />
        </Modal>
      )}
      <style jsx>{`
        .div {
          border-radius: 12.478px;
          background-color: #0e0e0e;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 0 10px;
          margin-right: 20px;
        }
        .div-2 {
          align-items: center;
          border-radius: 3.327px;
          background-color: #000;
          align-self: start;
          display: flex;
          margin-top: 13px;
          aspect-ratio: 1;
          justify-content: center;
          width: 25px;
          height: 25px;
          padding: 0 5px;
        }
        .img {
          aspect-ratio: 1;
          object-fit: auto;
          object-position: center;
          width: 100%;
        }
        .img-2 {
          aspect-ratio: 1.06;
          object-fit: auto;
          object-position: center;
          width: 200px;
          max-width: 100%;
        }
        .div-3 {
          display: flex;
          flex-basis: 0%;
          flex-direction: column;
          margin: 13px 13px;
        }
        .div-4 {
          align-items: center;
          border-radius: 3.327px;
          display: flex;
          aspect-ratio: 1;
          justify-content: center;
          width: 10px;
          height: 10px;
          cursor: pointer;
        }
        .div-5 {
          align-items: center;
          border-radius: 3.327px;
          background-color: #000;
          display: flex;
          margin-top: 8px;
          aspect-ratio: 1;
          justify-content: center;
          width: 25px;
          height: 25px;
          padding: 0 4px;
          cursor: pointer;
        }
        .img-3 {
          aspect-ratio: 0.94;
          object-fit: auto;
          object-position: center;
          width: 100%;
        }
        .div-6 {
          align-items: center;
          border-radius: 3.327px;
          background-color: #000;
          display: flex;
          margin-top: auto;
          aspect-ratio: 1;
          justify-content: center;
          width: 25px;
          height: 25px;
          padding: 0 4px;
          cursor: pointer;
        }
        .img-4 {
          aspect-ratio: 0.94;
          object-fit: auto;
          object-position: center;
          width: 100%;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ConversationImageCard;
