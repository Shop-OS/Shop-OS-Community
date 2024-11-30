import axios from 'axios';
import { useMutation } from 'react-query';

export const getUploadStatus = ({ imgFilename }) => {
  return axios.get(`https://o7f418dl092wbr-5000.proxy.runpod.net/get-upload-status/${imgFilename}`);
};

export const useUploadStatus = ({ config } = {}) => {
  return useMutation({
    onError: (_, __, context) => {
      console.log("Can't get upload status");
    },
    onSuccess: async ({ imgFilename }) => {
      // Handle the successful upload status retrieval
      console.log(`Upload status for ${imgFilename} retrieved successfully`);
    },
    ...config,
    mutationFn: getUploadStatus,
  });
};
