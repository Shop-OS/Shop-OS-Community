import DesktopPage from './(desktop)';
import SessionHydration from './components/SessionHydration';
import Migration from './features/Migration';

const Page = () => {
  const Page = DesktopPage;

  return (
    <>
      <Migration>
        <Page />
      </Migration>
      <SessionHydration />
    </>
  );
};

export default Page;
