import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

function useIsEmailVerified() {
    // const isEmailNotVerified = Cookies.get('hom_isEmailNotVerified');
    const [isEmailNotVerified, setIsEmailNotVerified] = useState(false);

    useEffect(() => {
        const isEmailNotVerified = Cookies.get('hom_isEmailNotVerified') == 'true';
        setIsEmailNotVerified(isEmailNotVerified);

    });
    return isEmailNotVerified;
}

export default useIsEmailVerified;
