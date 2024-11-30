import { z } from 'zod';

export const COMP_NAME = 'MyComp';

export const CompositionProps = z.object({
  backgroundImage: z.string().optional(),
  copyText: z.string().optional(),
  logoSrc: z.string(),
  productSrc: z.string(),
  selectedOption: z.string(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  logoSrc:
    'https://firebasestorage.googleapis.com/v0/b/svd-demo-9aee7.appspot.com/o/0479a72db5cc40ebaa12dd83c1aa81a8.jpeg?alt=media&token=f21f70bc-0f9c-443c-b5bc-6f15cdc1d5d9',
  productSrc:
    'https://firebasestorage.googleapis.com/v0/b/svd-demo-9aee7.appspot.com/o/0479a72db5cc40ebaa12dd83c1aa81a8.jpeg?alt=media&token=f21f70bc-0f9c-443c-b5bc-6f15cdc1d5d9',
};

export const DURATION_IN_FRAMES = 450;
export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 50;
