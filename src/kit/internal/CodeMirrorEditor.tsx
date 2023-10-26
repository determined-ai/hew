import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { python } from '@codemirror/lang-python';
import { StreamLanguage } from '@codemirror/language';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';
import ReactCodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import React from 'react';

import { useUIState } from 'kit/internal/theme';

interface Props extends ReactCodeMirrorProps {
  syntax: 'python' | 'markdown' | 'yaml';
}

const langs = {
  markdown: () => markdown({ base: markdownLanguage }),
  python,
  yaml: () => StreamLanguage.define(yaml),
};

const CodeMirrorEditor: React.FC<Props> = ({ syntax, ...props }) => {
  const { uiState } = useUIState();
  const isDarkMode = uiState.themeIsDark;

  return (
    <ReactCodeMirror
      extensions={[langs[syntax]()]}
      theme={isDarkMode ? 'dark' : 'light'}
      {...props}
    />
  );
};

export default CodeMirrorEditor;
