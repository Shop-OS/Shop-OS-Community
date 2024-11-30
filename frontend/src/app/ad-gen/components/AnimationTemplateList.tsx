import { Button } from 'antd';
import React, { useState } from 'react';

const AnimationTemplateList = ({ templates, setPrompt, heading = 'Templates' }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  return (
    <>
      <h3 style={{ marginLeft: 20, marginTop: 20 }}>{heading}</h3>
      <div style={{ marginLeft: 20, marginRight: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {templates.map((template) => (
            <div key={template.id}>
              <Button
                title={template.label}
                onClick={() => {
                  setPrompt(template.prompt);
                  setSelectedTemplate(template.id);
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: selectedTemplate === template.id ? 'white' : '#1D1D1D',
                  color: selectedTemplate === template.id ? 'black' : 'white',
                  width: '100%',
                  overflow: 'hidden',
                  border: 'none',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {template.label}
                </div>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AnimationTemplateList;
