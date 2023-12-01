import { useEffect, useState } from 'react';

import styles from './scss/breakpoints.module.scss';

export const MOBILE_BREAKPOINT = parseInt(styles.breakpointMobile.split('px')[0]);

const getIsMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

const useMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(getIsMobile);
  useEffect(() => {
    const onResize = () => setIsMobile(getIsMobile);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return isMobile;
};

export default useMobile;
