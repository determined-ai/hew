import { langs } from '@uiw/codemirror-extensions-langs';
import ReactCodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import React from 'react';

import { useTheme } from 'kit/Theme';

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
