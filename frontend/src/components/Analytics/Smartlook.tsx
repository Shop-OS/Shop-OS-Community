'use client';

import React, { useEffect } from 'react';
import smartlookClient from 'smartlook-client';

const Smartlook = () => {
  useEffect(() => {
    smartlookClient.init(process.env.NEXT_PUBLIC_SMARTLOOK_ID || "");
  }, []);

  return null;
};

export default Smartlook;
