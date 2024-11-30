import React from 'react'
import useProductDescription from '../../provider/useProductDescription';
import { Clipboard, Forward, Globe, Languages, Pencil, Plus, Repeat } from 'lucide-react';
import { Button, Tooltip } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import Tool from '@/locales/default/tool';
import { languageCodes } from '../../provider/ProductDescriptionProvider';
import axios from 'axios';

const Suggestions = [
    {
        id: 1,
        suggestion: 'Make this more concise and crisp'
    },
]

function ProductOutput({ generateDescription }: { generateDescription: any }) {
    const { output, setOutput, setShowTranslation, setTranslatedOutput, generationIdRef } = useProductDescription();

    const generateBtn = () => {
        const randomId =
            Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
        generationIdRef.current = randomId;
        generateDescription(true);
    }

    const generateTranslation = async (desc: String, lang: String, index: number, languageName: string) => {
        try {
            setOutput((prev: any) => {
                let newOutput = prev.map((item: any, i: number) => {
                    if (i === index) {
                        let translation = item.translation || []
                        let found = translation.find((e: any) => e.language === languageName)
                        if (found) {
                            translation = translation.map((e: any) => {
                                if (e.language === languageName) {
                                    return {
                                        language: languageName,
                                        answer: "Translating..."
                                    }
                                }
                                return e
                            })
                        } else {
                            translation.push({
                                language: languageName,
                                answer: "Translating..."
                            })
                        }
                        return {
                            ...item,
                            translation
                        }
                    }
                    return item
                })
                return newOutput
            })
            let translated = await axios.post(`${process.env.NEXT_PUBLIC_PRODUCT_DESCRIPTION_API}/translate_description?description=${desc}&lang=${lang}`);
            setOutput((prev: any) => {
                let newOutput = prev.map((item: any, i: number) => {
                    if (i === index) {
                        let translation = item.translation || []
                        let found = translation.find((e: any) => e.language === languageName)
                        if (found) {
                            translation = translation.map((e: any) => {
                                if (e.language === languageName) {
                                    return {
                                        language: languageName,
                                        answer: translated.data.translated_description
                                    }
                                }
                                return e
                            })
                        } else {
                            translation.push({
                                language: languageName,
                                answer: translated.data.translated_description
                            })
                        }
                        return {
                            ...item,
                            translation
                        }
                    }
                    return item
                })
                return newOutput
            })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '100%',
            }}
        >
            {output?.map((item: any, index: number) => <>
                <div style={{
                    fontFamily: "BDO Grotesk, sans-serif",
                    borderBottom: "1px solid #4F4F4F",
                    padding: "12px 0",
                }}>
                    {item?.showTitle &&
                        <>
                            <div style={
                                {
                                    fontSize: 24,
                                    color: "rgba(255, 255, 255, 1)"
                                }
                            }>
                                {item.question}
                            </div>
                            <div style={{
                                fontSize: "16px",
                                padding: "12px 0",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }}>
                                <img alt={'avatar'} height={24} src={'/icons/icon-white.png'} width={24} style={{ cursor: 'pointer' }} /> Answer
                            </div>
                        </>
                    }

                    <div style={{
                        backgroundColor: "#0E0E0E",
                        border: "1px solid #242424",
                        borderRadius: "15px",
                        padding: "10px 20px 8px",
                    }}>

                        {item.subtitle && <div style={{
                            fontSize: "14px",
                            color: "white",
                            padding: "12px 0 4px",
                        }}>
                            {item.subtitle}
                        </div>}
                        <div style={{
                            fontSize: "12px",
                            color: "white",
                            padding: "12px 0 8px",
                        }}>
                            English
                        </div>
                        <div style={{
                            fontSize: "14px",
                            color: "#878787",
                            lineHeight: "25px",
                            whiteSpace: "pre-line",
                        }}>
                            {item.answer}
                        </div>
                        {item.translation && item.translation.length > 0 && (
                            item.translation.map((e: any) => <>
                                <div style={{
                                    fontSize: "12px",
                                    color: "white",
                                    padding: "12px 0 8px",
                                }}>
                                    {e.language}
                                </div>
                                <div style={{
                                    fontSize: "14px",
                                    color: "#878787",
                                    lineHeight: "25px",
                                    whiteSpace: "pre-line",
                                }}>
                                    {e.answer}
                                </div>
                            </>)
                        )}

                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            color: "#5B5B5B",
                            padding: "10px 0",
                        }}>
                            <div style={{ display: "flex" }}>
                                {/* <Button style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                color: "#5B5B5B",
                                fontSize: "14px",
                            }}
                                type='text'
                                size='small'
                                disabled
                            >
                                <Forward size={18} />
                                Share
                            </Button> */}

                            </div>
                            <div style={{ display: "flex" }}>
                                <Tooltip title={"Rewrite"} placement='bottom'>
                                    <Button style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        color: "#5B5B5B",
                                        fontSize: "14px",
                                    }}
                                        type='text'
                                        size='small'
                                        onClick={() => generateBtn()}
                                    >
                                        <Repeat size={18} />
                                        Rewrite
                                    </Button>
                                </Tooltip>
                                <Tooltip title={"Copy"} placement='bottom'>
                                    <Button style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        color: "#5B5B5B",
                                        fontSize: "14px",
                                    }}
                                        type='text'
                                        size='small'
                                        onClick={() => {
                                            navigator.clipboard.writeText(item.answer)
                                        }}
                                        aria-label='Copy to clipboard'
                                    >
                                        <Clipboard size={18} />
                                        Copy
                                    </Button>
                                </Tooltip>
                                {/* <Button style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                color: "#5B5B5B",
                                fontSize: "14px",
                            }}
                                type='text'
                                size='small'
                                disabled
                            >
                                <Pencil size={18} />
                            </Button>
                            <Button style={{
                                display: "flex",
                                alignItems: "center",
                                color: "#5B5B5B",
                                fontSize: "14px",
                            }}
                                type='text'
                                size='small'
                                disabled
                            >
                                <EllipsisOutlined style={{ fontSize: "18px" }} />
                            </Button> */}
                            </div>
                        </div>
                    </div>


                    <div style={{ paddingTop: "8px" }}>
                        <div style={{
                            fontSize: "16px",
                        }}>
                            Translate it at your ease
                        </div>
                        <div style={{
                            padding: "10px 0",
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                        }}>
                            {languageCodes && Object.keys(languageCodes).map((lang) => (
                                <div style={{
                                    padding: "8px 11px",
                                    borderRadius: "5px",
                                    backgroundColor: "#111111",
                                    color: "#DCDCDC",
                                    fontSize: "14px",
                                    border: "0.38px solid #4F4F4F",
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                                    onClick={() => generateTranslation(item.answer, languageCodes[lang], index, lang)}
                                >
                                    <div style={{
                                        backgroundColor: "#262626",
                                        border: "0.38px solid #4F4F4F",
                                        borderRadius: "50%",
                                        width: "25px",
                                        height: "25px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: "10px",
                                    }}>
                                        <Languages size={16} />
                                    </div>
                                    {lang}
                                </div>
                            ))}
                        </div>
                    </div>
                </div >
            </>
            )}
        </div >
    )
}

export default ProductOutput