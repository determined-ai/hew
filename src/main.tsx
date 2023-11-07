import { createRoot } from 'react-dom/client';

import 'antd/dist/reset.css';
import 'uplot/dist/uPlot.min.css';
import { ConfirmationProvider } from 'kit/useConfirm';

import DesignKitContainer from './DesignKit';

import 'styles/index.scss';
import UIProvider, { DefaultTheme } from 'kit/Theme';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <DesignKitContainer />
);
