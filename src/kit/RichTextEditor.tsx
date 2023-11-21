import { Document } from 'kit/internal/types';
import { ErrorHandler } from 'kit/utils/error';

import DocumentCard from './DocumentCard';
import DocumentCards from './DocumentCards';
import { XOR } from './utils/types';
type CommonProps = {
  disabled?: boolean;
  disableTitle?: boolean;
  onError: ErrorHandler;
  onPageUnloadHook?: (u: () => boolean) => void;
};
type MultiProps = {
  multiple: true;
  docs: Document[];
  onDelete?: (pageNumber: number) => void;
  onNewPage: () => void;
  onSave: (docs: Document[]) => Promise<void>;
};
type SingleProps = {
  docs: Document;
  onSave: (docs: Document) => Promise<void>;
};
export type Props = CommonProps & XOR<SingleProps, MultiProps>;

const RichTextEditor: React.FC<Props> = (props: Props) => {
  if (props.multiple) {
    const { multiple, ...documentCardsProps } = props;
    return <DocumentCards {...documentCardsProps} />;
  }
  const { multiple, docs, onSave, ...documentCardProps } = props;
  return <DocumentCard doc={docs} onSaveDocument={onSave} {...documentCardProps} />;
};

export default RichTextEditor;
