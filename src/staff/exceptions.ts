import { CommonException } from 'shared/exception';

export class StaffException extends CommonException {}

export class StaffNotFoundException extends StaffException {
  constructor(message = 'Cannot find staff with this id', code = 404001) {
    super(message, code);
  }
}
