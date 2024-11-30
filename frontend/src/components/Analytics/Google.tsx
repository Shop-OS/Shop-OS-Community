"use client";

import { useEffect } from 'react';

const Google = () => {
  useEffect(() => {
    // Create a script element
    const script = document.createElement('script');
    script.id = 'intercom-script';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`;
    script.addEventListener('load', () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());

      gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID);
    });
    script.async = true;

    // Append the script element to the document head
    document.head.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
};

export default Google;