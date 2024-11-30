import { useContext } from 'react';
import { HoMContext } from './HoMProvider';

const useHomProvider = () => {
    return useContext(HoMContext);
}

export default useHomProvider;