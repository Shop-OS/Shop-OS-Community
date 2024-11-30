import DesktopPage from './(desktop)';
import SessionHydration from './components/SessionHydration';

const Page = () => {
  const Page = DesktopPage;

  return (
    <>
      <Page />
      <SessionHydration />
    </>
  );
};

export default Page;
