import * as Yup from 'yup';

import { bannerFormSchema } from './BannerForm.schema';

export type BannerFormValues = Yup.InferType<typeof bannerFormSchema>;

export enum BannerComponentVariant {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE'
}
