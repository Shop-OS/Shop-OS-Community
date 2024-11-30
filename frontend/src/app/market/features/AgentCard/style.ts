import { createStyles } from 'antd-style';
import rgba from 'polished/lib/color/rgba';

export const useStyles = createStyles(({ css, token, responsive }) => ({
  container: css`
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    height: 100%;
    ${responsive.mobile} {
      border-radius: unset;
    }
    background: linear-gradient(5deg, #0D0D12 60%, #232226 100%);
  `,
  desc: css`
  color: #555555;
  `,
  inner: css`
    padding: 16px;
  `,
  lazy: css`
    min-height: 232px;
  `,
  subTitle: css`
    font-size: 24px;
    font-weight: 600;
    ${responsive.mobile} {
      font-size: 20px;
    }
  `,
  title: css`
    margin-bottom: 0 !important;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(98.14deg, rgb(255, 255, 255) 28.88%, rgba(255, 255, 255, 0) 132.27%) text; -webkit-text-fill-color: transparent;
  `,
}));
