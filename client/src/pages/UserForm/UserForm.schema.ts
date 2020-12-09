import * as Yup from 'yup';

import { strings } from 'common/strings';
import { password_regexp } from 'common/constants';
import { UserRole, UserStatus } from 'entities/User';

export const userFormSchema = Yup.object({
  username: Yup.string().when('$optional', {
    is: true,
    then: Yup.string(),
    otherwise: Yup.string().required(strings.error.required)
  }),
  password: Yup.string().when('$optional', {
    is: true,
    then: Yup.string().matches(password_regexp, strings.error.password),
    otherwise: Yup.string()
      .matches(password_regexp, strings.error.password)
      .required(strings.error.required)
  }),
  repeat_password: Yup.string().when('$optional', {
    is: true,
    then: Yup.string().oneOf([Yup.ref('password')], strings.error.repeatPassword),
    otherwise: Yup.string()
      .oneOf([Yup.ref('password')], strings.error.repeatPassword)
      .required(strings.error.required)
  }),
  email: Yup.string().when('$optional', {
    is: true,
    then: Yup.string().email(strings.error.email),
    otherwise: Yup.string().email(strings.error.email).required(strings.error.required)
  }),
  role: Yup.mixed().oneOf(Object.values(UserRole)),
  status: Yup.mixed().oneOf(Object.values(UserStatus))
}).defined();
