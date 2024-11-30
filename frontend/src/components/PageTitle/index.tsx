import { memo, useEffect } from 'react';

const PageTitle = memo<{ title: string }>(({ title }) => {
  useEffect(() => {
    document.title = title ? `${title} · House Of Models` : 'House Of Models';
  }, [title]);

  return null;
});

export default PageTitle;
