import { SearchBar } from '@lobehub/ui';
import { useResponsive } from 'antd-style';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useMarketStore } from '@/store/market';

const AgentSearchBar = memo(() => {
  const { t } = useTranslation('market');
  const [keywords, setKeywords] = useMarketStore((s) => [s.searchKeywords, s.setSearchKeywords]);
  const { mobile } = useResponsive();

  const handleChange = (e: any) => {
    const inputValue = e.target.value;
    setKeywords(inputValue);
  };

  return (
    <SearchBar
      allowClear
      enableShortKey={!mobile}
      onChange={handleChange}
      onPressEnter={handleChange}
      onSubmit={handleChange}
      placeholder={t('search.placeholder')}
      shortKey={'k'}
      // spotlight={!mobile} // Enable this later
      type={mobile ? 'block' : 'ghost'}
      value={keywords}
    />
  );
});

export default AgentSearchBar;
