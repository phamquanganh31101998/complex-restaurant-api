import { ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export function classValidationExceptionFactory(
  errors: ValidationError[],
): BadRequestException {
  const mapErrors = errors.reduce(
    (prev, curr) => ({
      ...prev,
      [curr.property]: Object.values(curr.constraints || {}),
    }),
    {},
  );
  return new BadRequestException({
    code: 400001,
    message: 'Validation error',
    errors: mapErrors,
  });
}
