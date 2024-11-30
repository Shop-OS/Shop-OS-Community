import { CloudUploadOutlined } from '@ant-design/icons';
import { Button, Modal, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import Image from 'next/image';
import React, { useState } from 'react';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const AgentUploadFile: React.FC = () => {
  const [previewOpen1, setPreviewOpen1] = useState(false);
  const [previewImage1, setPreviewImage1] = useState('');
  const [previewTitle1, setPreviewTitle1] = useState('');
  const [fileList1, setFileList1] = useState<UploadFile[]>([]);

  const [previewOpen2, setPreviewOpen2] = useState(false);
  const [previewImage2, setPreviewImage2] = useState('');
  const [previewTitle2, setPreviewTitle2] = useState('');
  const [fileList2, setFileList2] = useState<UploadFile[]>([]);

  const handleCancel = (uploadNumber: number) => {
    if (uploadNumber === 1) {
      setPreviewOpen1(false);
    } else {
      setPreviewOpen2(false);
    }
  };

  const handlePreview = async (file: UploadFile, uploadNumber: number) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    if (uploadNumber === 1) {
      setPreviewImage1(file.url || (file.preview as string));
      setPreviewOpen1(true);
      setPreviewTitle1(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    } else {
      setPreviewImage2(file.url || (file.preview as string));
      setPreviewOpen2(true);
      setPreviewTitle2(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    }
  };

  const handleChange1: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList1(newFileList);

  const handleChange2: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList2(newFileList);

  const uploadButton = (
    <button style={{ background: 'none', border: 0 }} type="button">
      <CloudUploadOutlined />
      <div style={{ fontSize: 11, marginTop: 8 }}>Upload your logo here</div>
    </button>
  );
  const uploadButtonTwo = (
    <button style={{ background: 'none', border: 0 }} type="button">
      <CloudUploadOutlined />
      <div style={{ fontSize: 11, marginTop: 8 }}>Upload your image here</div>
    </button>
  );

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px',
          paddingLeft: '30px',
          width: '100%',
        }}
      >
        <Upload
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          fileList={fileList1}
          listType="picture-card"
          onChange={handleChange1}
          onPreview={(file) => handlePreview(file, 1)}
          style={{ marginLeft: '30px', width: '100%' }}
        >
          {fileList1.length >= 1 ? null : uploadButton}
        </Upload>

        <Upload
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          fileList={fileList2}
          listType="picture-card"
          onChange={handleChange2}
          onPreview={(file) => handlePreview(file, 2)}
          // style={{ marginTop: '30px' }}
        >
          {fileList2.length >= 1 ? null : uploadButtonTwo}
        </Upload>
      </div>
      <Modal
        footer={null}
        onCancel={() => handleCancel(1)}
        open={previewOpen1}
        title={previewTitle1}
      >
        <Image alt="example" height={500} src={previewImage1} width={470} />
      </Modal>

      <Modal
        footer={null}
        onCancel={() => handleCancel(2)}
        open={previewOpen2}
        title={previewTitle2}
      >
        <Image alt="example" height={500} src={previewImage2} width={470} />
      </Modal>
    </>
  );
};

export default AgentUploadFile;
