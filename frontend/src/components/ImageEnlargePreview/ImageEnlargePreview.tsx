import React, { useEffect, useState } from 'react'
import { Image as AntdImage, Space } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import axios from 'axios';
import { set } from 'js-cookie';

interface ImageEnlargePreviewProps {
    uploadedImage: string;
    outputImages: any[];
    visible: boolean;
    setVisible: any;
    currentIndex: number;
    setCurrentIndex: any;
    isHistory?: boolean;
    previewImageSrc: any;
    setPreviewImageSrc: any;
}

const useStyles = createStyles(({ css, token }) => ({
    imagePreview: css`
      background-color: rgba(0, 0, 0, 0.6);
    `,
}));

function ImageEnlargePreview({
    uploadedImage,
    outputImages,
    visible,
    setVisible,
    currentIndex,
    setCurrentIndex,
    isHistory = false,
    previewImageSrc,
    setPreviewImageSrc
}: ImageEnlargePreviewProps) {
    // const [previewImageSrc, setPreviewImageSrc] = useState<any>({});
    const { styles } = useStyles();

    useEffect(() => {
        async function combineImages() {
            console.log("uploaded image", uploadedImage, outputImages)
            if (outputImages?.length === 0) {
                setPreviewImageSrc({});
                return;
            }

            if (!uploadedImage) {
                console.log("uploaded image is null")
                return;
            }
            console.log("inside combineImages enlarge preview", outputImages)

            const response1 = await axios.get(`${uploadedImage}?not-from-cache-please`, {
                responseType: 'blob',
            });

            const objectUrl1 = URL.createObjectURL(response1.data);

            let img1 = new Image();
            img1.src = objectUrl1;
            await new Promise((resolve) => (img1.onload = resolve));

            const loadAndCombineImage = async (src: any, i: number) => {
                const response = isHistory ?
                    await axios.get(`${src.downloadURL}?not-from-cache-please`, { responseType: 'blob' }) :
                    await axios.get(`${src}?not-from-cache-please`, { responseType: 'blob' });
                const objectUrl = URL.createObjectURL(response.data);

                let img = new Image();
                img.src = objectUrl;
                await new Promise((resolve) => (img.onload = resolve));

                const canvas = document.createElement('canvas');
                const ctx: any = canvas.getContext('2d');

                canvas.width = img1.width + img1.width;
                canvas.height = img1.height;

                const scaleFactor = img1.height / img.height;

                ctx.drawImage(img1, 0, 0, img1.width, img1.height);
                ctx.drawImage(img, img1.width, 0, img1.width, img1.height);

                const dataUrl = canvas.toDataURL();
                setPreviewImageSrc((prev: any) => {
                    return {
                        ...prev,
                        [i]: dataUrl
                    }
                });

                URL.revokeObjectURL(objectUrl);
            }

            await Promise.all(outputImages.map(loadAndCombineImage));

            URL.revokeObjectURL(objectUrl1);
        }
        combineImages();
    }, [outputImages]);



    return (
        <div>
            {Object.values(previewImageSrc).length > 0 && <AntdImage.PreviewGroup
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
            />}
        </div>
    )
}

export default ImageEnlargePreview