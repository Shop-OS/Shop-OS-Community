import {
  DownloadOutlined,
  LoadingOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { Button, Image, Progress, Space, Spin } from 'antd';
import { ArrowDownToLine } from 'lucide-react';
import React, { useState } from 'react';

import { MovieSVG, PlaySVG, StarSVG, VideoSVG, ZoomSVG } from '@/components/IconSvg';

const srcExample = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';

interface ConversationImageCardProps {
  src: string;
  alt: string;
  key: any;
  loading: boolean;
}

const ConversationImageCard: React.FC<ConversationImageCardProps> = ({
  src,
  alt,
  key,
  loading,
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
          // width={200}
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
      {!loading && (
        <div
          style={{
            backgroundColor: '#1f1f1f',
            borderRadius: 10,
            width: '100%',
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
        </div>
      )}
    </div>
  );
};

export default ConversationImageCard;
