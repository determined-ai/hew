import { useEffect, useState } from 'react';

import styles from './scss/breakpoints.module.scss';

export const MOBILE_BREAKPOINT = styles.breakpointMobile;

const queries = window.matchMedia(`only screen and (max-width: ${MOBILE_BREAKPOINT})`);

const useMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(queries.matches);
  useEffect(() => {
    const onChange = () => setIsMobile(queries.matches);
    queries.addEventListener('change', onChange);
    return () => {
      queries.removeEventListener('change', onChange);
    };
  }, []);

  return isMobile;
};

export default useMobile;
