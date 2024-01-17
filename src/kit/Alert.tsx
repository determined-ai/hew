import { Alert as AntdAlert } from 'antd';
import React, { ReactNode } from 'react';

interface Props {
  message: string;
  description?: string;
  showIcon?: boolean;
  icon?: ReactNode;
  type?: 'success' | 'info' | 'warning' | 'error';
}
const Alert: React.FC<Props> = (props: Props) => {
  return <AntdAlert {...props} />;
};

export default Alert;
