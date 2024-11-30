import { useContext } from 'react';

import { TextTo3DContext } from './TextTo3DProvider';

const useTextTo3D = () => {
  return useContext(TextTo3DContext);
};

export default useTextTo3D;
