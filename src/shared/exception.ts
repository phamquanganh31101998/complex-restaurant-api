import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

export class CommonException extends Error {
  private readonly code: number;
  constructor(message = '', code?: number) {
    super(message);
    this.code = code;
  }

  getObjectError(): { code: number; message: string } {
    return { code: this.code, message: this.message };
  }
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const res = context.getResponse<Response>();

    if (exception instanceof CommonException) {
      const error = exception.getObjectError();
      const httpCode = parseInt(error.code.toString().slice(0, 3));
      res.status(httpCode).json(error);
      res.end();

      return;
    }

    // unhandled exception
    this.logger.error(exception);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ code: 500000, message: 'Internal server error (Unhandled)' });
    res.end();
  }
}
