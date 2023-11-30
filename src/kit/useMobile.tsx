import useResize from './internal/useResize';
import styles from './scss/breakpoints.module.scss';

export const MOBILE_BREAKPOINT = parseInt(styles.breakpointMobile.split('px')[0]);

const useMobile = (): boolean => {
  const { width } = useResize();

  return width < MOBILE_BREAKPOINT;
};

export default useMobile;
