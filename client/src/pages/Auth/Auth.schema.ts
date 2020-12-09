import * as Yup from 'yup';

import { strings } from 'common/strings';
import { password_regexp } from 'common/constants';

export const authSchema = Yup.object({
  username: Yup.string().required(strings.error.required),
  password: Yup.string()
    .matches(password_regexp, strings.error.password)
    .required(strings.error.required)
}).defined();
