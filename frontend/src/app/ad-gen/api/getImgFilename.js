import axios from 'axios';
import { useMutation } from 'react-query';

export const getImgFilename = ({ data }) => {
  return axios.post(`https://o7f418dl092wbr-5000.proxy.runpod.net/generate-image`, data);
};

export const useImgFilename = ({ config } = {}) => {
  return useMutation({
    onError: (_, __, context) => {
      console.log("Can't generate image");
    },
    onSuccess: async (prompt) => {},
    ...config,
    mutationFn: getImgFilename,
  });
};
