import { EllipsisOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import { Clipboard, Forward, Pencil } from 'lucide-react'
import React, { use, useEffect } from 'react'
import LoadingAnimation from '../DotLoading'

function TranslatedBox({ item }: { item: any }) {
    return (
        item.description ?
            <>
                <div style={{
                    fontSize: "14px",
                    color: "#878787",
                    lineHeight: "25px",
                    whiteSpace: "pre-line",
                }}>
                    {item.description}
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "#5B5B5B",
                    padding: "10px 0",
                }}>
                    <div style={{ display: "flex" }}>
                        <Button style={{
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
                        </Button>
                    </div>
                    <div style={{ display: "flex" }}>
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
                                    navigator.clipboard.writeText(item.description)
                                }}
                                aria-label='Copy to clipboard'
                            >
                                <Clipboard size={18} />
                            </Button>
                        </Tooltip>
                        <Button style={{
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
                        </Button>
                    </div>
                </div>
            </>
            : <>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", padding: "8px 0" }}>
                    <LoadingAnimation />Translating
                </div>
            </>
    )
}

export default TranslatedBox