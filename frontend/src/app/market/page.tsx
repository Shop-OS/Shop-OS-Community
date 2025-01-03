import { isMobileDevice } from '@/utils/responsive';

import DesktopPage from './(desktop)';
import MobilePage from './(mobile)';

export default () => {
  const mobile = isMobileDevice();

  const Page = DesktopPage;

  return <Page />;
};
