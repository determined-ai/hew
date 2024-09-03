import ReactCodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import React from 'react';

import { useTheme } from 'kit/Theme';
import { langs } from 'kit/utils/codemirrorLanguages';

interface Props extends ReactCodeMirrorProps {
  syntax: keyof typeof langs;
}

const CodeMirrorEditor: React.FC<Props> = ({ syntax, ...props }) => {
  const {
    themeSettings: { themeIsDark },
  } = useTheme();

  return (
    <ReactCodeMirror
      extensions={[langs[syntax]()]}
      theme={themeIsDark ? 'dark' : 'light'}
      {...props}
    />
  );
};

export default CodeMirrorEditor;
