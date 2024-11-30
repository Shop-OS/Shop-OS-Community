import { useContext } from 'react';
import { ProductDescriptionContext } from './ProductDescriptionProvider';

const useProductDescription = () => {
    return useContext(ProductDescriptionContext);
}

export default useProductDescription;