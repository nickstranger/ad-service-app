import React, { FC } from 'react';
import { Form, Formik, FormikErrors, FormikHelpers } from 'formik';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SaveIcon from '@material-ui/icons/Save';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import { useUserStyles } from './UserForm.styles';
import { UserFormValues, UserComponentVariant } from './UserForm.types';
import { strings } from 'common/strings';
import { routes } from 'common/constants';
import { UserRole, UserStatus } from 'entities/User';
import { AuthState } from 'store/auth/auth.types';
import { BaseContainer } from 'components/BaseContainer/BaseContainer';
import { Input } from 'components/Input/Input';
import { ConfirmationDialog } from 'components/ConfirmationDialog/ConfirmationDialog';
import { Status } from 'components/Status/Status';
import { Role } from 'components/Role/Role';

interface Props {
  variant: UserComponentVariant;
  userId: string;
  initialValues: UserFormValues;
  authUser: AuthState;
  validate: (values: UserFormValues) => Promise<FormikErrors<unknown> | {}>;
  handleSubmit: (values: UserFormValues, formikHelpers: FormikHelpers<UserFormValues>) => void;
  isDeletingStarted: boolean;
  handleStartDeleting: () => void;
  handleConfirmDeleting: () => Promise<void>;
  handleCancelDeleting: () => void;
}

export const UserFormComponent: FC<Props> = ({
  variant,
  userId,
  initialValues,
  authUser,
  validate,
  handleSubmit,
  isDeletingStarted,
  handleStartDeleting,
  handleConfirmDeleting,
  handleCancelDeleting
}) => {
  const classes = useUserStyles();

  const isAdmin = authUser.authUserRole === UserRole.ADMIN;
  const formEnabled =
    isAdmin || (authUser.authUserRole === UserRole.USER && userId === authUser.authUserId);

  const isCreateFormVariant = variant === UserComponentVariant.CREATE;
  const isUpdateFormVariant = variant === UserComponentVariant.UPDATE;

  const formTitle = isCreateFormVariant ? routes.createUser.name : routes.user.name;
  const submitBtnTitle = isCreateFormVariant ? 'Создать' : 'Сохранить';
  const submitBtnIcon = isCreateFormVariant ? <PersonAddIcon /> : <SaveIcon />;

  const deleteUserBtn =
    isAdmin && isUpdateFormVariant ? (
      <Button
        type="button"
        color="secondary"
        startIcon={<DeleteForeverIcon />}
        onClick={handleStartDeleting}
      >
        Удалить
      </Button>
    ) : null;

  const userRoleOptions = Object.values(UserRole).map((role) => (
    <MenuItem value={role} key={role}>
      <Role role={role} />
    </MenuItem>
  ));

  const userStatusOptions = Object.values(UserStatus).map((status) => (
    <MenuItem value={status} key={status}>
      <Status status={status === UserStatus.ENABLED ? 'on' : 'off'} />
    </MenuItem>
  ));

  return (
    <BaseContainer title={formTitle} minWidth={400} maxWidth={600}>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form>
            <Grid container spacing={3} className={classes.fieldset}>
              <Grid item xs={6}>
                <Input
                  value={formik.values.username}
                  label="Логин"
                  name="username"
                  disabled={formik.isSubmitting || !isAdmin}
                  required={isCreateFormVariant}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  select
                  value={formik.values.status}
                  label="Статус"
                  name="status"
                  disabled={formik.isSubmitting || !isAdmin}
                  required={isCreateFormVariant}
                >
                  {userStatusOptions}
                </Input>
              </Grid>
              <Grid item xs={6}>
                <Input
                  value={formik.values.email}
                  label="Email"
                  name="email"
                  disabled={formik.isSubmitting || !formEnabled}
                  required={isCreateFormVariant}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  select
                  value={formik.values.role}
                  label="Роль"
                  name="role"
                  disabled={formik.isSubmitting || !isAdmin}
                  required={isCreateFormVariant}
                >
                  {userRoleOptions}
                </Input>
              </Grid>
              {formEnabled ? (
                <>
                  <Grid item xs={6}>
                    <Input
                      value={formik.values.password}
                      label="Пароль"
                      name="password"
                      type="password"
                      helperText={strings.text.password}
                      disabled={formik.isSubmitting}
                      autoComplete="new-password"
                      required={isCreateFormVariant}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Input
                      value={formik.values.repeat_password}
                      label="Повторите пароль"
                      name="repeat_password"
                      type="password"
                      disabled={formik.isSubmitting}
                      autoComplete="new-password"
                      required={isCreateFormVariant}
                    />
                  </Grid>
                </>
              ) : null}
            </Grid>
            {formEnabled ? (
              <div className={classes.actions}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  startIcon={submitBtnIcon}
                  disabled={formik.isSubmitting}
                  disableElevation
                >
                  {submitBtnTitle}
                </Button>
                {deleteUserBtn}
              </div>
            ) : null}
          </Form>
        )}
      </Formik>
      <ConfirmationDialog
        title="Удаление пользователя"
        content="Вы точно хотите удалить пользователя?"
        handleConfirm={handleConfirmDeleting}
        handleCancel={handleCancelDeleting}
        open={isDeletingStarted}
      />
    </BaseContainer>
  );
};
