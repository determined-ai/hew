import React, { useState } from 'react';
import Button from '../../src/kit/Button';
import { Modal, useModal, modalWidths, ModalSize } from '../../src/kit/Modal';

import UIProvider, { DefaultTheme } from '../../src/kit/Theme';

const MODAL_TITLE = 'Modal Title';
const MODAL_CONTENT = 'Modal string value';
const MODAL_SIZE: ModalSize = 'medium';

const ModalComponent: React.FC<{ value: string }> = ({ value }) => {
  return (
    <UIProvider theme={DefaultTheme.Light}>
      <Modal title={MODAL_TITLE} size={MODAL_SIZE}>
        <div>{value}</div>
      </Modal>
    </UIProvider>
  );
};

const ModalTrigger: React.FC = () => {
  const Modal = useModal(ModalComponent);
  const [modalValue, setModalValue] = useState<string>('');
  return (
    <UIProvider theme={DefaultTheme.Light}>
      <Button
        onClick={() => {
          setModalValue(MODAL_CONTENT);
          Modal.open();
        }}>
        Open Modal
      </Button>
      <Modal.Component value={modalValue} />
    </UIProvider>
  );
};

describe('Modal.cy.tsx', () => {
  it('playground', () => {
    cy.mount(<ModalTrigger />);
    cy.get('button').click();
    cy.get('[role=dialog]')
      .should('have.css', 'width', modalWidths[MODAL_SIZE] + 'px') // 'be.visible' assertion not sufficient for antd Modal implementation
      .then(() => {
        cy.matchImage();
      });
  });
});
