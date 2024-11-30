import { CaretDownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, MenuProps } from 'antd';
import * as React from 'react';

function PromptSetting({
  label,
  defaultSetting,
  setManualModelPrompt,
  setManualSurroundingPrompt,
  setManualBackgroundPrompt,
  setIsManual,
  manualPromptValue,
}: any) {
  const [currentSelectedItem, setCurrentSelectedItem] = React.useState(defaultSetting);

  const modelIsItems: MenuProps['items'] = [
    // {
    //   label: <span>Is</span>,
    //   key: 'Is',
    // },
    {
      label: <span>Ethnicity</span>,
      key: 'Ethnicity',
    },
    {
      label: <span>Color</span>,
      key: 'Color',
    },
    {
      label: <span>Gender</span>,
      key: 'Gender',
    },
  ];

  const modelSurroundingItems: MenuProps['items'] = [
    {
      label: <span>Surrounded by</span>,
      key: 'Surrounded by',
    },
  ];
  const modelBackgroundItems: MenuProps['items'] = [
    {
      label: <span>In front of</span>,
      key: 'In front of',
    },
  ];
  const items =
    label === 'Model'
      ? modelIsItems
      : label === 'Surrounding'
        ? modelSurroundingItems
        : modelBackgroundItems;
  return (
    <>
      <span style={{ fontSize: '12px', fontWeight: 400 }}>{label}</span>
      <div style={{ display: 'flex', marginBottom: '15px' }}>
        <Dropdown
          menu={{
            items,
            onClick: (value) => {
              setCurrentSelectedItem(value.key);
            },
          }}
        >
          <Button
            onClick={(e) => e.preventDefault()}
            style={{
              border: '#2A2A2A 1px solid',
              background: '#0B0B0B',
              borderRadius: '10px',
              padding: '10px 10px',
              height: '45px',
              minWidth: '40%',
              marginTop: '4px',
              marginRight: '5px',
            }}
          >
            <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span
                style={{
                  fontSize: '14px',
                  color: 'white',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {currentSelectedItem}
              </span>
              <CaretDownOutlined style={{ marginLeft: 4 }} />
            </span>
          </Button>
        </Dropdown>
        <Input
          size="small"
          value={
            manualPromptValue.find((item: any) => item.key === currentSelectedItem)?.userPrompt ||
            ''
          }
          onChange={(e: any) => {
            switch (label) {
              case 'Model':
                setManualModelPrompt((prev: any) => {
                  return [
                    ...prev.filter((item: any) => item.key !== currentSelectedItem),
                    {
                      key: currentSelectedItem,
                      label: currentSelectedItem,
                      configuredPrompt: prev.find((item: any) => item.key === currentSelectedItem)
                        ?.configuredPrompt,
                      userPrompt: e.target?.value,
                    },
                  ];
                });
                break;
              case 'Surrounding':
                setManualSurroundingPrompt((prev: any) => {
                  return [
                    ...prev.filter((item: any) => item.key !== currentSelectedItem),
                    {
                      key: currentSelectedItem,
                      label: currentSelectedItem,
                      configuredPrompt: prev.find((item: any) => item.key === currentSelectedItem)
                        ?.configuredPrompt,
                      userPrompt: e.target?.value,
                    },
                  ];
                });
                break;
              case 'Background':
                setManualBackgroundPrompt((prev: any) => {
                  return [
                    ...prev.filter((item: any) => item.key !== currentSelectedItem),
                    {
                      key: currentSelectedItem,
                      label: currentSelectedItem,
                      configuredPrompt: prev.find((item: any) => item.key === currentSelectedItem)
                        ?.configuredPrompt,
                      userPrompt: e.target?.value,
                    },
                  ];
                });
                break;
            }
          }}
          style={{
            border: '#2A2A2A 1px solid',
            background: '#222224',
            borderRadius: '10px',
            padding: '10px 15px',
            marginTop: '4px',
          }}
        />
      </div>
    </>
  );
}

const batchItems: MenuProps['items'] = [
  {
    label: <span>1</span>,
    key: '1',
  },
  {
    label: <span>2</span>,
    key: '2',
  },
  {
    label: <span>3</span>,
    key: '3',
  },
  {
    label: <span>4</span>,
    key: '4',
  },
];

function DropdownSetting({ label, activeItem, onChange, disabled = false }: any) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '4px',
        marginBottom: '15px',
      }}
    >
      <span
        style={{
          fontSize: '14px',
          fontWeight: 400,
          color: 'white',
          cursor: disabled ? 'not-allowed' : 'default',
        }}
      >
        {label}
      </span>
      <Dropdown
        menu={{ items: batchItems, onClick: (value) => onChange(value.key) }}
        disabled={disabled}
      >
        <div style={{ display: 'flex', cursor: disabled ? 'not-allowed' : 'default' }}>
          {activeItem}
          <CaretDownOutlined style={{ marginLeft: 4 }} />
        </div>
      </Dropdown>
    </div>
  );
}

const AgentEditor = ({
  productInfo,
  setProductInfo,
  setIsManual,
  setManualModelPrompt,
  setManualSurroundingPrompt,
  setManualBackgroundPrompt,
  fetchCount = 1,
  setFetchCount,
  manualModelPrompt,
  manualSurroundingPrompt,
  manualBackgroundPrompt,
}: any) => {
  return (
    <div style={{ marginLeft: 20, marginTop: 10, marginRight: 20 }}>
      <h3 style={{ color: 'white' }}>Editor</h3>
      <p style={{ color: 'white', fontWeight: 500 }}>Craft your prompt in the form below</p>
      <div>
        <span style={{ fontSize: '12px', fontWeight: 400 }}>Product</span>
        <Input
          onChange={(e: any) => {
            setProductInfo(e.target.value);
          }}
          size="small"
          style={{
            border: '#2A2A2A 1px solid',
            background: '#222224',
            borderRadius: '10px',
            padding: '10px 15px',
            marginTop: '4px',
            marginBottom: '15px',
          }}
          value={productInfo}
        />

        <PromptSetting
          optionKey="ethnicity"
          label="Model"
          defaultSetting="Ethnicity"
          setIsManual={setIsManual}
          setManualModelPrompt={setManualModelPrompt}
          manualPromptValue={manualModelPrompt}
        />
        <PromptSetting
          optionKey="surroundedBy"
          label="Surrounding"
          defaultSetting="Surrounded by"
          setIsManual={setIsManual}
          setManualSurroundingPrompt={setManualSurroundingPrompt}
          manualPromptValue={manualSurroundingPrompt}
        />
        <PromptSetting
          optionKey="In front of"
          label="Background"
          defaultSetting="In front of"
          setIsManual={setIsManual}
          setManualBackgroundPrompt={setManualBackgroundPrompt}
          manualPromptValue={manualBackgroundPrompt}
        />

        <DropdownSetting
          label="Number of result"
          activeItem={fetchCount}
          onChange={setFetchCount}
          disabled={true}
        />
        {/* <DropdownSetting label="Render strength" activeItem={'Default'} />
        <DropdownSetting label="Color strength" activeItem={'Default'} />
        <DropdownSetting label="Outline strength" activeItem={'Default'} /> */}
      </div>
    </div>
  );
};

export default AgentEditor;
