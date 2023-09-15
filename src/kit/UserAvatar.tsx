import React from 'react';

import Avatar, { Props as AvatarProps } from 'kit/internal/Avatar';
import { User } from 'kit/internal/types';
import useUI from 'kit/Theme';
import { getDisplayName } from 'utils/user';

export interface Props extends Omit<AvatarProps, 'darkLight' | 'displayName'> {
  user?: User;
}

const UserAvatar: React.FC<Props> = ({ user, ...rest }) => {
  const { ui } = useUI();
  const displayName = getDisplayName(user);

  return <Avatar {...rest} darkLight={ui.darkLight} displayName={displayName} />;
};

export default UserAvatar;
