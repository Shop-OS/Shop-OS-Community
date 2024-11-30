import {
  DownloadOutlined,
  LoadingOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { Button, Image, Progress, Space, Spin, Tooltip } from 'antd';
import { ArrowDownToLine } from 'lucide-react';
import React, { useState } from 'react';

import { MovieSVG, PlaySVG, StarSVG, VideoSVG, ZoomSVG } from '@/components/IconSvg';

const srcExample = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';

interface ConversationImageCardProps {
  src: string;
  alt: string;
  key: any;
  loading: boolean;
  onDelete: () => void;
}

const ConversationImageCard: React.FC<ConversationImageCardProps> = ({
  src,
  alt,
  key,
  loading,
  onDelete,
}) => {
  const [visible, setVisible] = useState(false);
  const [imageDelete, setImageDelete] = useState(false);

  const onDownload = async () => {
    if (!loading) {
      try {
        // Fetch the image
        const response = await fetch(src);
        const blob = await response.blob();

        // Create an object URL for the blob
        const url = URL.createObjectURL(blob);

        // Create a link and click it to start the download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'image.png';
        document.body.appendChild(link);
        link.click();

        // Clean up
        URL.revokeObjectURL(url);
        link.remove();
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    }
  };

  if (imageDelete) {
    return null;
  }

  return (
    <div>
      <div style={{ display: 'none' }}>
        <Image
          src={src}
          style={{ display: 'none', height: '0px', width: '0px' }}
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
        />
      </div>
      <div
        style={{
          backgroundColor: '#1f1f1f',
          borderRadius: 10,
          width: '490px',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
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
        {/* <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            padding: '10px',
            cursor: 'not-allowed',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexDirection: 'row',
              padding: '0.4375rem',
              borderRadius: '5px',
              boxSizing: 'border-box',
            }}
          >
            <StarSVG />
            <span
              style={{
                fontSize: '10px',
                fontWeight: '400',
                textAlign: 'center',
                color: 'black',
                whiteSpace: 'pre-wrap',
                flexGrow: '0',
                flexShrink: '0',
                flexBasis: 'auto',
                paddingLeft: '4px',
              }}
            >
              Quick enhance
            </span>
          </div>
        </div> */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            padding: '4px',
            backgroundColor: 'black',
            borderRadius: '5px',
            zIndex: 10,
          }}
        >
          <Tooltip placement="right" title={'Download'}>
            <div
              style={{
                background: '#252525',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                padding: '5px',
                borderRadius: '5px',
                boxSizing: 'border-box',
                height: '25px',
                width: '25px',
                cursor: 'pointer',
              }}
              onClick={onDownload}
            >
              <ArrowDownToLine style={{ width: '15px', height: '15px' }} />
            </div>
          </Tooltip>
          <Tooltip placement="right" title={'Delete'}>
            <div
              style={{
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                padding: '0.4375rem',
                borderRadius: '5px',
                boxSizing: 'border-box',
                marginTop: '10px',
                height: '25px',
                width: '25px',
                cursor: 'pointer',
              }}
            >
              <img
                onClick={() => {
                  !loading && setImageDelete(true)
                  onDelete();
                }}
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/96b243e6b60d158292a6d80ad3ea69173b4ada52986af56eb5cfdb8b218ff419?"
                className="img-3"
              />
            </div>
          </Tooltip>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            padding: '4px',
            borderRadius: '5px',
            zIndex: 10,
          }}
        >
          {/* <div style={{ backgroundColor: 'black', borderRadius: '5px' }}>
            <div
              style={{
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                padding: '0.4375rem',
                borderRadius: '5px',
                boxSizing: 'border-box',
                cursor: 'not-allowed',
              }}
            >
              <VideoSVG />
            </div>
            <div
              style={{
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                padding: '0.4375rem',
                borderRadius: '5px',
                boxSizing: 'border-box',
                marginTop: '10px',
                cursor: 'not-allowed',
              }}
            >
              <PlaySVG />
            </div>
            <div
              style={{
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                padding: '0.4375rem',
                borderRadius: '5px',
                boxSizing: 'border-box',
                marginTop: '10px',
                cursor: 'not-allowed',
              }}
            >
              <MovieSVG />
            </div>
          </div> */}

          <div style={{ marginTop: '8px', backgroundColor: 'black', borderRadius: '5px' }}>
            <Tooltip placement="right" title={'Expand'}>
              <div
                style={{
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  padding: '0.4375rem',
                  borderRadius: '5px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
                onClick={() => !loading && setVisible(true)}
              >
                <ZoomSVG />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationImageCard;
