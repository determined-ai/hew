import { Modal } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Button from 'kit/Button';
import Dropdown from 'kit/Dropdown';
import Icon from 'kit/Icon';
import { Document } from 'kit/internal/types';
import Message from 'kit/Message';
import Select, { Option, SelectValue } from 'kit/Select';
import { ErrorHandler } from 'kit/utils/error';
import usePrevious from 'kit/utils/usePrevious';

import DocumentCard from './DocumentCard';
import css from './DocumentCards.module.scss';

interface Props {
  disabled?: boolean;
  docs: Document[];
  onError: ErrorHandler;
  onDelete?: (pageNumber: number) => void;
  onNewPage: () => void;
  onSave: (docs: Document[]) => Promise<void>;
  onPageUnloadHook?: (u: () => boolean) => void;
}

const DocCards: React.FC<Props> = ({
  docs,
  onNewPage,
  onSave,
  onDelete,
  onError,
  onPageUnloadHook,
  disabled = false,
}: Props) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(0);
  const [editedContents, setEditedContents] = useState(docs?.[currentPage]?.contents ?? '');
  const [modal, contextHolder] = Modal.useModal();
  const [docChangeSignal, setDocChangeSignal] = useState(1);
  const fireDocChangeSignal = useCallback(
    () => setDocChangeSignal((prev) => (prev === 100 ? 1 : prev + 1)),
    [setDocChangeSignal],
  );

  const previousNumberOfdocs = usePrevious(docs.length, undefined);

  const DROPDOWN_MENU = useMemo(
    () => [{ danger: true, disabled: !onDelete, key: 'delete', label: 'Delete...' }],
    [onDelete],
  );

  const handleSwitchPage = useCallback(
    (pageNumber: number | SelectValue) => {
      if (pageNumber === currentPage) return;
      if (editedContents !== docs?.[currentPage]?.contents) {
        modal.confirm({
          content: (
            <p>
              You have unsaved documents, are you sure you want to switch pages? Unsaved documents
              will be lost.
            </p>
          ),
          onOk: () => {
            setCurrentPage(pageNumber as number);
            fireDocChangeSignal();
          },
          title: 'Unsaved content',
        });
      } else {
        setCurrentPage(pageNumber as number);
        setEditedContents(docs?.[currentPage]?.contents ?? '');
        fireDocChangeSignal();
      }
    },
    [currentPage, editedContents, modal, docs, fireDocChangeSignal],
  );

  useEffect(() => {
    if (previousNumberOfdocs == null) {
      if (docs.length) {
        handleSwitchPage(0);
        fireDocChangeSignal();
      }
    } else if (docs.length > previousNumberOfdocs) {
      handleSwitchPage(docs.length - 1);
    } else if (docs.length < previousNumberOfdocs) {
      // dont call handler here because page isn't actually switching
      setCurrentPage((prevPageNumber) =>
        prevPageNumber > deleteTarget ? prevPageNumber - 1 : prevPageNumber,
      );
    }
  }, [previousNumberOfdocs, docs.length, deleteTarget, handleSwitchPage, fireDocChangeSignal]);

  const handleNewPage = useCallback(() => {
    const currentPages = docs.length;
    onNewPage();
    handleSwitchPage(currentPages);
  }, [docs.length, onNewPage, handleSwitchPage]);

  const handleSave = useCallback(
    async (doc: Document) => {
      setEditedContents(doc.contents);
      await onSave(docs.map((n, idx) => (idx === currentPage ? doc : n)));
    },
    [currentPage, docs, onSave],
  );

  const handleDeletePage = useCallback(
    (deletePageNumber: number) => {
      onDelete?.(deletePageNumber);
      setDeleteTarget(deletePageNumber);
    },
    [onDelete, setDeleteTarget],
  );

  const handleEditeddocs = useCallback((newContents: string) => {
    setEditedContents(newContents);
  }, []);

  useEffect(() => {
    if (docs.length === 0) return;
    if (currentPage < 0) {
      setCurrentPage(0);
      fireDocChangeSignal();
    }
    if (currentPage >= docs.length) {
      setCurrentPage(docs.length - 1);
      fireDocChangeSignal();
    }
  }, [currentPage, docs.length, fireDocChangeSignal]);

  useEffect(() => {
    setEditedContents((prev) => docs?.[currentPage]?.contents ?? prev);
  }, [currentPage, docs]);

  const handleDropdown = useCallback(
    (pageNumber: number) => handleDeletePage(pageNumber),
    [handleDeletePage],
  );

  if (docs.length === 0) {
    return (
      <Message
        description={
          <>
            <p>No documents for this project</p>
            {!disabled && <Button onClick={handleNewPage}>+ New Document</Button>}
          </>
        }
        icon="document"
      />
    );
  }

  return (
    <>
      <div className={css.tabOptions}>
        {!disabled && (
          <Button type="text" onClick={onNewPage}>
            + New Doc
          </Button>
        )}
      </div>
      <div className={css.base}>
        {docs.length > 0 && (
          <div className={css.sidebar}>
            <ul className={css.listContainer} role="list">
              {(docs as Document[]).map((doc, idx) => (
                <Dropdown
                  disabled={disabled}
                  isContextMenu
                  key={idx}
                  menu={DROPDOWN_MENU}
                  onClick={() => handleDropdown(idx)}>
                  <li
                    className={css.listItem}
                    style={{
                      borderColor:
                        idx === currentPage ? 'var(--theme-stage-border-strong)' : undefined,
                    }}
                    onClick={() => handleSwitchPage(idx)}>
                    <span>{doc.name}</span>
                    {!disabled && (
                      <Dropdown menu={DROPDOWN_MENU} onClick={() => handleDropdown(idx)}>
                        <div className={css.action} onClick={(e) => e.stopPropagation()}>
                          <Icon name="overflow-horizontal" title="Action menu" />
                        </div>
                      </Dropdown>
                    )}
                  </li>
                </Dropdown>
              ))}
            </ul>
          </div>
        )}
        <div className={css.pageSelectRow}>
          <Select value={currentPage} onSelect={handleSwitchPage}>
            {docs.map((doc, idx) => {
              return (
                <Option key={idx} value={idx}>
                  <span
                    style={{
                      marginRight: 8,
                      visibility: idx === currentPage ? 'visible' : 'hidden',
                    }}>
                    <Icon decorative name="checkmark" size="small" />
                  </span>
                  <span>{doc.name}</span>
                </Option>
              );
            })}
          </Select>
        </div>
        <div className={css.docsContainer}>
          <DocumentCard
            disabled={disabled}
            doc={docs?.[currentPage]}
            documentChangeSignal={docChangeSignal}
            extra={
              <Dropdown menu={DROPDOWN_MENU} onClick={() => handleDropdown(currentPage)}>
                <Button
                  icon={<Icon name="overflow-horizontal" title="Action menu" />}
                  type="text"
                />
              </Dropdown>
            }
            onChange={handleEditeddocs}
            onError={onError}
            onPageUnloadHook={onPageUnloadHook}
            onSaveDocument={handleSave}
          />
        </div>
        {contextHolder}
      </div>
    </>
  );
};

export default DocCards;
