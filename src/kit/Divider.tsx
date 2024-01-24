import { Divider as AntdDivider } from 'antd';
import React, { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}
const Divider: React.FC<Props> = ({ children }: Props) => {
  return <AntdDivider>{children}</AntdDivider>;
};

export default Divider;
