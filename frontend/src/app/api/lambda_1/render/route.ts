import {
  AwsRegion,
  RenderMediaOnLambdaOutput,
  renderMediaOnLambda,
  speculateFunctionName,
} from '@remotion/lambda/client';
import { DISK, RAM, REGION, SITE_NAME, TIMEOUT } from '@root/config.mjs';

import { executeApi } from '../../../ad-gen/helpers/api-response';
import { RenderRequest } from '../../../ad-gen/types/schema';

export const POST = executeApi<RenderMediaOnLambdaOutput, typeof RenderRequest>(
  RenderRequest,
  async (req, body) => {
    if (!process.env.AWS_ACCESS_KEY_ID && !process.env.REMOTION_AWS_ACCESS_KEY_ID) {
      throw new TypeError(
        'Set up Remotion Lambda to render videos. See the README.md for how to do so.',
      );
    }
    if (!process.env.AWS_SECRET_ACCESS_KEY && !process.env.REMOTION_AWS_SECRET_ACCESS_KEY) {
      throw new TypeError(
        'The environment variable REMOTION_AWS_SECRET_ACCESS_KEY is missing. Add it to your .env file.',
      );
    }

    const result = await renderMediaOnLambda({
      codec: 'h264',
      composition: body.id,
      downloadBehavior: {
        fileName: 'video.mp4',
        type: 'download',
      },
      framesPerLambda: 10,
      functionName: speculateFunctionName({
        diskSizeInMb: DISK,
        memorySizeInMb: RAM,
        timeoutInSeconds: TIMEOUT,
      }),
      inputProps: body.inputProps,
      region: REGION as AwsRegion,
      serveUrl: SITE_NAME,
    });

    return result;
  },
);