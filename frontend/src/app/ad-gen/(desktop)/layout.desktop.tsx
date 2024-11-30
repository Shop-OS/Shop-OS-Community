'use client';

import { CloudUploadOutlined } from '@ant-design/icons';
import { ActionIcon, Icon } from '@lobehub/ui';
import { Button, Dropdown, GetProp, Modal, Radio, Tag, Upload } from 'antd';
import { useTheme } from 'antd-style';
import { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
import { storage } from 'firebase.config';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { LucideCheck, LucideChevronDown, LucideImage, LucideLoader2 } from 'lucide-react';
import Image from 'next/image';
import { PropsWithChildren, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Center, Flexbox } from 'react-layout-kit';

import FolderPanel from '@/features/FolderPanel';
import AppLayoutDesktop from '@/layout/AppLayout.desktop';

import { useStyles } from '../features/Banner/style';
import useImageStore from '../store/ImageStore';
import PromptTemplateList from './PromptTemplateList';
import SideBar from './SideBar';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => resolve(reader.result as string));
    reader.onerror = (error) => reject(error);
  });

const Desktop = memo<PropsWithChildren>(({ children }) => {
  const { styles } = useStyles();

  const theme = useTheme();
  const { t } = useTranslation('chat');
  const [loading, setLoading] = useState(false);
  const [logoName, setLogoName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  // const [isPromptGenLoading, setIsPromptGenLoading] = useState(false);
  // const [text, setText] = useState<string>('');
  // const svdPromptRef = useRef(null);
  const [previewOpen1, setPreviewOpen1] = useState(false);
  const [previewImage1, setPreviewImage1] = useState('');
  const [previewTitle1, setPreviewTitle1] = useState('');
  const [fileList1, setFileList1] = useState<UploadFile[]>([]);

  const [previewOpen2, setPreviewOpen2] = useState(false);
  const [previewImage2, setPreviewImage2] = useState('');
  const [previewTitle2, setPreviewTitle2] = useState('');
  const [fileList2, setFileList2] = useState<UploadFile[]>([]);

  const {
    setSelectedLogo,
    setSelectedProduct,
    setTemplate,
    setLogoFile,
    setProductFile,
    template,
  } = useImageStore();

  const uploadLogo = async (file: RcFile) => {
    setLoading(true);

    if (file) {
      setLogoName(file.name);
      setLogoFile(file);
      const storageRef = ref(storage, `logos/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.info('Thumbnail available at', downloadURL);
            // setLogo(downloadURL);
            setSelectedLogo(downloadURL);
          });
        },
      );
    }

    setLoading(false);
  };

  const uploadProductImage = async (file: RcFile) => {
    setLoading(true);

    if (file) {
      setLogoName(file.name);
      setProductFile(file);
      const storageRef = ref(storage, `logos/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.info('Thumbnail available at', downloadURL);
            // setLogo(downloadURL);
            setSelectedProduct(downloadURL);
          });
        },
      );
    }

    setLoading(false);
  };

  const templateButtons = [
    { id: 1, label: 'Template 1' },
    { id: 2, label: 'Template 2' },
    { id: 3, label: 'Template 3' },
    { id: 4, label: 'Template 4' },
    { id: 5, label: 'Template 5' },
  ];

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
      setPreviewTitle1(file.name || file.url!.slice(Math.max(0, file.url!.lastIndexOf('/') + 1)));
    } else {
      setPreviewImage2(file.url || (file.preview as string));
      setPreviewOpen2(true);
      setPreviewTitle2(file.name || file.url!.slice(Math.max(0, file.url!.lastIndexOf('/') + 1)));
    }
  };

  const handleChange1: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList1(newFileList);

  const handleChange2: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList2(newFileList);

  return (
    <AppLayoutDesktop>
      <FolderPanel>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1
            style={{
              color: 'white',
              fontWeight: 700,
              marginBottom: 10,
              marginLeft: 20,
              marginTop: 20,
            }}
          >
            House of Models
          </h1>

          <h3 style={{ marginLeft: 20, marginTop: 20 }}>Assets</h3>
          <div
            style={{
              display: 'flex',
              marginTop: 10,
              gap: 10,
              flexDirection: 'column',
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <Upload
              accept="image/*"
              beforeUpload={async (file) => {
                await uploadLogo(file);
                return false;
              }}
              listType="picture"
              className="upload-list-inline"
              multiple={false}
              onChange={handleChange1}
              onPreview={(file) => handlePreview(file, 1)}
              showUploadList={true}
              style={{ marginTop: 20, width: '100%' }}
            >
              {loading ? (
                <Center height={36} width={36}>
                  <Icon
                    color={theme.colorTextSecondary}
                    icon={LucideLoader2}
                    size={{ fontSize: 18 }}
                    spin
                  ></Icon>
                </Center>
              ) : fileList1.length >= 1 ? null : (
                <div
                  style={{
                    alignItems: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '250px',
                    border: '1px solid #2a2a2a',
                    borderRadius: '10px',
                  }}
                >
                  <ActionIcon
                    icon={CloudUploadOutlined}
                    placement={'bottom'}
                    title={t('upload.actionTooltip')}
                  />
                  <p>Upload Logo</p>
                </div>
              )}
            </Upload>
            {/* <div style={{ marginTop: 20 }} /> */}
            <Upload
              accept="image/*"
              beforeUpload={async (file) => {
                await uploadProductImage(file);
                return false;
              }}
              listType="picture"
              className="upload-list-inline"
              multiple={false}
              onChange={handleChange2}
              onPreview={(file) => handlePreview(file, 2)}
              showUploadList={true}
              style={{ marginTop: 20, marginRight: 20, width: '100%' }}
            >
              {loading ? (
                <Center height={36} width={36}>
                  <Icon
                    color={theme.colorTextSecondary}
                    icon={LucideLoader2}
                    size={{ fontSize: 18 }}
                    spin
                  ></Icon>
                </Center>
              ) : fileList2.length >= 1 ? null : (
                <div
                  style={{
                    alignItems: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '250px',
                    border: '1px solid #2a2a2a',
                    borderRadius: '10px',
                  }}
                >
                  <ActionIcon
                    icon={CloudUploadOutlined}
                    placement={'bottom'}
                    title={t('upload.actionTooltip')}
                  />
                  <p>Upload Product Image</p>
                </div>
              )}
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: '40px',
              // marginLeft: '20px',
              // marginRight: '20px',
            }}
          >
            {/* <h3>Choose video template</h3>
            <p style={{ opacity: 0.7 }}>Choose a video preset from the list below</p> */}
            {/* <Dropdown
              menu={{
                items: templateButtons.map((btn) => ({
                  key: btn.id,
                  label: btn.label,
                  onClick: () => setTemplate(btn.id),
                })),
              }}
            >
              <Button>
                Choose Templates
                <Icon icon={LucideChevronDown} />
              </Button>
            </Dropdown> */}
            {/* <Radio.Group onChange={(e) => setTemplate(e.target.value)} value={template}>
              {templateButtons.map((btn) => (
                <div key={btn.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <Radio value={btn.id} style={{ marginTop: '10px' }}>
                    <span style={{ fontSize: '16px' }}>{btn.label}</span>
                  </Radio>
                </div>
              ))}
            </Radio.Group> */}
            <PromptTemplateList
              heading={
                <>
                  <h3>Choose video template</h3>
                  <p style={{ opacity: 0.7 }}>Choose a video preset from the list below</p>
                </>
              }
              template={template}
              templates={templateButtons}
              setTemplate={setTemplate}
            />
            {/* <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginTop: 7,
                padding: '10px',
              }}
            >
              {templateButtons.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setTemplate(btn.id)}
                  style={{
                    backgroundColor: template === btn.id ? 'white' : 'transparent',
                    border: '1px solid white',
                    borderRadius: '10px',
                    color: template === btn.id ? 'black' : 'white',
                    cursor: 'pointer',
                    padding: '10px',
                  }}
                  type="button"
                >
                  {btn.label}
                </button>
              ))}
            </div> */}
          </div>
        </div>
      </FolderPanel>
      <Flexbox horizontal>{children}</Flexbox>
      <SideBar />
    </AppLayoutDesktop>
  );
});

export default Desktop;
