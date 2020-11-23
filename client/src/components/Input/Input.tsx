import { FC } from 'react';
import { Field, FieldAttributes } from 'formik';
import { TextField, TextFieldProps } from 'formik-material-ui';

type InputProps = Partial<FieldAttributes<TextFieldProps>>;

export const Input: FC<InputProps> = (props) => {
  return <Field component={TextField} fullWidth {...props} />;
};
