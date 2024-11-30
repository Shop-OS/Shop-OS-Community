import { AwsRegion, getRenderProgress, speculateFunctionName } from '@remotion/lambda/client';
import { DISK, RAM, REGION, TIMEOUT } from '@root/config.mjs';

import { executeApi } from '../../../ad-gen/helpers/api-response';
import { ProgressRequest, ProgressResponse } from '../../../ad-gen/types/schema';

export const POST = executeApi<ProgressResponse, typeof ProgressRequest>(
  ProgressRequest,
  async (req, body) => {
    const renderProgress = await getRenderProgress({
      bucketName: body.bucketName,
      functionName: speculateFunctionName({
        diskSizeInMb: DISK,
        memorySizeInMb: RAM,
        timeoutInSeconds: TIMEOUT,
      }),
      region: REGION as AwsRegion,
      renderId: body.id,
    });

    if (renderProgress.fatalErrorEncountered) {
      return {
        message: renderProgress.errors[0].message,
        type: 'error',
      };
    }

    if (renderProgress.done) {
      return {
        size: renderProgress.outputSizeInBytes as number,
        type: 'done',
        url: renderProgress.outputFile as string,
      };
    }

    return {
      progress: Math.max(0.03, renderProgress.overallProgress),
      type: 'progress',
    };
  },
);
