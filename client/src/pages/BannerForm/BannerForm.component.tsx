import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Form, Formik, FormikErrors, FormikHelpers } from 'formik';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import AddBoxIcon from '@material-ui/icons/AddBox';
import SaveIcon from '@material-ui/icons/Save';

import { useBannerFormStyles } from './BannerForm.styles';
import { BannerFormValues, BannerComponentVariant } from './BannerForm.types';
import { BannerStatus } from 'entities/Banner';
import { UserRole } from 'entities/User';
import { BaseContainer } from 'components/BaseContainer/BaseContainer';
import { Input } from 'components/Input/Input';
import { ConfirmationDialog } from 'components/ConfirmationDialog/ConfirmationDialog';
import { CodeEditor } from 'components/CodeEditor/CodeEditor';
import { Status } from 'components/Status/Status';
import { Dropdown } from 'components/Dropdown/Dropdown';
import { AuthState } from 'store/auth/auth.types';
import { routes } from 'common/constants';

interface Props {
  authUser: AuthState;
  initialValues: BannerFormValues;
  validate: (values: BannerFormValues) => Promise<FormikErrors<unknown> | {}>;
  variant: BannerComponentVariant;
  handleSubmit: (values: BannerFormValues, formikHelpers: FormikHelpers<BannerFormValues>) => void;
  isDeletingStarted: boolean;
  handleStartDeleting: () => void;
  handleConfirmDeleting: () => Promise<void>;
  handleCancelDeleting: () => void;
}

export const BannerFormComponent: FC<Props> = ({
  authUser,
  initialValues,
  validate,
  variant,
  handleSubmit,
  isDeletingStarted,
  handleStartDeleting,
  handleConfirmDeleting,
  handleCancelDeleting
}) => {
  const classes = useBannerFormStyles();

  const formEnabled = authUser.role === UserRole.ADMIN || authUser.role === UserRole.USER;

  const isCreateFormVariant = variant === BannerComponentVariant.CREATE;
  const isUpdateFormVariant = variant === BannerComponentVariant.UPDATE;

  const formTitle = isCreateFormVariant ? routes.createBanner.name : routes.banner.name;
  const submitBtnTitle = isCreateFormVariant ? 'Создать' : 'Сохранить';
  const submitBtnIcon = isCreateFormVariant ? <AddBoxIcon /> : <SaveIcon />;

  const createBannerBtn = formEnabled ? (
    <Button
      variant="contained"
      type="submit"
      color="primary"
      startIcon={submitBtnIcon}
      disableElevation
    >
      {submitBtnTitle}
    </Button>
  ) : null;

  const dropdown =
    formEnabled && isUpdateFormVariant ? (
      <Dropdown>
        <MenuItem
          component={Link}
          to={{
            pathname: routes.createBanner.path,
            state: initialValues
          }}
        >
          Копировать баннер
        </MenuItem>
        <MenuItem onClick={handleStartDeleting}>Удалить</MenuItem>
      </Dropdown>
    ) : null;

  const bannerStatusOptions = Object.values(BannerStatus).map((status) => (
    <MenuItem value={status} key={status}>
      <Status status={status === BannerStatus.ENABLED ? 'on' : 'off'} />
    </MenuItem>
  ));

  return (
    <BaseContainer title={formTitle} minWidth={400} maxWidth={1060}>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, isSubmitting, setValues }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Input
                  label="Имя баннера"
                  name="name"
                  disabled={isSubmitting || !formEnabled}
                  required={isCreateFormVariant}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  label="Плейсхолдер"
                  name="placeholder"
                  disabled={isSubmitting || !formEnabled}
                  required={isCreateFormVariant}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  select
                  value={values.status}
                  label="Статус"
                  name="status"
                  disabled={isSubmitting || !formEnabled}
                  required={isCreateFormVariant}
                >
                  {bannerStatusOptions}
                </Input>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">
                  Разметка
                </Typography>
                <CodeEditor
                  name="layout"
                  mode="html"
                  minLines={3}
                  maxLines={20}
                  value={values.layout}
                  onChange={(value) => setValues({ ...values, layout: value })}
                  readOnly={isSubmitting || !formEnabled}
                  withError
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">
                  Конфигурация баннера (в формате JSON)
                </Typography>
                <CodeEditor
                  name="config"
                  mode="json"
                  minLines={3}
                  maxLines={30}
                  value={values.config}
                  onChange={(value) => setValues({ ...values, config: value })}
                  readOnly={isSubmitting || !formEnabled}
                  withError
                />
              </Grid>
              <Grid item xs={12} className={classes.actions}>
                {createBannerBtn}
                {dropdown}
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
      <ConfirmationDialog
        title="Удаление баннера"
        content="Вы точно хотите удалить баннер?"
        handleConfirm={handleConfirmDeleting}
        handleCancel={handleCancelDeleting}
        open={isDeletingStarted}
      />
    </BaseContainer>
  );
};
