import { useContext } from 'react';
import { ApparelContext } from './ApparelProvider';

const useApparel = () => {
    return useContext(ApparelContext);
}

export default useApparel;