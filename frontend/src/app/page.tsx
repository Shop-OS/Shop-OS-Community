"use client";

import { useEffect } from 'react';
import Page from './home';
import Redirect from './home/Redirect';
import { useRouter } from 'next/router';
// import Smartlook from 'smartlook-client';

const Index = () => {
  const router = useRouter();
  // Smartlook.init(process.env.NEXT_PUBLIC_SMARTLOOK_KEY || "")
  useEffect(() => {
  });
  console.log("Hey from the useeffect")

  // useEffect(() => {
  //   const handleRouteChange = () => {
  //     (window as any).Intercom('update');
  //   };

  //   //ts-ignore  
  //   (function () { var w = window; var ic = w.Intercom; if (typeof ic === "function") { ic('reattach_activator'); ic('update', w.intercomSettings); } else { var d = document; var i = function () { i.c(arguments); }; i.q = []; i.c = function (args) { i.q.push(args); }; w.Intercom = i; var l = function () { var s = d.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = 'https://widget.intercom.io/widget/yjlqr9uk'; var x = d.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x); }; if (document.readyState === 'complete') { l(); } else if (w.attachEvent) { w.attachEvent('onload', l); } else { w.addEventListener('load', l, false); } } })();

  //   (window as any).Intercom('boot', {
  //     app_id: 'yjlqr9uk'
  //   });

  //   router.events.on('routeChangeComplete', handleRouteChange);

  //   return () => {
  //     router.events.off('routeChangeComplete', handleRouteChange);
  //   };
  // }, []);

  return (
    <>
      <Page />
      <Redirect />
    </>
  );
}

export default Index;
