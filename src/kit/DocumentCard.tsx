import { Card, Space } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Button from 'kit/Button';
import Icon from 'kit/Icon';
import Input from 'kit/Input';
import Markdown from 'kit/internal/Markdown';
import { Document } from 'kit/internal/types';
import Spinner from 'kit/Spinner';
import { useTheme } from 'kit/Theme';
import { ErrorHandler, ErrorType } from 'kit/utils/error';

import css from './DocumentCard.module.scss';

interface Props {
  disabled?: boolean;
  disableTitle?: boolean;
  extra?: React.ReactNode;
  documentChangeSignal?: number;
  doc: Document; // not to mix with the HTML document API
  onChange?: (editedDocs: string) => void;
  onError: ErrorHandler;
  onSaveDocument: (docs: Document) => Promise<void>;
  onPageUnloadHook?: ((u: () => boolean) => void) | undefined;
}

const DocumentCard: React.FC<Props> = ({
  disabled = false,
  disableTitle = false,
  doc,
  extra,
  onChange,
  onError,
  onSaveDocument,
  onPageUnloadHook,
  documentChangeSignal,
}: Props) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [css.base, themeClass];
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedDocs, setEditedDocs] = useState(doc?.contents || '');
  const [editedTitle, setEditedTitle] = useState(doc?.name || '');
  const [docs, title] = useMemo(() => [doc?.contents || '', doc?.name || ''], [doc]);

  const blocker = () => {
    if (isEditing && docs !== editedDocs) {
      const answer = window.confirm(
        'You have unsaved documents, are you sure you want to leave? Unsaved documents will be lost.',
      );
      return !answer;
    }
    return false;
  };
  onPageUnloadHook?.(blocker);

  const existingDocs = useRef(docs);
  const existingTitle = useRef(title);

  useEffect(() => {
    existingDocs.current = docs;
  }, [docs]);
  useEffect(() => {
    existingTitle.current = title;
  }, [title]);

  useEffect(() => {
    setIsEditing(false);
    setIsLoading(false);
    setEditedDocs(existingDocs.current);
    setEditedTitle(existingTitle.current);
  }, [documentChangeSignal]);

  const editDocs = useCallback(() => {
    if (disabled) return;
    setIsEditing(true);
  }, [disabled]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditedDocs(docs);
    onChange?.(docs);
    setEditedTitle(title);
  }, [docs, title, onChange]);

  const onSave = useCallback(
    async (editDocs: string) => {
      await onSaveDocument({ contents: editDocs, name: editedTitle });
    },
    [onSaveDocument, editedTitle],
  );

  const onSaveTitle = useCallback(
    async (editTitle: string) => {
      await onSaveDocument({ contents: editedDocs, name: editTitle });
    },
    [onSaveDocument, editedDocs],
  );

  const saveDocs = useCallback(async () => {
    try {
      setIsLoading(true);
      await onSave?.(editedDocs.trim());
      setIsEditing(false);
    } catch (e) {
      onError(e, {
        publicSubject: 'Unable to update documents.',
        silent: true,
        type: ErrorType.Api,
      });
    }
    setIsLoading(false);
  }, [editedDocs, onSave, onError]);

  const handleEditedDocs = useCallback(
    (newDocs: string) => {
      setEditedDocs(newDocs);
      onChange?.(newDocs);
    },
    [onChange],
  );

  const handleDocsClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.detail > 1 || docs === '') editDocs();
    },
    [editDocs, docs],
  );

  useEffect(() => {
    setEditedDocs(docs);
    setIsEditing(false);
  }, [docs]);

  return (
    <Card
      bodyStyle={{
        flexGrow: 1,
        flexShrink: 1,
        overflow: 'auto',
        padding: 0,
      }}
      className={classes.join(' ')}
      extra={
        isEditing ? (
          <Space size="small">
            <Button size="small" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button size="small" type="primary" onClick={saveDocs}>
              Save
            </Button>
          </Space>
        ) : (
          disabled || (
            <Space size="middle">
              <Button
                icon={<Icon name="pencil" showTooltip size="small" title="Edit" />}
                type="text"
                onClick={editDocs}
              />
              {extra}
            </Space>
          )
        )
      }
      headStyle={{ marginTop: '16px', minHeight: 'fit-content', paddingInline: '16px' }}
      title={
        <Input
          defaultValue={title}
          disabled={disableTitle || disabled}
          value={editedTitle}
          onBlur={(e) => {
            const newValue = e.currentTarget.value;
            onSaveTitle?.(newValue);
          }}
          onChange={(e) => {
            const newValue = e.currentTarget.value;
            setEditedTitle(newValue);
          }}
          onPressEnter={(e) => {
            e.currentTarget.blur();
          }}
        />
      }>
      <Spinner spinning={isLoading}>
        <Markdown
          disabled={disabled}
          editing={isEditing}
          markdown={isEditing ? editedDocs : docs}
          onChange={handleEditedDocs}
          onClick={handleDocsClick}
        />
      </Spinner>
    </Card>
  );
};

export default DocumentCard;
