import * as Yup from 'yup';

import { userFormSchema } from './UserForm.schema';

export type UserFormValues = Yup.InferType<typeof userFormSchema>;

export enum UserComponentVariant {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE'
}
