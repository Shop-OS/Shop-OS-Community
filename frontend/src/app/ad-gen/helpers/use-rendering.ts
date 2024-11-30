import { useCallback, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

import { getProgress, renderVideo } from '../lambda/api';
import { CompositionProps } from '../types/constants';

export type State =
  | {
      status: 'init';
    }
  | {
      status: 'invoking';
    }
  | {
      bucketName: string;
      progress: number;
      renderId: string;
      status: 'rendering';
    }
  | {
      error: Error;
      renderId: string | null;
      status: 'error';
    }
  | {
      size: number;
      status: 'done';
      url: string;
    };

const wait = async (milliSeconds: number) => {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliSeconds);
  });
};

export const useRendering = (id: string, inputProps: z.infer<typeof CompositionProps>) => {
  const [state, setState] = useState<State>({
    status: 'init',
  });

  useEffect(() => {
    console.log(state);
  }, [state]);

  const renderMedia = useCallback(async () => {
    setState({
      status: 'invoking',
    });
    try {
      console.log(inputProps);
      const { renderId, bucketName } = await renderVideo({ id, inputProps });
      setState({
        bucketName: bucketName,
        progress: 0,
        renderId: renderId,
        status: 'rendering',
      });

      let pending = true;

      while (pending) {
        const result = await getProgress({
          bucketName: bucketName,
          id: renderId,
        });
        switch (result.type) {
          case 'error': {
            setState({
              error: new Error(result.message),
              renderId: renderId,
              status: 'error',
            });
            pending = false;
            break;
          }
          case 'done': {
            setState({
              size: result.size,
              status: 'done',
              url: result.url,
            });
            pending = false;
            break;
          }
          case 'progress': {
            setState({
              bucketName: bucketName,
              progress: result.progress,
              renderId: renderId,
              status: 'rendering',
            });
            await wait(1000);
          }
        }
      }
    } catch (error) {
      setState({
        error: error as Error,
        renderId: null,
        status: 'error',
      });
    }
  }, [id, inputProps]);

  const undo = useCallback(() => {
    setState({ status: 'init' });
  }, []);

  return useMemo(() => {
    return {
      renderMedia,
      state,
      undo,
    };
  }, [renderMedia, state, undo]);
};
