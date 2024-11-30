import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Image, Space, Upload } from 'antd';
import React, { use, useEffect, useState } from 'react'

import { createStyles } from 'antd-style';
import { LucidePlus, X } from 'lucide-react';
import { set } from 'lodash';

const useStyles = createStyles(({ css, token }) => ({
    imagePreview: css`
    background-color: rgba(0, 0, 0, 0.6);
  `,
}));

function UploadRefImage(
    {
        setBgImageFile,
        bgImageFile
    }:
        {
            setBgImageFile: any,
            bgImageFile: any,
        }
) {
    const [bgImage, setBgImage] = useState<any>(null);
    const [visible, setVisible] = React.useState(false);
    const { styles } = useStyles();


    const handleUploadClick = (event: any) => {
        setBgImageFile(null);
        const file = event.target.files[0];

        const reader = new FileReader();

        reader.onloadend = function () {
            setBgImage(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
            setBgImageFile(file);
        }
    };

    useEffect(() => {
        if (bgImageFile) {
            const reader = new FileReader();

            reader.onloadend = function () {
                setBgImage(reader.result);
            };

            reader.readAsDataURL(bgImageFile);
        }
    }, [bgImageFile]);

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
                title="Upload"
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
                {bgImage ? (
                    <div style={{
                        border: "1px solid #2a2a2a",
                        padding: '4px 4px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                    }}>
                        <img
                            style={{
                                borderRadius: '8px',
                                color: '#747474',
                                objectFit: 'contain',
                            }}
                            height={25}
                            width={25}
                            src={bgImage}
                            alt="Uploaded"
                            onClick={() => {
                                setVisible(true);
                            }}
                        />
                        <div
                            onClick={() => {
                                document.getElementById('upload-button')?.click();
                            }}
                            style={{
                                cursor: 'pointer',
                                fontFamily: 'BDO Grotesk, sans-serif',
                                fontSize: '13px',
                            }}
                        >
                            Replace
                        </div>
                    </div>
                ) : (
                    <div style={{
                        borderRadius: '8px',
                        border: "1px solid #2a2a2a",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '6px',
                        gap: '5px',
                        fontSize: '14px',
                    }}
                        onClick={() => {
                            document.getElementById('upload-button')?.click();
                        }}
                    >
                        <LucidePlus size={18} />
                        Upload Image
                    </div>
                )}
                <Image
                    src={bgImage}
                    style={{ display: 'none', height: '0px', width: '0px' }}
                    preview={{
                        visible,
                        onVisibleChange: (value) => {
                            setVisible(value);
                        },
                        classNames: {
                            body: styles.imagePreview,
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

            {bgImage && <div style={{
                borderRadius: '8px',
                border: "1px solid #2a2a2a",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '7px',
                gap: '5px',
                fontSize: '14px',
            }}
                onClick={() => {
                    setBgImageFile(null);
                    setBgImage(null);
                }}
            >
                <X size={18} />
            </div>}
        </div>
    )
}

function UploadRefImage2({ template, setAgentInputComponent, }: any) {
    const [visible, setVisible] = React.useState(false);
    const { styles } = useStyles();
    return (
        <>
            {template.previewImage ? <>
                <Image
                    src={template.previewImage}
                    style={{ display: 'none', height: '0px', width: '0px' }}
                    preview={{
                        visible,
                        onVisibleChange: (value) => {
                            setVisible(value);
                        },
                        classNames: {
                            body: styles.imagePreview,
                        },
                        toolbarRender: (_, { transform: { scale }, actions: { onZoomOut, onZoomIn } }) => (
                            <Space size={12} className="toolbar-wrapper">
                                <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                                <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                            </Space>
                        ),
                    }}
                />
                <span
                    style={{
                        border: "1px solid #2a2a2a",
                        padding: "6px",
                        cursor: "pointer",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <img src={template.previewImage} alt="" style={{ height: "35px", borderRadius: "4px" }} onClick={() => { setVisible(true); }} />
                    <span style={{ paddingLeft: "8px", fontFamily: "BDO Grotesk, sans-serif" }} onClick={() => {
                        setAgentInputComponent('assets');
                    }}>Replace</span>
                </span>
            </> : <>
                <span
                    style={{
                        border: "1px solid #2a2a2a",
                        padding: "6px",
                        cursor: "pointer",
                        borderRadius: "6px",
                    }}
                    onClick={() => {
                        setAgentInputComponent('assets');
                    }}
                >
                    Select Image
                </span>
            </>}
        </>
    )
}



export default UploadRefImage