import React from 'react'
import { Plus } from 'lucide-react';
import useProductDescription from '../../provider/useProductDescription';


const Suggestions = [
    {
        id: 1,
        suggestion: 'Make this more concise and crisp'
    },
    {
        id: 2,
        suggestion: 'Rewrite this with a professional tone'
    },
]

function ProductOutputSuggestion({ generateDescription }: { generateDescription: any }) {
    const { setPrompt, generationIdRef } = useProductDescription();
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '100%',
            }}
        >
            <div style={{
                fontFamily: "BDO Grotesk, sans-serif",
            }}>
                <div style={{
                    fontSize: 16,
                    color: "rgba(255, 255, 255, 1)",
                    borderBottom: "1px solid #4F4F4F",
                    padding: "16px 0 8px",
                }}>
                    Suggestions
                </div>
                {Suggestions.map((item) => <>
                    <div style={{
                        fontSize: 14,
                        borderBottom: "1px solid #4F4F4F",
                        padding: "16px 0 8px",
                        color: "#FAF9F6",
                        display: "flex",
                        justifyContent: "space-between",
                        cursor: "pointer",
                    }}
                        onClick={() => {
                            const randomId =
                                Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
                            generationIdRef.current = randomId;
                            generateDescription(item.suggestion);
                        }}
                        key={item.id}
                    >
                        {item.suggestion}
                        <Plus
                            size={20}
                            color='#808080'
                        />
                    </div>
                </>
                )}
            </div>
        </div >
    )
}

export default ProductOutputSuggestion