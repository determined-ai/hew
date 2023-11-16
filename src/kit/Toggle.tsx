import { Switch } from 'antd';
import React, { useCallback } from 'react';

import Label from 'kit/internal/Label';

import Column from './Column';
import Row from './Row';
interface Props {
  checked?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
}

const Toggle: React.FC<Props> = ({ checked = false, label, onChange }: Props) => {
  const handleClick = useCallback(() => {
    if (onChange) onChange(!checked);
  }, [checked, onChange]);

  return (
    <Row>
      <Column width="hug">{label && <Label type="textOnly">{label}</Label>}</Column>
      <Column width="hug">
        <Switch checked={checked} size="small" onClick={handleClick} />
      </Column>
    </Row>
  );
};

export default Toggle;
