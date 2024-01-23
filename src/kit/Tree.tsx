import { Tree as AntdTree, TreeDataNode } from 'antd';
import React from 'react';

interface Props {
  defaultExpandAll?: boolean;
  treeData?: TreeDataNode[];
}
const Tree: React.FC<Props> = (props: Props) => {
  return <AntdTree {...props} />;
};

export default Tree;
