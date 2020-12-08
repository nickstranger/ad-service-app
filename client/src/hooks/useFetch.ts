import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AxiosRequestConfig } from 'axios';

import { axiosInstance } from 'common/axios-instance';
import { showErrorNotifier, showInfoNotifier } from 'store/notifier/notifier.actions';

interface Options {
  onSuccessMessage?: string;
  onFailMessage?: string;
  shouldExecute?: boolean;
}

export const useFetch = <T>(url: string, config: AxiosRequestConfig, options: Options = {}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);

  const { onSuccessMessage, onFailMessage, shouldExecute = true } = options;

  useEffect(
    () => {
      if (shouldExecute) {
        const fetchData = async () => {
          setIsLoading(true);
          try {
            const response = await axiosInstance.request<T>({ ...config, url });
            setData(response.data);
            if (onSuccessMessage) {
              dispatch(showInfoNotifier(onSuccessMessage));
            }
          } catch (error) {
            if (onFailMessage) {
              dispatch(showErrorNotifier(onFailMessage, error));
            }
          } finally {
            setIsLoading(false);
          }
        };

        fetchData();
      }
    },
    // просит быть зависимым от config, но мы можем быть уверены, что конфиг остается неизменным
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url, shouldExecute]
  );

  return { data, isLoading };
};
