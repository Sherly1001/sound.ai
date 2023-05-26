import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { BaseResult } from './dtos/base-result.dto';

@Catch(Error)
export class ResultWapper implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let err = null;
    if (exception instanceof HttpException) {
      err = exception;
    } else if (exception instanceof QueryFailedError) {
      err = new UnprocessableEntityException(
        exception.driverError.detail ?? exception.message,
      );
    } else {
      err = exception.toString();
    }

    new BaseResult(err).toResponse(res);
  }
}
