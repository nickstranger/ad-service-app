import { useLocation } from 'react-router-dom';
import { Location } from 'history';

export const useLocationState = <T>() => {
  const { state }: Location<T> = useLocation();
  return state;
};
