import { ChatHeaderTitle } from '@lobehub/ui';
import { Button, ConfigProvider, Segmented, Tag } from 'antd';
import { createStyles } from 'antd-style';
import { DownloadIcon } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { staticFile } from 'remotion';

import { RenderControls } from '../components/RenderControls';

export const useStyles = createStyles(({ css, token }) => ({
  logo: css`
    fill: ${token.colorText};
  `,
  top: css`
    position: sticky;
    top: 0;
    width: 100%;
  `,
}));

const Header = memo(
  ({
    onDownloadClick,
    isStatic,
    inputProps,
    logoSrc,
    productSrc,
    setLogoSrc,
    setProductSrc,
    selectedOption,
    handleTabChange,
  }: any) => {
    const { styles } = useStyles();
    const displayTitle = 'AI Ecommerce Ads Generation';
    const displayDesc = 'Generate amazing ecommerce ads right from one single prompt!';

    return (
      <Flexbox className={styles.top} gap={16} padding={10}>
        <Flexbox distribution={'space-between'} horizontal>
          {/* <ChatHeaderTitle
            desc={displayDesc}
            tag={
              <>
                <Tag>SDXL</Tag> <Tag>Stable Video Diffusion</Tag>
              </>
            }
            title={displayTitle}
          /> */}
          <>
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
              }}
            >
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <div>
                  <div className="div">
                    {/* <div className="div-2"> */}
                    {/* <div className="div-3">
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/1d69ad64de22038699e6a45298bc51bd232e53938b588849f167135bbc08d353?"
                          className="img"
                        />
                      </div>
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/bac27cfcf723744a77cb4500c21e1ef1af3ba69b5dea81f807396184c37e623f?"
                        className="img-2"
                      /> */}
                    {/* <div
                        style={{
                          position: 'sticky',
                          top: 0,
                          padding: '5px',
                          zIndex: 1,
                          background: 'black',
                          width: '50%',
                        }}
                      > */}
                    <ConfigProvider
                      theme={{
                        components: {
                          Segmented: {
                            /* here is your component tokens */
                            itemSelectedBg: '#ffffff',
                            itemSelectedColor: '#000000',
                            trackBg: '#151313',
                          },
                        },
                      }}
                    >
                      <Segmented
                        options={['Fully Animated', 'Moving Objects', 'Static']}
                        defaultValue="Fully Animated"
                        value={selectedOption}
                        onChange={handleTabChange}
                        block
                      />
                    </ConfigProvider>
                    {/* </div> */}
                    {/* </div> */}
                  </div>
                  <style jsx>{`
                    .div {
                      border-radius: 8.3px;
                      border: 0.871px solid #2a2a2a;
                      background-color: #151313;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      padding: 6px;
                      margin-left: 10px;
                      margin-top: 10px;
                      margin-bottom: 10px;
                    }
                    .div-2 {
                      display: flex;
                      padding-right: 11px;
                      justify-content: space-between;
                      gap: 15px;
                    }
                    .div-3 {
                      align-items: center;
                      border-radius: 4px;
                      background-color: #fff;
                      display: flex;
                      aspect-ratio: 1;
                      justify-content: center;
                      width: 42px;
                      height: 42px;
                      padding: 0 10px;
                    }
                    .img {
                      aspect-ratio: 1;
                      object-fit: auto;
                      object-position: center;
                      width: 100%;
                    }
                    .img-2 {
                      aspect-ratio: 1;
                      object-fit: auto;
                      object-position: center;
                      width: 21px;
                      margin: auto 0;
                    }
                  `}</style>
                </div>
                <div>
                  <div className="div">
                    <div className="div-2">
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/8d8954dccfc2bf8d8bef026a95fd19e9b381d6431d9b1c0ae87a550db3fdc5c5?"
                        className="img"
                      />
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/f7f0f774df1d3e246d4679680ebaffe46871cc916815b10434139a65994560ce?"
                        className="img-2"
                      />
                    </div>
                    <div className="div-3">
                      <img
                        loading="lazy"
                        src={staticFile('/icons/agentHeaderUserIcon.png')}
                        className="img-3"
                      />
                    </div>
                  </div>
                  <style jsx>{`
                    .div {
                      border-radius: 8.3px;
                      border: 0.871px solid #2a2a2a;
                      background-color: #151313;
                      display: flex;
                      margin-left: auto;
                      margin-right: 10px;
                      margin-top: 10px;
                      margin-bottom: 10px;
                      gap: 15px;
                      padding: 4px;
                    }
                    .div-2 {
                      display: flex;
                      justify-content: space-between;
                      gap: 20px;
                      padding: 11px;
                    }
                    .img {
                      aspect-ratio: 1.05;
                      object-fit: auto;
                      object-position: center;
                      width: 20px;
                    }
                    .img-2 {
                      aspect-ratio: 1.05;
                      object-fit: auto;
                      object-position: center;
                      width: 20px;
                      align-self: start;
                    }
                    .div-3 {
                      align-items: center;
                      border-radius: 6.968px;
                      background-color: #fff;
                      display: flex;
                      aspect-ratio: 1;
                      justify-content: center;
                      width: 40px;
                      height: 40px;
                    }
                    .img-3 {
                      aspect-ratio: 1;
                      object-fit: auto;
                      border-radius: 6.968px;
                      object-position: center;
                      width: 41px;
                      height: 40px;
                    }
                  `}</style>
                </div>
              </div>
              {isStatic && (
                // <div style={{ marginRight: 'auto' }}>
                <Button
                  onClick={onDownloadClick}
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    gap: 5,
                    justifyContent: 'center',
                    width: 'fit-content',
                  }}
                >
                  <DownloadIcon size={14} />
                  Download Image
                </Button>
                // </div>
              )}
            </div>
          </>

          {/* // ) : (
          //   <RenderControls
          //     inputProps={inputProps}
          //     logoSrc={logoSrc}
          //     productSrc={productSrc}
          //     setLogoSrc={setLogoSrc}
          //     setProductSrc={setProductSrc}
          //     // text={text}
          //     // setText={setText}
          //   ></RenderControls> */}
        </Flexbox>
      </Flexbox>
    );
  },
);

export default Header;
