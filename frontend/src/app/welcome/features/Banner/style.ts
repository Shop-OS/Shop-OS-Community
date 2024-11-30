import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ css, token, stylish, cx, prefixCls }) => {
  return {
    buttonGroup: css`
      .${prefixCls}-upload {
        width: 100% !important;
      }
    `,
    container: css`
      z-index: 10;

      display: flex;
      flex-direction: column;
      align-items: center;

      width: 100%;
      margin-bottom: 24px;
    `,
    desc: css`
      font-weight: 400;
      color: #bababa;
      text-align: center;
    `,
    layout: css`
      background: ${token.colorBgContainer};
    `,
    logo: css`
      position: absolute;
      top: 16px;
      left: 16px;
      fill: ${token.colorText};
    `,
    note: css`
      z-index: 10;
      margin-top: 16px;
      color: ${token.colorTextDescription};
    `,
    skip: css`
      color: ${token.colorTextDescription};
    `,
    templateContainer: css`
      flex-wrap: wrap;
      width: 100%;
      padding: 16px;
    `,
    title: css`
      font-size: 50px;
      margin-bottom: 0.25em;
      font-weight: 500;
      font-family: 'BDO Grotesk', sans-serif;
      line-height: 1.4;
      text-align: center;
    `,
    shimmer: css`
      margin-left: 140px;
      padding: 0 140px 0 0;
      text-align: center;
      color: rgba(255, 255, 255, 0.1);
      background: -webkit-gradient(
        linear,
        left top,
        right top,
        from(#222),
        to(#222),
        color-stop(0.5, #fff)
      );
      background: -moz-linear-gradient(left, #222, #fff, #222);
      background: linear-gradient(to right, #222, #fff, #222);
      -webkit-background-size: 125px 100%;
      -moz-background-size: 125px 100%;
      background-size: 125px 100%;
      -webkit-background-clip: text;
      -moz-background-clip: text;
      background-clip: text;
      -webkit-animation-name: shimmer;
      -moz-animation-name: shimmer;
      animation-name: shimmer;
      -webkit-animation-duration: 2s;
      -moz-animation-duration: 2s;
      animation-duration: 2s;
      -webkit-animation-iteration-count: infinite;
      -moz-animation-iteration-count: infinite;
      animation-iteration-count: infinite;
      background-repeat: no-repeat;
      background-position: 0 0;
      background-color: #222;
      @-moz-keyframes shimmer {
        0% {
          background-position: top left;
        }
        100% {
          background-position: top right;
        }
      }
      @-webkit-keyframes shimmer {
        0% {
          background-position: top left;
        }
        100% {
          background-position: top right;
        }
      }
      @-o-keyframes shimmer {
        0% {
          background-position: top left;
        }
        100% {
          background-position: top right;
        }
      }
      @keyframes shimmer {
        0% {
          background-position: top left;
        }
        100% {
          background-position: top right;
        }
      }
    `,
    view: cx(
      stylish.noScrollbar,
      css`
        position: relative;

        overflow: hidden auto;

        max-width: 1024px;
        height: 100%;
        padding: 32px 16px;
      `,
    ),
  };
});

export const genSize = (size: number, minSize: number) => {
  return size < minSize ? minSize : size;
};
