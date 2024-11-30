import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

function useIsLoggedIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('hom_token');
    setIsLoggedIn(!!token);
  }, []);

  return isLoggedIn;
}

export default useIsLoggedIn;
