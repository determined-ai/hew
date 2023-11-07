import { useTheme } from 'kit/Theme';
import { Note } from 'kit/internal/types';
import { ErrorHandler } from 'kit/utils/error';

import NoteCard from './NoteCard';
import NoteCards from './NoteCards';
type CommonProps = {
  disabled?: boolean;
  disableTitle?: boolean;
  onError: ErrorHandler;
  onPageUnloadHook?: (u: () => boolean) => void;
};
type MultiProps = CommonProps & {
  multiple: true;
  notes: Note[];
  onDelete?: (pageNumber: number) => void;
  onNewPage: () => void;
  onSave: (notes: Note[]) => Promise<void>;
};
type SingleProps = CommonProps & {
  multiple?: false;
  notes: Note;
  onSave: (notes: Note) => Promise<void>;
};
export type Props = MultiProps | SingleProps;

const Notes: React.FC<Props> = (props: Props) => {
  if (props.multiple) {
    const { multiple, ...noteCardsProps } = props;
    return <NoteCards {...noteCardsProps} />;
  }
  const { multiple, notes, onSave, ...noteCardProps } = props;
  return <NoteCard note={notes} onSaveNote={onSave} {...noteCardProps} />;
};

export default Notes;
