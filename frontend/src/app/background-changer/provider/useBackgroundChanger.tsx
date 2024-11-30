import { useContext } from 'react';
import { BackgroundChangerContext } from './BackgroundChangerProvider';

const useBackgroundChanger = () => {
    return useContext(BackgroundChangerContext);
}

export default useBackgroundChanger;