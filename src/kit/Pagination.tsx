import { Pagination as AntdPagination } from 'antd';
import React, { ReactNode } from 'react';

import { useTheme } from 'kit/internal/Theme/theme';

interface PaginationProps {
  current?: number;
  itemRender?: (
    page: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    originalElement: ReactNode,
  ) => ReactNode;
  onChange?: (page: number, pageSize: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
  total: number;
}

const Pagination: React.FC<PaginationProps> = ({
  current = 1,
  pageSize = 10,
  total = 0,
  ...props
}: PaginationProps) => {
  const { themeSettings: { className } } = useTheme();
  return <AntdPagination className={className} current={current} pageSize={pageSize} total={total} {...props} />;
};

export default Pagination;
