
import { Button, Image as AntdImage, Tooltip } from 'antd';
import { set } from 'lodash';
import { ArrowDownToLine, Scan, Trash2, Image as ImgIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useStyles } from './styles';
import axios from 'axios';

const srcExample = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';

interface ConversationHistoryImageCardProps {
  inputImage: any;
  src: string;
  alt: string;
  idx: number;
  outputImages: any[];
  visible: boolean;
  setVisible: any;
  currentIndex: number;
  setCurrentIndex: any;
}

const ConversationHistoryImageCard: React.FC<ConversationHistoryImageCardProps> = ({
  inputImage,
  src,
  alt,
  idx,
  outputImages,
  visible,
  setVisible,
  currentIndex,
  setCurrentIndex
}) => {
  const [imageDelete, setImageDelete] = useState(false);
  // const [visible, setVisible] = useState(false);
  // const [currentIndex, setCurrentIndex] = useState(idx || 0);
  const { styles } = useStyles();
  const previewImage = useRef<any>('');
  const [previewImageSrc, setPreviewImageSrc] = useState<any>({});


  const onDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = 'image.png';
    link.click();
    link.remove();
  };

  if (imageDelete) {
    return null;
  }

  useEffect(() => {
    async function combineImages() {
      try {

        // Fetch the images from the URLs
        const response1 = await axios.get(inputImage, { responseType: 'blob' });

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
        ctx.drawImage(img, img1.width, 0, img1.width, img1.height);

        // Convert the canvas to a Data URL
        const dataUrl = canvas.toDataURL();
        // imgArr.push(dataUrl);

        // Clean up
        URL.revokeObjectURL(objectUrl);

        // Clean up
        URL.revokeObjectURL(objectUrl1);

        previewImage.current = dataUrl;

      } catch (error) {
        console.log("first error", error)
      }
    }

    // combineImages();
  }, [src]);

  useEffect(() => {
    async function combineImages() {
      // Fetch the images from the URLs
      const response1 = await axios.get(inputImage, { responseType: 'blob' });

      // Create object URLs from the responses
      const objectUrl1 = URL.createObjectURL(response1.data);

      // Load the images
      let img1 = new Image();
      img1.src = objectUrl1;
      await new Promise((resolve) => (img1.onload = resolve));


      for (let i = 0; i < outputImages.length; i++) {
        const response = await axios.get(outputImages[i].downloadURL, { responseType: 'blob' });
        const objectUrl = URL.createObjectURL(response.data);

        // Load the images
        let img = new Image();
        img.src = objectUrl;
        await new Promise((resolve) => (img.onload = resolve));

        // Get the canvas and its context
        const canvas = document.createElement('canvas');
        const ctx: any = canvas.getContext('2d');

        // Set the canvas size to the size of the images
        canvas.width = img1.width + img1.width;
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

    // combineImages();
  }, [outputImages]);

  return (
    <div style={{ paddingBottom: '12px' }}>
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
        items={outputImages?.map((image) => image.downloadURL !== null ? image.downloadURL : "")}
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
              <div style={{ height: '90%' }}>
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
                    src={inputImage}
                    style={{ maxWidth: '50%', maxHeight: '80%' }}
                  />
                  <img
                    loading="lazy"
                    src={outputImages?.[currentIndex].downloadURL}
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
        <img src={src} style={{ width: 300, objectFit: 'contain' }} />
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
            ></Button>
          </Tooltip>

          {/* <div className="div-5">
            <Tooltip placement="right" title={'Delete'}>
              <div
                onClick={() => setImageDelete(true)}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '23px',
                  height: '23px',
                  color: '#aeaeae',
                  cursor: 'pointer',
                }}
                className="img-5"
              >
                <Trash2 size={16} />
              </div>
            </Tooltip>
          </div> */}

          <div className="div-6">
            <Tooltip placement="right" title={'Expand'}>
              <div
                onClick={() => {
                  setCurrentIndex(idx);
                  setVisible(true)
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '23px',
                  height: '23px',
                  color: '#aeaeae',
                  cursor: 'pointer',
                }}
                className="img-5"
              >
                <Scan size={16} />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
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
          margin: 13px auto;
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

export default ConversationHistoryImageCard;
