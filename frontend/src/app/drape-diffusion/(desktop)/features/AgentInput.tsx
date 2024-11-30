import { DraggablePanelBody, useControls, useCreateStore } from '@lobehub/ui';
import { GetProp, Upload } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import FolderPanel from '@/features/FolderPanel';

import AgentAssets from './AgentAssets';
import GenerationHistory from './GenerationHistory/GenerationHistory';
import useOutfit from '../../provider/useOutfit';

const StyledUpload = styled(Upload)`
  .ant-upload-select,
  .ant-upload-list-item-container {
    width: 100% !important;
    height: 200px !important;
  }
`;

const useStyles = createStyles(({ stylish, css, cx }) =>
  cx(
    stylish.noScrollbar,
    css`
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 8px 8px 0;
    `,
  ),
);

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => resolve(reader.result as string));
    reader.onerror = (error) => reject(error);
  });

interface AgentInputProps {
  image: String | null;
  imageFile: File | null;
  setImage: Dispatch<SetStateAction<string | null>>;
  setImageFile: Dispatch<SetStateAction<File | null>>;
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
  agentInputComponent: string;
  setBgModel: Dispatch<SetStateAction<string>>;
  bgImageFile: File | null;
  setBgImageFile: Dispatch<SetStateAction<File | null>>;
  modelPrompt: string;
  backgroundPrompt: string;
  setBackgroundPrompt: Dispatch<SetStateAction<string>>;
  productPrompt: string;
  setBackgroundNegativePrompt: Dispatch<SetStateAction<string>>;
  setBackgroundLora: Dispatch<SetStateAction<string | undefined>>;
  setBackgroundLoraModelStrength: Dispatch<SetStateAction<number>>;
  setBackgroundLoraClipStrength: Dispatch<SetStateAction<number>>;
  fileUploadLoading: boolean;
  setFileUploadLoading: Dispatch<SetStateAction<boolean>>;
  ootdType: string;
  setOotdType: Dispatch<SetStateAction<string>>;
}

const AgentInput = (props: AgentInputProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { styles } = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('chat');
  const [loading, setLoading] = useState(false);

  const { selectedBackgroundTemplate, setSelectedBackgroundTemplate, setIsMaskingModalOpen } = useOutfit();


  const upload = async (file: RcFile) => {
    setLoading(true);

    if (file) {
      props.setImageFile(file);
      props.setImage(URL.createObjectURL(file));
    }

    setLoading(false);
  };

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.slice(Math.max(0, file.url!.lastIndexOf('/') + 1)));
  };
  const handleChange: UploadProps['onChange'] = ({ file, fileList: newFileList }) => {
    if (file.status !== 'uploading') {
      props.setFileUploadLoading(false);
    }
    setFileList(newFileList);
  };

  useEffect(() => {
    const newPrompt = `${props.modelPrompt ? props.modelPrompt + ',' : ''} ${props.productPrompt ? 'wearing ' + props.productPrompt + ',' : ''} ${props.backgroundPrompt ? props.backgroundPrompt : ''}`;
    props.setPrompt(newPrompt.trim());
  }, [props.modelPrompt, props.backgroundPrompt, props.productPrompt]);

  const store = useCreateStore();
  const { variant }: any = useControls(
    {
      variant: {
        options: ['default', 'compact'],
        value: 'compact',
      },
    },
    { store },
  );


  const getSidebarContent = (agentInputComponent: any) => {
    switch (agentInputComponent) {
      case 'assets':
        return (
          <AgentAssets
            image={props.image}
            imageFile={props.imageFile}
            fileList={fileList}
            theme={theme}
            loading={loading}
            upload={upload}
            handleChange={handleChange}
            handlePreview={handlePreview}
            handleCancel={handleCancel}
            previewOpen={previewOpen}
            previewTitle={previewTitle}
            previewImage={previewImage}
            fileUploadLoading={props.fileUploadLoading}
            setFileUploadLoading={props.setFileUploadLoading}
            setBackgroundPrompt={props.setBackgroundPrompt}
            setBackgroundNegativePrompt={props.setBackgroundNegativePrompt}
            selectedBackgroundTemplate={selectedBackgroundTemplate}
            setBackgroundLora={props.setBackgroundLora}
            setBackgroundLoraModelStrength={props.setBackgroundLoraModelStrength}
            setBackgroundLoraClipStrength={props.setBackgroundLoraClipStrength}
            setSelectedBackgroundTemplate={setSelectedBackgroundTemplate}
            setBgModel={props.setBgModel}
            bgImageFile={props.bgImageFile}
            setBgImageFile={props.setBgImageFile}
            ootdType={props.ootdType}
            setOotdType={props.setOotdType}
            setPrompt={props.setPrompt}
            prompt={props.prompt}
          />
        );
      case 'history':
        return (<GenerationHistory />)
      default:
        return null;
    }
  };

  return (
    <FolderPanel>
      <h1
        style={{
          fontFamily: 'BDO Grotesk, sans-serif',
          color: 'white',
          fontWeight: 500,
          marginBottom: 10,
          marginLeft: 20,
          marginTop: 20,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(to right, white 30%, black 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: "20px"
        }}
      >
        Drape Diffusion
      </h1>

      {getSidebarContent(props.agentInputComponent)}
      <DraggablePanelBody className={styles}></DraggablePanelBody>
    </FolderPanel>
  );
};

export default AgentInput;
