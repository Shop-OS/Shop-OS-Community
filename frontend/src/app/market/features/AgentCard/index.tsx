import { SpotlightCardProps } from '@lobehub/ui';
import isEqual from 'fast-deep-equal';
import { FC, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';
import LazyLoad from 'react-lazy-load';

import { agentMarketSelectors, useMarketStore } from '@/store/market';

import TagList from '../TagList';
import AgentCardItem from './AgentCardItem';
import Loading from './Loading';
import homAgentsDev from './agentList.json';
import homAgentsProd from './agentList_prod.json';
import { useStyles } from './style';
import { Badge } from 'antd';

export interface AgentCardProps {
  CardRender: FC<SpotlightCardProps>;
  mobile?: boolean;
}

const AgentCard = memo<AgentCardProps>(({ CardRender, mobile }) => {
  const { t } = useTranslation('market');
  const [useFetchAgentList, keywords] = useMarketStore((s) => [
    s.useFetchAgentList,
    s.searchKeywords,
  ]);
  const { isLoading } = useFetchAgentList();
  const agentList = useMarketStore(agentMarketSelectors.getAgentList, isEqual);
  const { styles } = useStyles();

  const homAgents = homAgentsDev;
  // const homAgents = process.env.NEXT_PUBLIC_ENVIRONMENT !== 'development' ? homAgentsProd : homAgentsDev;

  const GridRender: SpotlightCardProps['renderItem'] = useCallback(
    (props: any) => (
      <LazyLoad className={styles.lazy}>
        <AgentCardItem {...props} />
      </LazyLoad>
    ),
    [styles.lazy],
  );
  let filteredAgents = keywords
    ? homAgents.agents.filter((agent: any) => {
      return (
        agent.meta.title.toLowerCase().includes(keywords.toLowerCase()) ||
        agent.meta.description.toLowerCase().includes(keywords.toLowerCase())
      );
    })
    : homAgents.agents;

  if (isLoading) return <Loading />;

  return (
    <Flexbox gap={mobile ? 16 : 24}>
      <TagList />
      {keywords ? (
        <CardRender
          items={filteredAgents}
          renderItem={GridRender}
          spotlight={mobile ? undefined : true}
        />
      ) : (
        <>
          {/* <div className={styles.subTitle}>{t('title.recentSubmits')}</div>
          <CardRender items={agentList.slice(0, 3)} renderItem={GridRender} /> */}
          <div className={styles.subTitle}>{t('title.allAgents')}</div>
          <CardRender
            items={homAgents.agents}
            renderItem={GridRender}
            spotlight={mobile ? undefined : true}
          />
        </>
      )}
    </Flexbox>
  );
});

export default AgentCard;
