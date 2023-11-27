import { Switch } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import Label from 'kit/internal/Label';

import Column from './Column';
import Row from './Row';
interface Props {
  checked?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
}

const Toggle: React.FC<Props> = ({ checked = false, label, onChange }: Props) => {
  const [toggled, setToggled] = useState(checked);
  useEffect(() => {
    setToggled(checked);
  }, [checked, setToggled]);

  const handleClick = useCallback(() => {
    if (onChange) {
      onChange(!toggled);
    } else {
      setToggled(!toggled);
    }
  }, [toggled, onChange, setToggled]);

  return (
    <Row>
      <Column width="hug">{label && <Label type="textOnly">{label}</Label>}</Column>
      <Column width="hug">
        <Switch checked={toggled} size="small" onClick={handleClick} />
      </Column>
    </Row>
  );
};

export default Toggle;
