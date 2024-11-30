import { useContext } from 'react';
import { ProductBGContext } from './ProductBGProvider';

const useProductBG = () => {
    return useContext(ProductBGContext);
}

export default useProductBG;