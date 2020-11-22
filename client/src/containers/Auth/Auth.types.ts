import * as Yup from 'yup';

import { authSchema } from './Auth.schema';

export type AuthFormValues = Yup.InferType<typeof authSchema>;
