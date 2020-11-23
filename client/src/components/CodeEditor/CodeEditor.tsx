import { FC } from 'react';
import { ErrorMessage } from 'formik';
import AceEditor, { IAceEditorProps } from 'react-ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-chrome';
import FormHelperText from '@material-ui/core/FormHelperText';

import { useCodeEditorStyles } from './CodeEditor.styles';

// нужно для работы проверки синтаксиса и чтобы ошибки в консоль не сыпались
import { config } from 'ace-builds';
config.set('basePath', 'https://cdn.jsdelivr.net/npm/ace-builds@1.4.12/src-noconflict/');

interface Props extends IAceEditorProps {
  // делаем поле из IAceEditorProps обязательным
  name: string;
  withError?: boolean;
}

export const CodeEditor: FC<Props> = ({ name, withError, ...rest }) => {
  const classes = useCodeEditorStyles();
  return (
    <>
      <AceEditor
        theme="chrome"
        width="100%"
        fontSize={14}
        showPrintMargin={false}
        wrapEnabled
        tabSize={2}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableLiveAutocompletion: true
        }}
        {...rest}
      />
      {withError ? (
        <ErrorMessage component={FormHelperText} name={name} className={classes.error} />
      ) : null}
    </>
  );
};
