import { DataNode } from 'antd/es/tree';

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
// XOR is taken from: https://stackoverflow.com/a/53229857
export type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export interface TreeNode extends DataNode {
  /**
   * DataNode is the interface antd works with. DateNode properties we are interested in:
   *
   * key: we use V1FileNode.path
   * title: name of node
   * icon: custom Icon component
   */
  children?: TreeNode[];
  download?: string;
  get?: (path: string) => Promise<string>;
  isLeaf?: boolean;
  subtitle?: string;
}
