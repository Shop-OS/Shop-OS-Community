import axios from 'axios';
import querystring from 'querystring';
import { useMutation } from 'react-query';

export const getCopyOutput = ({ data }) => {
  const encodedData = querystring.stringify(data);

  return axios.post(
    'https://harikrishna-al--mistral-inference-model-generate.modal.run',
    encodedData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
};

export const useCopyOutput = ({ config } = {}) => {
  return useMutation({
    onError: (_, __, context) => {
      console.log("Can't generate copy text");
    },
    onSuccess: async (prompt) => {
      // Handle success
    },
    ...config,
    mutationFn: getCopyOutput,
  });
};
