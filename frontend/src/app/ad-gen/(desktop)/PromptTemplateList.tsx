import { Button } from 'antd';
import React, { useState } from 'react';

const PromptTemplateList = ({
  templates,
  setTemplate,
  heading,
  template,
}: {
  templates: any;
  setTemplate: any;
  heading: any;
  template: any;
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(template);

  return (
    <>
      <div style={{ marginLeft: 20 }}>{heading}</div>
      <div style={{ marginLeft: 20, marginRight: 20, marginTop: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {templates.map((template: any) => (
            <div key={template.id}>
              <Button
                title={template.label}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  setTemplate(e.currentTarget.value);
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

export default PromptTemplateList;
