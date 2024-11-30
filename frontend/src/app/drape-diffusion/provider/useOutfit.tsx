import { useContext } from 'react';
import { OutfitContext } from './OutfitProvider';

const useOutfit = () => {
    return useContext(OutfitContext);
}

export default useOutfit;