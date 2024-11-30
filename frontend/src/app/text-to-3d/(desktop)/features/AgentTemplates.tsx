import { TabsNav } from '@lobehub/ui';
import { t } from 'i18next';
import React from 'react';

import AssetImageList from '../../components/AssetsList';

interface AgentTemplatesProps {
  modelTemplates: any;
  setSelectedTemplateForCanvas: any;
  selectedTemplateForCanvas: any;
  setTemplate: any;
  setBgImageFile: any;

  setModelPrompt: (prompt: any) => void;
  selectedModalTemplate: any;
  setSelectedModalTemplate: (template: any) => void;
}

const AgentTemplates: React.FC<AgentTemplatesProps> = ({
  modelTemplates,
  setModelPrompt,
  selectedModalTemplate,
  setSelectedModalTemplate,
  setSelectedTemplateForCanvas,
  selectedTemplateForCanvas,
  setTemplate,
  setBgImageFile,
}) => {
  return (
    <>
      <h3 style={{ marginLeft: 20, marginTop: 10, color: 'white' }}>Templates</h3>
      <div style={{ marginLeft: 20, marginRight: 20 }}>
        {modelTemplates.length > 0 &&
          modelTemplates.map((template: any) => {
            return (
              <>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: '8px', // Adjusted to match the gap-2 from the original class
                    flexGrow: '0',
                    flexShrink: '0',
                    flexBasis: 'auto',
                    marginTop: '3px',
                    paddingTop: '16px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '16px', // Converted from text-base to rem
                      fontWeight: '500', // Converted from font-medium to 500
                      color: 'white',
                      whiteSpace: 'pre-wrap',
                      flexGrow: '0',
                      flexShrink: '0',
                      flexBasis: 'auto',
                      margin: '0',
                      cursor: 'default',
                    }}
                  >
                    {template.label}
                  </p>
                  <div
                    style={{ flexGrow: '0', flexShrink: '0', flexBasis: 'auto', cursor: 'pointer' }}
                  >
                    View all
                  </div>
                </div>
                <AssetImageList
                  templates={template.items}
                  setPrompt={setModelPrompt}
                  selectedTemplate={selectedModalTemplate}
                  setSelectedTemplate={setSelectedModalTemplate}
                  setTemplate={setTemplate}
                  setBgImageFile={setBgImageFile}
                  setSelectedTemplateForCanvas={setSelectedTemplateForCanvas}
                  selectedTemplateForCanvas={selectedTemplateForCanvas}
                />
              </>
            );
          })}
      </div>
    </>
  );
};

export default AgentTemplates;
