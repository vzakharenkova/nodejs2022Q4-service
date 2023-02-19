import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'null-or-string', async: false })
export class IsNullOrString implements ValidatorConstraintInterface {
  validate(text: any) {
    return text === null || typeof text === 'string';
  }

  defaultMessage(args: ValidationArguments) {
    return `'${args.property} must be null (if it is unknown) or string'`;
  }
}
