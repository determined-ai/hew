import { Space, Switch } from 'antd';
import React, { useCallback } from 'react';

import Label from 'kit/internal/Label';
import { useTheme } from 'kit/internal/Theme/theme';
interface Props {
  checked?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
}

const Toggle: React.FC<Props> = ({ checked = false, label, onChange }: Props) => {
  const handleClick = useCallback(() => {
    if (onChange) onChange(!checked);
  }, [checked, onChange]);

  const { themeSettings: { className } } = useTheme();

  return (
    <Space className={className} onClick={handleClick}>
      {label && <Label>{label}</Label>}
      <Switch checked={checked} size="small" />
    </Space>
  );
};

export default Toggle;
