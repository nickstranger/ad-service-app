import * as Yup from 'yup';
import jsonValidator from 'is-my-json-valid';

import { strings } from 'common/strings';
import { BannerStatus } from 'entities/Banner';

export const isJsonValid = jsonValidator(
  {
    required: true,
    type: 'object',
    properties: {
      type: {
        required: true,
        type: 'string'
      },
      slotId: {
        required: true,
        type: 'string'
      }
    }
  },
  {
    verbose: true
  }
);

export const bannerFormSchema = Yup.object({
  name: Yup.string().when('$optional', {
    is: true,
    then: Yup.string(),
    otherwise: Yup.string().required(strings.error.required)
  }),
  placeholder: Yup.string().when('$optional', {
    is: true,
    then: Yup.string(),
    otherwise: Yup.string().required(strings.error.required)
  }),
  status: Yup.mixed().oneOf(Object.values(BannerStatus)),
  layout: Yup.string().when('$optional', {
    is: true,
    then: Yup.string(),
    otherwise: Yup.string().required(strings.error.required)
  }),
  config: Yup.string().when('$optional', {
    is: true,
    then: Yup.string(),
    otherwise: Yup.string().required(strings.error.required)
  })
}).defined();
