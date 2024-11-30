import { SideNav } from '@lobehub/ui';
import Avatar from 'next/image';
import { useRouter } from 'next/navigation';
import { memo } from 'react';

import AvatarWithUpload from '@/features/AvatarWithUpload';
import { useGlobalStore } from '@/store/global';

import BottomActions from './BottomActions';
// import BottomActions from './BottomActions';
import TopActions from './TopActions';
import Cookies from 'js-cookie';

interface LeftMainSideBarProps {
  setActive: (component: string) => void;
  active: string;
}

const LeftMainSideBar: React.FC<LeftMainSideBarProps> = ({ active, setActive }) => {
  const router = useRouter();
  return (
    <SideNav
      avatar={<div onClick={() => router.push("/welcome")}>
        <Avatar alt={'avatar'} height={36} src={'/icons/hom-logo.png'} width={33} style={{ cursor: 'pointer' }} />
      </div>}
      bottomActions={<BottomActions
        active={active}
        setActive={setActive}
      />}
      style={{ height: `${Cookies.get("hom_isEmailNotVerified") == "true" ? `94vh` : `100vh`}`, minHeight:"60vh", border: 0, width: "60px" }}
      topActions={
        <TopActions
          active={active}
          setActive={setActive}
        />
      }
    />
  );
};

export default memo(LeftMainSideBar);
