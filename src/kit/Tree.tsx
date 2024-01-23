import { Tree as AntdTree, TreeDataNode as AntdTreeDataNode } from 'antd';
import React from 'react';

export type TreeDataNode = AntdTreeDataNode;
interface Props {
  defaultExpandAll?: boolean;
  treeData?: TreeDataNode[];
}
const Tree: React.FC<Props> = (props: Props) => {
  return <AntdTree {...props} />;
};

export default Tree;
