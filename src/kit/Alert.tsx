import { Alert as AntdAlert } from 'antd';
import React, { ReactNode } from 'react';

interface Props {
  message: string;
  action?: ReactNode;
  description?: ReactNode;
  showIcon?: boolean;
  icon?: ReactNode;
  type?: 'success' | 'info' | 'warning' | 'error';
}
const Alert: React.FC<Props> = (props: Props) => {
  return <AntdAlert {...props} />;
};

export default Alert;
