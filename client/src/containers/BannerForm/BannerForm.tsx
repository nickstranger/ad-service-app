import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { validateYupSchema, yupToFormErrors, FormikHelpers } from 'formik';
import sanitizeHtml from 'sanitize-html';

import { RootState } from 'store/store';
import { pageLoadingEnd, pageLoadingStart } from 'store/page/page.actions';
import { showErrorNotifier, showInfoNotifier } from 'store/notifier/notifier.actions';
import { axiosInstance } from 'common/axios-instance';
import { routes } from 'common/constants';
import { strings } from 'common/strings';
import { filterEmptyObjectValues } from 'common/utils';
import { bannerFormSchema, isJsonValid } from './BannerForm.schema';
import { BannerFormComponent } from './BannerForm.component';
import { Banner, BannerStatus } from 'entities/Banner';
import { BannerFormValues, BannerComponentVariant } from './BannerForm.types';
import { Loader } from 'components/Loader/Loader';

interface Props {
  variant: BannerComponentVariant;
}

const prepareData = (values: BannerFormValues): BannerFormValues => {
  if (values.layout) {
    values.layout = sanitizeHtml(values.layout, {
      allowedTags: false,
      allowedAttributes: false
    });
  }
  if (values.config) {
    values.config = JSON.parse(values.config);
  }
  return values;
};

const mapBannerToFormValues = (banner: Banner): BannerFormValues => {
  return {
    name: banner.name,
    placeholder: banner.placeholder,
    status: banner.status,
    layout: banner.layout,
    config: JSON.stringify(banner.config, null, 2)
  };
};

const initialValues: BannerFormValues = {
  name: '',
  placeholder: '',
  status: BannerStatus.ENABLED,
  layout: '',
  config: ''
};

export const BannerForm: FC<Props> = ({ variant }) => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const loading = useSelector((state: RootState) => state.page.loading);
  const authUser = useSelector((state: RootState) => state.auth);

  const [banner, setBanner] = useState(initialValues);
  const [isDeletingStarted, setIsDeletingStarted] = useState(false);

  // запрашиваем баннер только если форма в режиме редактирования баннера
  useEffect(() => {
    if (variant === BannerComponentVariant.UPDATE) {
      const fetchBanner = async () => {
        try {
          dispatch(pageLoadingStart());
          const response = await axiosInstance.get<Banner>(`/banners/${id}`);
          const { data } = response;
          setBanner(mapBannerToFormValues(data));
        } catch (error) {
          dispatch(showErrorNotifier(strings.error.getBanner, error));
        } finally {
          dispatch(pageLoadingEnd());
        }
      };

      fetchBanner();
    }
  }, [dispatch, id, variant]);

  const validateOnChange = async (values: BannerFormValues) => {
    try {
      // Проверка на тип/required
      await validateYupSchema(values, bannerFormSchema, false, {
        optional: variant === BannerComponentVariant.UPDATE
      });
    } catch (err) {
      return yupToFormErrors(err);
    }
    return {};
  };

  // Отдельно вынесена проверка при отправке формы
  const validateOnSubmit = (values: any, setFieldError: Function) => {
    // Проверка html на валидность
    if (values.layout.slice(0, 1) !== '<' || values.layout.slice(-1) !== '>') {
      dispatch(showErrorNotifier(strings.error.invalidBannerLayout));
      setFieldError('layout', strings.error.invalidBannerLayout);
      return false;
    }

    // Проверка json на валидность
    try {
      const bannerDataObj = JSON.parse(values.config);

      // Проверка на валидность конкретной конфигурации
      if (!isJsonValid(bannerDataObj)) {
        let allErrorsMsg = '';
        isJsonValid.errors.forEach((err) => {
          const errorMsg = `${err.field} ${err.message}`;
          dispatch(showErrorNotifier(`${strings.error.invalidBannerData}: ${errorMsg}`));
          allErrorsMsg += ` ${errorMsg}`;
        });
        setFieldError('config', `${strings.error.invalidBannerData}: ${allErrorsMsg}`);
        return false;
      }
      return true;
    } catch (err) {
      dispatch(showErrorNotifier(strings.error.invalidJson));
      setFieldError('config', strings.error.invalidJson);
      return false;
    }
  };

  const createBanner = async (
    values: BannerFormValues,
    setSubmitting: Function,
    setErrors: Function
  ) => {
    try {
      const preparedData = prepareData(values);
      await axiosInstance.post(`/banners`, preparedData);
      history.push(routes.banners.path);
      dispatch(showInfoNotifier(strings.info.createBanner));
    } catch (error) {
      setSubmitting(false);
      dispatch(showErrorNotifier(strings.error.createBanner, error));
      if (error.response?.data?.message) {
        setErrors(error.response.data.message);
      }
    }
  };

  const updateBanner = async (
    values: BannerFormValues,
    setSubmitting: Function,
    setErrors: Function
  ) => {
    try {
      const preparedData = prepareData({ ...values });
      const response = await axiosInstance.patch<Banner>(`/banners/${id}`, preparedData);
      const { data } = response;
      setSubmitting(false);
      setBanner(mapBannerToFormValues(data));
      dispatch(showInfoNotifier(strings.info.updateBanner));
    } catch (error) {
      setSubmitting(false);
      dispatch(showErrorNotifier(strings.error.updateBanner, error));
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
      await axiosInstance.delete(`/banners/${id}`);
      history.push(routes.banners.path);
      dispatch(showInfoNotifier(strings.info.deleteBanner));
    } catch (error) {
      dispatch(showErrorNotifier(strings.error.deleteBanner, error));
    }
  };

  const handleSubmit = (
    values: BannerFormValues,
    { setSubmitting, setErrors, setFieldError }: FormikHelpers<BannerFormValues>
  ) => {
    if (!validateOnSubmit(values, setFieldError)) {
      setSubmitting(false);
      return;
    }
    switch (variant) {
      case BannerComponentVariant.CREATE:
        createBanner(values, setSubmitting, setErrors);
        break;
      case BannerComponentVariant.UPDATE:
        // сперва обновляем стейт текущими значениями инпутов
        setBanner(values);
        const notEmptyValues: BannerFormValues = filterEmptyObjectValues(values);
        updateBanner(notEmptyValues, setSubmitting, setErrors);
        break;
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <BannerFormComponent
      variant={variant}
      initialValues={banner}
      authUser={authUser}
      validate={validateOnChange}
      handleSubmit={handleSubmit}
      isDeletingStarted={isDeletingStarted}
      handleStartDeleting={handleStartDeleting}
      handleConfirmDeleting={handleConfirmDeleting}
      handleCancelDeleting={handleCancelDeleting}
    />
  );
};
