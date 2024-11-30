// import { GradientButton, GradientButtonProps, useControls, useCreateStore } from '@lobehub/ui';
import { Button } from 'antd';
import React from 'react';
import { z } from 'zod';

import { useRendering } from '../helpers/use-rendering';
import { COMP_NAME, CompositionProps } from '../types/constants';
import { AlignEnd } from './AlignEnd';
import { InputContainer } from './Container';
import { DownloadButton } from './DownloadButton';
// import { DownloadButton } from './DownloadButton';
import { ErrorComp } from './Error';
import { ProgressBar } from './ProgressBar';
import { Spacing } from './Spacing';

export const RenderControls: React.FC<{
  // text: string;
  inputProps: z.infer<typeof CompositionProps>;
  logoSrc: string;
  productSrc: string;
  setLogoSrc: React.Dispatch<React.SetStateAction<string>>;
  setProductSrc: React.Dispatch<React.SetStateAction<string>>;
  // setText: React.Dispatch<React.SetStateAction<string>>;
}> = ({ inputProps }) => {
  const { renderMedia, state, undo } = useRendering(COMP_NAME, inputProps);
  // const { state } = useRendering(COMP_NAME, inputProps);
  // const store = useCreateStore();

  return (
    <InputContainer>
      {state.status === 'init' || state.status === 'invoking' || state.status === 'error' ? (
        <>
          {/* <Input
            disabled={state.status === "invoking"}
            setText={setText}
            text={text}
          ></Input> */}
          {/* <Spacing></Spacing> */}
          <AlignEnd>
            <Button
              disabled={state.status === 'invoking'}
              loading={state.status === 'invoking'}
              onClick={renderMedia}
            >
              Render video
            </Button>
            {/* <GradientButton {...control} /> */}
          </AlignEnd>
          {state.status === 'error' ? <ErrorComp message={state.error.message}></ErrorComp> : null}
        </>
      ) : null}
      {state.status === 'rendering' || state.status === 'done' ? (
        <>
          <ProgressBar progress={state.status === 'rendering' ? state.progress : 1} />
          <Spacing></Spacing>
          <AlignEnd>
            <DownloadButton state={state} undo={undo}></DownloadButton>
            {/* <GradientButton {...control} /> */}
          </AlignEnd>
        </>
      ) : null}
    </InputContainer>
  );
};
