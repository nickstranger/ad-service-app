import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { validateYupSchema, yupToFormErrors, FormikHelpers } from 'formik';

import { User, UserRole, UserStatus } from 'entities/User';
import { RootState } from 'store/store';
import { pageLoadingStart, pageLoadingEnd } from 'store/page/page.actions';
import { showErrorNotifier, showInfoNotifier } from 'store/notifier/notifier.actions';
import { routes } from 'common/constants';
import { axiosInstance } from 'common/axios-instance';
import { strings } from 'common/strings';
import { filterEmptyObjectValues } from 'common/utils';
import { userFormSchema } from './UserForm.schema';
import { UserFormValues, UserComponentVariant } from './UserForm.types';
import { UserFormComponent } from './UserForm.component';
import { Loader } from 'components/Loader/Loader';

const mapUserToFormValues = (user: User): UserFormValues => {
  return {
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
    password: '',
    repeat_password: ''
  };
};

const initialValues: UserFormValues = {
  username: '',
  email: '',
  role: UserRole.USER,
  status: UserStatus.ENABLED,
  password: '',
  repeat_password: ''
};

interface Props {
  variant: UserComponentVariant;
}

export const UserForm: FC<Props> = ({ variant }) => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const loading = useSelector((state: RootState) => state.page.loading);
  const authUser = useSelector((state: RootState) => state.auth);

  const [user, setUser] = useState(initialValues);
  const [isDeletingStarted, setIsDeletingStarted] = useState(false);

  // запрашиваем юзера только если форма в режиме редактирования юзера
  useEffect(() => {
    if (variant === UserComponentVariant.UPDATE) {
      const fetchUser = async () => {
        try {
          dispatch(pageLoadingStart());
          const response = await axiosInstance.get<User>(`/users/${id}`);
          const { data } = response;
          setUser(mapUserToFormValues(data));
        } catch (error) {
          dispatch(showErrorNotifier(strings.error.getUser, error));
        } finally {
          dispatch(pageLoadingEnd());
        }
      };

      fetchUser();
    }
  }, [dispatch, id, variant]);

  const validate = async (values: UserFormValues) => {
    try {
      await validateYupSchema(values, userFormSchema, false, {
        optional: variant === UserComponentVariant.UPDATE
      });
    } catch (err) {
      return yupToFormErrors(err);
    }
    return {};
  };

  const createUser = async (
    values: UserFormValues,
    setSubmitting: Function,
    setErrors: Function
  ) => {
    try {
      await axiosInstance.post(`/users/create`, values);
      history.push(routes.users.path);
      dispatch(showInfoNotifier(strings.info.createUser));
    } catch (error) {
      setSubmitting(false);
      dispatch(showErrorNotifier(strings.error.createUser, error));
      if (error.response?.data?.message) {
        setErrors(error.response.data.message);
      }
    }
  };

  const updateUser = async (
    values: UserFormValues,
    setSubmitting: Function,
    setErrors: Function
  ) => {
    try {
      const response = await axiosInstance.patch<User>(`/users/${id}`, values);
      const { data } = response;
      setSubmitting(false);
      setUser(mapUserToFormValues(data));
      dispatch(showInfoNotifier(strings.info.updateUser));
    } catch (error) {
      setSubmitting(false);
      dispatch(showErrorNotifier(strings.error.updateUser, error));
      if (error.response?.data?.message) {
        setErrors(error.response.data.message);
      }
    }
  };

  const handleStartDeleting = () => {
    setIsDeletingStarted(true);
  };

  const handleCancelDeleting = () => {
    setIsDeletingStarted(false);
  };

  const handleConfirmDeleting = async () => {
    try {
      await axiosInstance.delete(`/users/${id}`);
      history.push(routes.users.path);
      dispatch(showInfoNotifier(strings.info.deleteUser));
    } catch (error) {
      dispatch(showErrorNotifier(strings.error.deleteUser, error));
    }
  };

  const handleSubmit = (
    values: UserFormValues,
    { setSubmitting, setErrors }: FormikHelpers<UserFormValues>
  ) => {
    switch (variant) {
      case UserComponentVariant.CREATE:
        createUser(values, setSubmitting, setErrors);
        break;
      case UserComponentVariant.UPDATE:
        // сперва обновляем стейт текущими значениями инпутов
        setUser(values);
        const notEmptyValues: UserFormValues = filterEmptyObjectValues(values);
        updateUser(notEmptyValues, setSubmitting, setErrors);
        break;
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <UserFormComponent
      variant={variant}
      userId={id}
      initialValues={user}
      authUser={authUser}
      validate={validate}
      handleSubmit={handleSubmit}
      isDeletingStarted={isDeletingStarted}
      handleStartDeleting={handleStartDeleting}
      handleConfirmDeleting={handleConfirmDeleting}
      handleCancelDeleting={handleCancelDeleting}
    />
  );
};
