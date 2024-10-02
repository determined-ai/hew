import styles from './scss/breakpoints.module.scss';
import { useMediaQuery } from './utils/useMediaQuery';

export const MOBILE_BREAKPOINT = styles.breakpointMobile;

const useMobile = (): boolean => useMediaQuery(`only screen and (max-width: ${MOBILE_BREAKPOINT})`);

export default useMobile;
