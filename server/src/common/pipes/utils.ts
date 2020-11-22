import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';

export const badRequestExceptionFactory = (errors: ValidationError[]): any => {
  const response = {
    error: 'Bad Request',
    statusCode: HttpStatus.BAD_REQUEST,
    message: {}
  };
  errors.forEach((error) => {
    response.message[error.property] = Object.values(error.constraints)[0];
  });
  return new HttpException(response, HttpStatus.BAD_REQUEST);
};
