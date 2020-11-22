import React, { FC } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { useAuthStyles } from './Auth.styles';
import { authSchema } from './Auth.schema';
import { AuthFormValues } from './Auth.types';
import { BaseContainer } from 'components/BaseContainer/BaseContainer';
import { Input } from 'components/Input/Input';
import { routes } from 'common/constants';

interface Props {
  initialValues: AuthFormValues;
  handleSubmit: (values: AuthFormValues, formikHelpers: FormikHelpers<AuthFormValues>) => void;
}

export const AuthComponent: FC<Props> = ({ initialValues, handleSubmit }) => {
  const classes = useAuthStyles();

  return (
    <BaseContainer title={routes.login.name} maxWidth={350}>
      <Formik initialValues={initialValues} validationSchema={authSchema} onSubmit={handleSubmit}>
        {(formik) => (
          <Form>
            <Grid container spacing={2} className={classes.fieldset}>
              <Grid item xs={12}>
                <Input required label="Логин" name="username" autoComplete="username" autoFocus />
              </Grid>
              <Grid item xs={12}>
                <Input
                  required
                  type="password"
                  label="Пароль"
                  name="password"
                  autoComplete="current-password"
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              disabled={formik.isSubmitting}
              disableElevation
            >
              Войти
            </Button>
          </Form>
        )}
      </Formik>
    </BaseContainer>
  );
};
