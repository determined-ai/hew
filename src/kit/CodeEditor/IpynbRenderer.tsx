import React, { RefObject, useEffect, useRef, useState } from 'react';

import { ErrorHandler, ErrorType } from 'kit/utils/error';
import NotebookJS from 'notebook';

import 'kit/internal/monokai.css';

interface Props {
  file: string;
  onError: ErrorHandler;
}

export const parseNotebook = (
  containerRef: RefObject<HTMLElement>,
  file: string,
  onError: ErrorHandler,
): string => {
  try {
    const json = JSON.parse(file);
    const notebookJS = NotebookJS.parse(json);
    return notebookJS.render().outerHTML;
  } catch (e) {
    onError(containerRef, 'Unable to parse as Notebook!');
    return '';
  }
};

const JupyterRenderer: React.FC<Props> = React.memo(({ file, onError }) => {
  const [__html, setHTML] = useState<string>();
  const elementRef = useRef(null);
  useEffect(() => {
    try {
      const html = parseNotebook(elementRef, file, onError);
      setHTML(html);
    } catch (error) {
      onError(elementRef, error, {
        publicMessage: 'Failed to load selected notebook.',
        publicSubject: 'Unable to parse the selected notebook.',
        silent: true,
        type: ErrorType.Input,
      });
    }
  }, [file, onError]);

  return __html ? (
    <div className="ipynb-renderer-root" dangerouslySetInnerHTML={{ __html }} ref={elementRef} />
  ) : (
    <div>{file}</div>
  );
});

export default JupyterRenderer;
