import React, { ReactNode } from 'react';

import Icon, { IconName } from 'kit/Icon';
import { useTheme } from 'kit/Theme';
import { Title } from 'kit/Typography';

import css from './Message.module.scss';

interface base {
  action?: React.ReactElement;
  icon?: IconName | React.ReactElement;
  testId?: string;
}
interface descriptionRequired extends base {
  description: ReactNode;
  title?: string;
}
interface titleRequired extends base {
  title: string;
  description?: ReactNode;
}

export type Props = descriptionRequired | titleRequired;

const Message: React.FC<Props> = ({ action, description, title, icon, testId }: Props) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [css.base, themeClass];
  const getIcon = (icon?: IconName | React.ReactElement) => {
    if (typeof icon === 'string') {
      return <Icon decorative name={icon as IconName} size="jumbo" />;
    } else {
      return icon;
    }
  };

  return (
    <div className={classes.join(' ')} data-testid={testId}>
      {icon && getIcon(icon)}
      {title && <Title>{title}</Title>}
      {description && <span className={css.description}>{description}</span>}
      {action}
    </div>
  );
};

export default Message;
