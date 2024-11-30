import '@google/model-viewer/dist/model-viewer';
import { Modal } from 'antd';
import axios from 'axios';
import { BringToFront, Download, Expand, X } from 'lucide-react';
import { border } from 'polished';
import React from 'react';

export default function Viewer3D({ src, id }: any) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  async function download() {
    const response = await axios.get(src, {
      responseType: 'blob', // Tell axios to get the response as a Blob
    });

    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', 'file.glb'); // Use the file name you want
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  return (
    <div>
      {/* @ts-ignore */}
      <model-viewer
        id={id}
        ar
        ar-modes="quick-look scene-viewer webxr"
        shadow-softness="0.8"
        shadow-intensity="0.8"
        min-camera-orbit="auto auto 100%"
        max-camera-orbit="auto auto 200%"
        camera-controls
        quick-look-browsers="safari chrome"
        interaction-prompt="auto"
        interaction-prompt-threshold="1"
        reveal="auto"
        style={{
          width: '490px',
          height: '490px',
          borderRadius: 10,
        }}
        src={src}
        exposure="0.85"
        environment-image="neutral"
        camera-orbit={(id == "tripoSR" || id == "meshy") ? "3.14rad auto 100%" : "auto auto 100%"}
        alt="HoM - Text to 3D"
        disable-pan="true"
      >
        {/* @ts-ignore */}
      </model-viewer>
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          borderRadius: '5px',
        }}
      >
        {src && (
          <div style={{ borderRadius: '5px', border: '0.63px solid #2A2A2A', padding: '3px' }}>
            <div
              style={{
                color: 'black',
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderRadius: '5px',
                width: '30px',
                height: '30px',
                boxSizing: 'border-box',
                cursor: 'pointer',
              }}
              onClick={() => {
                download();
              }}
            >
              <Download size={15} />
            </div>
            <div
              style={{
                // color: '#8e8a8a',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                padding: '8px',
                borderRadius: '5px',
                boxSizing: 'border-box',
                cursor: 'pointer',
                marginTop: '5px',
              }}
              onClick={() => {
                setIsExpanded(true);
              }}
            >
              <Expand size={15} />
            </div>
          </div>
        )}
      </div>

      <Modal
        footer={null}
        onCancel={() => {
          setIsExpanded(false);
        }}
        open={isExpanded}
        closeIcon={<X color="white" />}
        width={'70%'}
        maskClosable={false}
        styles={{
          content: {
            backgroundColor: '#202020',
            // backgroundColor: 'transparent',
            padding: '16px',
          },
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* @ts-ignore */}
          <model-viewer
            id={`${id}-expanded`}
            ar
            ar-modes="quick-look scene-viewer webxr"
            shadow-softness="0.8"
            shadow-intensity="0.8"
            min-camera-orbit="auto auto 100%"
            max-camera-orbit="auto auto 200%"
            camera-controls
            quick-look-browsers="safari chrome"
            interaction-prompt="auto"
            interaction-prompt-threshold="1"
            reveal="auto"
            style={{ width: '100%', maxHeight: '800px', minHeight: '650px' }}
            src={src}
            exposure="0.85"
            environment-image="neutral"
            camera-orbit={(id == "tripoSR" || id == "meshy") ? "3.14rad auto 100%" : "auto auto 100%"}
            alt="HoM - Text to 3D"
            disable-pan="true"
          >
            {/* @ts-ignore */}
          </model-viewer>
        </div>
      </Modal>
    </div>
  );
}
