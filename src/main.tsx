import { createRoot } from 'react-dom/client';

import 'antd/dist/reset.css';
import 'uplot/dist/uPlot.min.css';
import { UIProvider } from 'kit/Theme';
import { ConfirmationProvider } from 'kit/useConfirm';

import DesignKit from './DesignKit';

import 'styles/index.scss';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <UIProvider>
    <ConfirmationProvider>
      <DesignKit />
    </ConfirmationProvider>
  </UIProvider>,
);
