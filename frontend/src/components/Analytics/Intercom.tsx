"use client";

import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

const Intercom = () => {
  useEffect(() => {
    // Ensure the Intercom script is not already loaded
    if (document.getElementById('intercom-script')) {
      return;
    }

    // Create a script element
    const script = document.createElement('script');
    script.id = 'intercom-script';
    script.src = `https://widget.intercom.io/widget/${process.env.NEXT_PUBLIC_INTERCOM_APP_ID}`;
    script.addEventListener('load', () => {
      window.Intercom('boot', {
        api_base: "https://api-iam.intercom.io",
        app_id: `${process.env.NEXT_PUBLIC_INTERCOM_APP_ID}`,
        // Add your Intercom settings here
        // For example:
        // name: "John Doe",
        email: Cookies.get('hom_email'),
        created_at: 1312182000 
      });
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

export default Intercom;