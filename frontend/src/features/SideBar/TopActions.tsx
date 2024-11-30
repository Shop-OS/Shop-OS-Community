import { ActionIcon } from '@lobehub/ui';
import { Compass, LucideShirt, ScanFace, Shirt, TentTree, VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { GlobalStore } from '@/store/global';
import { SidebarTabKey } from '@/store/global/initialState';

export interface TopActionProps {
  setTab: GlobalStore['switchSideBar'];
  tab: GlobalStore['sidebarKey'];
}

const TopActions = memo<TopActionProps>(({ tab, setTab }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  return (
    <>
      <Link
        href={'/ad-gen'}
        onClick={(e) => {
          // e.preventDefault();
          // switchBackToChat(useSessionStore.getState().activeId);
          router.push('/ad-gen');
          setTab(SidebarTabKey.AdGenerator);
        }}
      >
        <ActionIcon
          active={tab === SidebarTabKey.AdGenerator}
          icon={VideoIcon}
          placement={'right'}
          size="large"
          title={'Ad-Gen'}
        />
      </Link>
      <Link
        href={'/background-change-faceswap'}
        onClick={(e) => {
          router.push('/background-change-faceswap');
          setTab(SidebarTabKey.BackgroundChangeFaceSwap);
        }}
      >
        <ActionIcon
          active={tab === SidebarTabKey.BackgroundChangeFaceSwap}
          icon={ScanFace}
          placement={'right'}
          size="large"
          title={'Background-Change-FaceSwap'}
        />
      </Link>
      <Link
        href={'/outfit-tryon'}
        onClick={(e) => {
          router.push('/outfit-tryon');
          setTab(SidebarTabKey.OutfitTryOn);
        }}
      >
        <ActionIcon
          active={tab === SidebarTabKey.OutfitTryOn}
          icon={LucideShirt}
          placement={'right'}
          size="large"
          title={'Outfit-Tryon'}
        />
      </Link>
      <Link
        href={'/background-change'}
        onClick={(e) => {
          router.push('/background-change');
          setTab(SidebarTabKey.BackgroundChange);
        }}
      >
        <ActionIcon
          active={tab === SidebarTabKey.BackgroundChange}
          icon={TentTree}
          placement={'right'}
          size="large"
          title="Background Change"
        />
      </Link>
      <Link href={'/market'}>
        <ActionIcon
          active={tab === SidebarTabKey.Market}
          icon={Compass}
          onClick={() => {
            setTab(SidebarTabKey.Market);
          }}
          placement={'right'}
          size="large"
          title={t('tab.market')}
        />
      </Link>
    </>
  );
});

export default TopActions;
