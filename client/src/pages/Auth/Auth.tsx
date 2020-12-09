import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Location } from 'history';
import { Form, Formik, FormikHelpers } from 'formik';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { routes } from 'common/constants';
import { auth } from 'store/auth/auth.actions';
import { BaseContainer } from 'components/BaseContainer/BaseContainer';
import { Input } from 'components/Input/Input';
import { useAuthStyles } from './Auth.styles';
import { AuthFormValues } from './Auth.types';
import { authSchema } from './Auth.schema';

const initialValues: AuthFormValues = {
  username: '',
  password: ''
};

export const Auth = () => {
  const classes = useAuthStyles();

  const dispatch = useDispatch();
  const history = useHistory();
  const location: Location<{ from: string }> = useLocation();

  // возвращается на предыдущий роут после успешной авторизации
  const { from } = location.state || { from: { pathname: '/' } };
  const backToPrevRoute = () => {
    history.replace(from);
  };

  const handleSubmit = (
    values: AuthFormValues,
    { setSubmitting }: FormikHelpers<AuthFormValues>
  ) => {
    dispatch(auth(values.username, values.password, setSubmitting, backToPrevRoute));
  };

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
