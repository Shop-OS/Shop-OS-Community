import axios from 'axios';
import { useMutation } from 'react-query';

export const getGeneratedVideo = ({ prompt }) => {
  console.log('prompt', prompt);
  return axios.get(
    `https://api.videoblocks.com/api/v2/videos/search?APIKEY=test_5279e6ddf8521a6be30dff35da0826b43e7a317dee5bf3ce842dbd36f3b&EXPIRES=1705579777430&HMAC=d8d4bb564f267e0a87b45bdcad39bcea50d77b02970f33dc5e8be5f133342b9c&project_id=test123&user_id=testuser&keywords=${prompt}&content_type=motionbackgrounds&quality=HD&max_duration=15&results_per_page=10&sort_by=most_relevant&safe_search=true&frame_rates=30`,
  );
};
// 1705579269401
export const useGenerateVideo = ({ config } = {}) => {
  return useMutation({
    onError: (_, __, context) => {
      console.log("Can't generate video");
    },
    onSuccess: async (prompt) => {},
    ...config,
    mutationFn: getGeneratedVideo,
  });
};
