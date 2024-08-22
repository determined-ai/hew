import { mapLeft, match, tryCatch } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import React, { useEffect, useMemo } from 'react';

import { ErrorHandler, ErrorType } from 'kit/utils/error';
import NotebookJS from 'notebook';

import 'kit/internal/monokai.css';

interface Props {
  file: string;
  onError: ErrorHandler;
}

export const parseNotebook = (file: string): string => {
  const json = JSON.parse(file);
  const notebookJS = NotebookJS.parse(json);
  return notebookJS.render().outerHTML;
};

const JupyterRenderer: React.FC<Props> = React.memo(({ file, onError }) => {
  // parse the file and store the result as either a successful string or a failed error
  const parseResult = useMemo(() => {
    return tryCatch(
      () => parseNotebook(file),
      (e) => e,
    );
  }, [file]);

  useEffect(() => {
    // if the parse result is failed, call the error handler
    pipe(
      parseResult,
      mapLeft((e) => {
        onError(e, {
          publicMessage: 'Failed to load selected notebook.',
          publicSubject: 'Unable to parse the selected notebook.',
          silent: true,
          type: ErrorType.Input,
        });
      }),
    );
  }, [parseResult, onError]);

  // if the parse result is failed, fall back to the raw file, otherwise show the parse result html
  return pipe(
    parseResult,
    match(
      () => <div>{file}</div>,
      (__html) => <div className="ipynb-renderer-root" dangerouslySetInnerHTML={{ __html }} />,
    ),
  );
});

export default JupyterRenderer;
