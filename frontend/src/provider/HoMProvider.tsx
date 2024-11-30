import { createContext, useRef, useState } from 'react';

const HoMContext = createContext<any>({});


const HoMProvider = ({ children }: any) => {

    const [showTour, setShowTour] = useState(false);
    const [tourType, setTourType] = useState('');

    const value = {
        showTour,
        setShowTour,
        tourType,
        setTourType,
    };

    return (
        <HoMContext.Provider value={value}>
            {children}
        </HoMContext.Provider>
    )
}

export { HoMProvider, HoMContext };