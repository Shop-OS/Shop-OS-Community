import { Viewport } from 'next';
import { cookies } from 'next/headers';
import { PropsWithChildren, use, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isRtlLang } from 'rtl-detect';
import Analytics from '@/components/Analytics';
import { DEFAULT_LANG, LOBE_LOCALE_COOKIE } from '@/const/locale';
import {
  LOBE_THEME_APPEARANCE,
  LOBE_THEME_NEUTRAL_COLOR,
  LOBE_THEME_PRIMARY_COLOR,
} from '@/const/theme';
import Layout from '@/layout/GlobalLayout';

import StyleRegistry from './StyleRegistry';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Alert, Button } from 'antd';
import AxiosProvider from '@/utils/axios';
import AlertComponent from './AlertComponent';
// import { createStyles } from 'antd-style';

// const useStyles = createStyles(({ css, token }) => ({
//   alert: css`
//     .ant-upload {
//       width: 100% !important;
//     }
//   `,
// }));


const RootLayout = ({ children }: PropsWithChildren) => {
  // get default theme config to use with ssr
  const cookieStore = cookies();
  const appearance = cookieStore.get(LOBE_THEME_APPEARANCE);
  const neutralColor = cookieStore.get(LOBE_THEME_NEUTRAL_COLOR);
  const primaryColor = cookieStore.get(LOBE_THEME_PRIMARY_COLOR);
  const lang = cookieStore.get(LOBE_LOCALE_COOKIE);
  const direction = isRtlLang(lang?.value || DEFAULT_LANG) ? 'rtl' : 'ltr';


  return (
    <html dir={direction} lang={lang?.value || DEFAULT_LANG} suppressHydrationWarning>
      <body style={{ fontFamily: "'BDO Grotesk', sans-serif" }}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <StyleRegistry>
            <Layout
              defaultAppearance={appearance?.value}
              defaultLang={lang?.value}
              defaultNeutralColor={neutralColor?.value as any}
              defaultPrimaryColor={primaryColor?.value as any}
            >
              {/* <AlertComponent /> */}
              {/* {(cookieStore.get("hom_isEmailNotVerified")?.value == "true") &&
                <Alert
                  banner
                  message="Your email is not verified"
                  type="info"
                  action={
                    <Button size="small" type="text"
                      style={{
                        fontFamily: "'BDO Grotesk', sans-serif",
                        fontSize: "14px",
                        marginLeft: "10px",
                      }}
                      onClick={() => resendEmail()}
                    >
                      Resend
                    </Button>
                  }
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontFamily: "'BDO Grotesk', sans-serif",
                    display: "flex",
                  }}
                />
              } */}
              {children}
              <ToastContainer />
            </Layout>
          </StyleRegistry>
          <Analytics />
        </GoogleOAuthProvider>
      </body>
    </html >
  );
};

export default RootLayout;

export { default as metadata } from './metadata';

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  themeColor: [
    { color: '#f8f8f8', media: '(prefers-color-scheme: light)' },
    { color: '#000', media: '(prefers-color-scheme: dark)' },
  ],
  userScalable: false,
  viewportFit: 'cover',
  width: 'device-width',
};
