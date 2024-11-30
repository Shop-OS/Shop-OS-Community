import { CaretDownOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Button, Dropdown, Image, Input, MenuProps, Slider, Space } from 'antd';
import Upload from 'antd/es/upload/Upload';
import * as React from 'react';
import UploadRefImage from '../../components/UploadRefImage';
import useProductBG from '../../provider/useProductBG';



const elementsItems: MenuProps['items'] = [
  // {
  //   label: <span>With</span>,
  //   key: 'With', // this is for the elements
  // },
  {
    label: <span>Surrounded by</span>,
    key: 'Surrounded by',
  },
];

const placementItems: MenuProps['items'] = [
  {
    label: <span>on</span>,
    key: 'on',
  },
  {
    label: <span>in</span>,
    key: 'in',
  },
  {
    label: <span>lying on</span>,
    key: 'lying on',
  }
];

const modelThemeItems: MenuProps['items'] = [
  {
    label: <span>In front of</span>,
    key: 'In front of',
  },
  {
    label: <span>with</span>,
    key: 'with',
  },
  {
    label: <span>next to</span>,
    key: 'next to',
  }
];

function PromptSetting({
  label,
  defaultSetting,
  value,
  onChange,
  items
}: any) {
  const [currentSelectedItem, setCurrentSelectedItem] = React.useState(defaultSetting);

  return (
    <>
      <span style={{ fontSize: '12px', fontWeight: 400 }}>{label}</span>
      <div style={{ display: 'flex', marginBottom: '15px' }}>
        <Dropdown
          menu={{
            items,
            onClick: (value) => {
              onChange((prev: any) => {
                return {
                  ...prev,
                  key: value.key,
                  label: value.key
                }
              });
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
                {currentSelectedItem.toLowerCase()}
              </span>
              <CaretDownOutlined style={{ marginLeft: 4 }} />
            </span>
          </Button>
        </Dropdown>
        <Input
          size="small"
          value={
            value.userPrompt || ""
          }
          onChange={(e: any) => {
            onChange({
              key: currentSelectedItem,
              label: currentSelectedItem,
              userPrompt: e.target.value,
            });
            // onChange((prev: any) => {
            //   return [
            //     ...prev.filter((item: any) => item.key !== currentSelectedItem),
            //     {
            //       key: currentSelectedItem,
            //       label: currentSelectedItem,
            //       userPrompt: e.target.value,
            //     },
            //   ];
            // });
          }}
          style={{
            border: '#2A2A2A 1px solid',
            background: '#222224',
            borderRadius: '10px',
            padding: '10px 15px',
            marginTop: '4px',
            fontFamily: "BDO Grotesk, sans-serif",
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
  elementsRef,
  setPrompt,
  manualPrompt,
  setManualPrompt,
  setBgImageFile,
  setSelectedTemplate,
  bgImageFile,
  renderStrength,
  setRenderStrength,
}: any) => {
  // const [editorPrompt, setEditorPrompt] = React.useState<any>([]);

  // React.useEffect(() => {
  //   let elementsArray = elementsRef.current;
  //   let elementsPrompt = '';

  //   if (elementsArray.length >= 1) {
  //     if (elementsArray.length === 1) {
  //       elementsPrompt = elementsArray[0];
  //     } else if (elementsArray.length === 2) {
  //       elementsPrompt = `${elementsArray[0]} and ${elementsArray[1]}`;
  //     } else {
  //       const lastElement = elementsArray.pop();
  //       elementsPrompt = `${elementsArray.join(', ')} and ${lastElement}`;
  //     }
  //   }

  //   setManualPrompt((prev: any) => {
  //     return [
  //       ...manualPrompt,
  //       {
  //         key: 'With',
  //         label: 'With',
  //         userPrompt: elementsPrompt,
  //       },
  //     ];
  //   });
  // }, [elementsRef, manualPrompt]);

  const {
    placementValue,
    surroundingValue,
    backgroundValue,
    setPlacementValue,
    setSurroundingValue,
    setBackgroundValue,
  } = useProductBG();


  React.useEffect(() => {
    setManualPrompt([{ ...placementValue }, { ...surroundingValue }, { ...backgroundValue }]);
  }, [placementValue, surroundingValue, backgroundValue]);

  return (
    <div style={{
      marginLeft: 20, marginTop: 10, marginRight: 20, height: "90%",
      display: "flex",
      flexDirection: "column",
      fontFamily: "BDO Grotesk, sans-serif",
    }}>
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
            fontFamily: "BDO Grotesk, sans-serif",
          }}
          value={productInfo}
        />
        <PromptSetting
          label="Placement"
          defaultSetting="on"
          items={placementItems}
          onChange={setPlacementValue}
          value={placementValue}
        />
        <PromptSetting
          label="Background"
          defaultSetting="In front of"
          items={modelThemeItems}
          onChange={setBackgroundValue}
          value={backgroundValue}
        />
        <PromptSetting
          label="Surrounding"
          defaultSetting="Surrounded by"
          items={elementsItems}
          onChange={setSurroundingValue}
          value={surroundingValue}
        />

        <div style={{
          display: "flex",
          justifyContent: "space-between",

          alignItems: "center",
          padding: "10px 0"
        }}>
          <div>
            <span style={{ color: "white" }}>
              Reference Image
            </span>
            <span style={{ color: "red", paddingLeft: "2px" }}>*</span>
          </div>
          <UploadRefImage
            setBgImageFile={setBgImageFile}
            setSelectedTemplate={setSelectedTemplate}
            bgImageFile={bgImageFile}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "8px",
          }}
        >
          <span style={{ color: "white" }}>
            Render Strength
          </span>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          paddingTop: "8px",
        }}>
          <div style={{ width: "100%", paddingRight: "10px" }}>
            <Slider
              min={0.5}
              max={1}
              step={0.05}
              onChange={(value) => {
                setRenderStrength(value);
              }}
              value={renderStrength}
            />
          </div>
          <span style={{
            border: "1px solid #2a2a2a",
            padding: "6px",
            cursor: "default",
            borderRadius: "6px",
            width: "50px",
            textAlign: "center",
          }}>
            {renderStrength.toFixed(2)}
          </span>
        </div>



        {/* <PromptSetting
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
        /> */}

        {/* <DropdownSetting
          label="Number of result"
          activeItem={fetchCount}
          onChange={setFetchCount}
          disabled={true}
        /> */}
        {/* <DropdownSetting label="Render strength" activeItem={'Default'} />
        <DropdownSetting label="Color strength" activeItem={'Default'} />
        <DropdownSetting label="Outline strength" activeItem={'Default'} /> */}
      </div>
      {/* <div style={{ paddingBottom: '20px', marginTop: 'auto' }}>
        <Button
          style={{
            marginTop: "auto",
            width: "100%",
            background: "#2a2a2a",
            color: "white",
            border: "1px solid #2a2a2a",
            borderRadius: "10px",
          }}
          onClick={() => {
            saveBtn()
          }}
        >
          Save
        </Button>

      </div> */}
    </div>
  );
};

export default AgentEditor;
