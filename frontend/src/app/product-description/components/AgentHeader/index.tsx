import { ChatHeaderTitle } from '@lobehub/ui';
import { Tag } from 'antd';
import { createStyles } from 'antd-style';
import { Brush } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { staticFile } from 'remotion';

export const useStyles = createStyles(({ css, token }) => ({
  logo: css`
    fill: ${token.colorText};
  `,
  top: css`
    position: sticky;
    top: 0;
  `,
}));

const Header = memo(({ queue_size }: { queue_size: number }) => {
  const { styles } = useStyles();
  const displayTitle = 'Outfit Try-On';
  const displayDesc = 'Visualise yourself in different clothes based on your description';

  return (
    // <Flexbox className={styles.top} gap={16} padding={16} justify="flex-end">
    // {/* <Flexbox distribution={'flex-end'} horizontal> */}
    //     {/* <ChatHeaderTitle
    //       desc={displayDesc}
    //       tag={<Tag>Stable Diffusion XL</Tag>}
    //       title={displayTitle}
    //     /> */}
    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
      <div>
        {/* <div className="div">
          <div className="div-2">
            <div className="div-3">
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
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div> */}
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
            margin-right: auto;
            margin-top: 10px;
            margin-bottom: 10px;
          }
          .div-2 {
            display: flex;
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
            <div
              style={{
                fontFamily: 'BDO Grotesk, sans-serif',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Queue Size: {queue_size}
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8d8954dccfc2bf8d8bef026a95fd19e9b381d6431d9b1c0ae87a550db3fdc5c5?"
              className="img"
              style={{ cursor: 'not-allowed' }}
            />
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f7f0f774df1d3e246d4679680ebaffe46871cc916815b10434139a65994560ce?"
              className="img-2"
              style={{ cursor: 'not-allowed', margin: 'auto' }}
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
            padding: 8px 11px;
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
            border-radius: 7px;
            display: flex;
            aspect-ratio: 1;
            justify-content: center;
            width: 40px;
            height: 40px;
          }
          .img-3 {
            aspect-ratio: 1;
            object-fit: auto;
            border-radius: 7px;
            object-position: center;
            width: 40px;
            height: 40px;
          }
        `}</style>
      </div>
    </div>
    // {/* </Flexbox> */}
    // </Flexbox>
  );
});

export default Header;
