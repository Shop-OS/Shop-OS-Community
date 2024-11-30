import { Metadata } from 'next';

import { getServerConfig } from '@/config/server';

import pkg from '../../package.json';

const title = 'House Of Models';
const { description, homepage } = pkg;

const { METADATA_BASE_URL = 'https://www.houseofmodels.ai/' } = getServerConfig();

const metadata: Metadata = {
  appleWebApp: {
    statusBarStyle: 'black-translucent',
    title,
  },
  description,
  icons: {
    icon: '/icons/icon-32x32.png',
    shortcut: '/icons/favicon.ico',
  },
  manifest: '/manifest.json',
  metadataBase: new URL(METADATA_BASE_URL),
  openGraph: {
    description: description,
    images: [
      {
        alt: title,
        height: 360,
        url: 'https://assets-global.website-files.com/64d0ccb06c344d9036b1fbd9/652e67d6974bb0ef2bf03056_og-image.png',
        width: 480,
      },
      {
        alt: title,
        height: 720,
        url: 'https://assets-global.website-files.com/64d0ccb06c344d9036b1fbd9/652e67d6974bb0ef2bf03056_og-image.png',
        width: 960,
      },
    ],
    locale: 'en-US',
    siteName: title,
    title: title,
    type: 'website',
    url: homepage,
  },

  title: {
    default: title,
    template: '%s · House Of Models',
  }
};

export default metadata;