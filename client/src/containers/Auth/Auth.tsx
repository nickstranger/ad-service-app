import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Location } from 'history';
import { FormikHelpers } from 'formik';

import { auth } from 'store/auth/auth.actions';
import { AuthComponent } from './Auth.component';
import { AuthFormValues } from './Auth.types';

const initialValues: AuthFormValues = {
  username: '',
  password: ''
};

export const Auth = () => {
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
    { setSubmitting, setErrors }: FormikHelpers<AuthFormValues>
  ) => {
    dispatch(auth(values.username, values.password, setSubmitting, setErrors, backToPrevRoute));
  };

  return <AuthComponent initialValues={initialValues} handleSubmit={handleSubmit} />;
};
