import { Modal as AntdModal } from 'antd';
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';

import Button from 'kit/Button';
import Icon, { IconName } from 'kit/Icon';
import Spinner from 'kit/Spinner';
import { useTheme } from 'kit/Theme';
import { ErrorHandler, ErrorLevel, ErrorType } from 'kit/utils/error';
import { ValueOf } from 'kit/utils/types';

import { type AnyMouseEvent } from './internal/types';
import css from './Modal.module.scss';

export type ModalSize = 'small' | 'medium' | 'large';
const modalWidths: { [key in ModalSize]: number } = {
  large: 1025,
  medium: 692,
  small: 358,
};

const ModalCloseReason = {
  Cancel: 'cancel',
  Ok: 'ok',
};
export type ModalCloseReason = ValueOf<typeof ModalCloseReason>;

export type Opener = Dispatch<SetStateAction<boolean>>;

export type ModalContext = {
  isOpen: boolean;
  setIsOpen: Opener;
};

export interface ModalSubmitParams {
  disabled?: boolean;
  text: string;
  handler: (e: React.MouseEvent) => Promise<void> | void;
  onComplete?: () => Promise<void> | void;
  handleError: ErrorHandler;
  form?: string;
}

interface ModalProps {
  cancel?: boolean;
  cancelText?: string;
  danger?: boolean;
  footer?: React.ReactNode;
  footerLink?: React.ReactNode;
  headerLink?: React.ReactNode;
  icon?: IconName;
  key?: string;
  onClose?: () => void;
  size?: ModalSize;
  submit?: ModalSubmitParams;
  title: string;
  children: ReactNode;
}

export const DEFAULT_CANCEL_LABEL = 'Cancel';

const ModalContext = createContext<ModalContext | null>(null);

export const Modal: React.FC<ModalProps> = ({
  cancel,
  cancelText,
  danger,
  footer,
  footerLink,
  headerLink,
  icon,
  key,
  onClose,
  size = 'large',
  submit,
  title,
  children: modalBody,
}: ModalProps) => {
  const modalContext = useContext(ModalContext);
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  if (modalContext === null) {
    throw new Error('Modal used outside of ModalContext');
  }
  const classes = [css.modalContent, themeClass];
  const { isOpen, setIsOpen } = modalContext;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [setIsOpen, onClose]);

  const handleSubmit = useCallback(
    async (e: React.MouseEvent) => {
      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve)); // delays form validation until next event cycle to prevent validation conflicts
        await submit?.handler(e);
        setIsSubmitting(false);
        setIsOpen(false);
        await submit?.onComplete?.();
      } catch (err) {
        submit?.handleError(err, {
          level: ErrorLevel.Error,
          publicMessage: err instanceof Error ? err.message : '',
          publicSubject: 'Could not submit form',
          silent: false,
          type: ErrorType.Server,
        });
        setIsSubmitting(false);
      }
    },
    [submit, setIsOpen],
  );

  const stopEventPropagation = (e: AnyMouseEvent) => e.stopPropagation();

  return (
    <div
      className={css.wrapper}
      onClick={stopEventPropagation}
      onContextMenu={stopEventPropagation}>
      <AntdModal
        cancelText={cancelText}
        className={classes.join(' ')}
        closeIcon={<Icon name="close" size="small" title="Close modal" />}
        footer={
          <div className={css.footer}>
            {footer ?? (
              <>
                <div className={css.footerLink}>{footerLink}</div>
                <div className={css.buttons}>
                  {(cancel || cancelText) && (
                    <Button key="back" onClick={close}>
                      {cancelText || DEFAULT_CANCEL_LABEL}
                    </Button>
                  )}
                  <Button
                    danger={danger}
                    disabled={!!submit?.disabled}
                    form={submit?.form}
                    htmlType={submit?.form ? 'submit' : 'button'}
                    key="submit"
                    loading={isSubmitting}
                    tooltip={
                      submit?.disabled ? 'Address validation errors before proceeding' : undefined
                    }
                    type="primary"
                    onClick={handleSubmit}>
                    {submit?.text ?? 'OK'}
                  </Button>
                </div>
              </>
            )}
          </div>
        }
        key={key}
        maskClosable={true}
        open={isOpen}
        title={
          <div className={css.header}>
            {danger ? (
              <div className={css.dangerIcon}>
                <Icon name="warning" size="large" title="Danger" />
              </div>
            ) : (
              icon && <Icon decorative name={icon} size="large" />
            )}
            <div className={css.headerTitle}>{title}</div>
            <div className={css.headerLink}>{headerLink}</div>
          </div>
        }
        width={modalWidths[size]}
        onCancel={close}
        onOk={handleSubmit}>
        <Spinner spinning={isSubmitting}>
          <div className={css.modalBody}>{modalBody}</div>
        </Spinner>
      </AntdModal>
    </div>
  );
};

export const useModal = <ModalProps extends object>(
  Comp: React.FC<ModalProps>,
): {
  close: (reason: ModalCloseReason) => void;
  Component: React.FC<ModalProps>;
  open: () => void;
} => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = React.useCallback(() => setIsOpen(true), []);
  const handleClose = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const Component = React.useCallback(
    (props: ModalProps) => {
      return (
        <ModalContext.Provider value={{ isOpen, setIsOpen }}>
          <Comp {...props} />
        </ModalContext.Provider>
      );
    },
    [Comp, isOpen],
  );

  return { close: handleClose, Component, open: handleOpen };
};
