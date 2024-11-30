import React from 'react'
import useProductDescription from '../../provider/useProductDescription';
import { Button, Input } from 'antd';
const questions = [
    {
        id: 1,
        questions: "Please describe the key features of your product.",
        placeholder: "e.g. durable, lightweight, energy-efficient",
        key: "products features is",
    },
    {
        id: 2,
        questions: "What unique benefits does your product offer?",
        placeholder: "e.g. saves time, cost-effective, improves health",
        key: "benefits of the product is",
    },
];

function ProductDetailsForm({ onSubmit }: { onSubmit: any }) {
    const { productDetailsAnswer, setProductDetailsAnswer, productDescription } = useProductDescription();

    return (
        <div
            style={{
                width: '100%',
                maxWidth: '100%',
                fontFamily: "BDO Grotesk, sans-serif",
            }}
        >
            <div style={{
                fontSize: 24,
                color: "rgba(255, 255, 255, 1)",
                padding: "12px 0",
            }}>
                {productDescription}
            </div>
            <div style={{
                border: "1px solid #242424",
                background: "#0E0E0E",
                borderRadius: "10px",
                padding: "8px 16px",
            }}>
                <div style={{
                    fontSize: "16px",
                    padding: "12px 0 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}>
                    <img alt={'avatar'} height={24} src={'/icons/icon-white.png'} width={24} style={{ cursor: 'pointer' }} />
                    HOM Search
                </div>

                {questions.map((question) =>
                    <div key={question.id} style={{ paddingBottom: "10px" }}>
                        <div style={{
                            fontSize: "14px",
                            lineHeight: "25px",
                            paddingBottom: "4px"
                        }}>
                            {question.questions}
                        </div>
                        <Input
                            onChange={(e: any) => {
                                setProductDetailsAnswer({
                                    ...productDetailsAnswer,
                                    [question.key]: e.target.value
                                })
                            }}
                            size="small"
                            style={{
                                border: '1px solid #4A4A4A',
                                background: '#222224',
                                borderRadius: '4px',
                                padding: '8px 15px',
                                marginTop: '4px',
                                marginBottom: '15px',
                            }}
                            value={productDetailsAnswer[question.key]}
                            placeholder={question.placeholder}
                        />
                    </div>
                )}

                <div style={{
                    display: "flex",
                    justifyContent: "end",
                    paddingBottom: "10px",
                }}>
                    <Button
                        onClick={() => {
                            onSubmit();
                        }}
                        type={'primary'}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '14px',
                            borderRadius: '125px',
                            background: Object.keys(productDetailsAnswer).length == 0 ? '#FFFFFF1C' : 'white',
                        }}
                        disabled={Object.keys(productDetailsAnswer).length == 0}
                    >
                        <span style={{
                            color: Object.keys(productDetailsAnswer).length == 0 ? '#9A9A9A' : 'black',
                        }}>
                            Submit
                        </span>
                    </Button>
                </div>
            </div>

            <div style={{
                border: "1px solid #242424",
                background: "#0E0E0E",
                borderRadius: "10px",
                padding: "12px 16px",
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                Skip questions and read the answer
                <Button
                    onClick={() => {
                        onSubmit();
                    }}
                    type={'primary'}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '14px',
                        borderRadius: '125px',
                        background: '#FFFFFF1C',
                    }}
                >
                    <span style={{
                        padding: "0 10px",
                        color: '#9A9A9A',
                    }}>
                        Skip
                    </span>
                </Button>
            </div>
        </div>
    )
}

export default ProductDetailsForm