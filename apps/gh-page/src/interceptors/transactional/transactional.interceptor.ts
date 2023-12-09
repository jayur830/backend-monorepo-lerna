import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { DataSource } from 'typeorm';

import { IS_TRANSACTIONAL } from '@/decorators/transactional/transactional.decorator';

@Injectable()
export class TransactionalInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const isTransactional = this.reflector.get<string>(IS_TRANSACTIONAL, context.getHandler());

    if (!isTransactional) {
      return next.handle();
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    return next.handle().pipe(
      catchError(async (error) => {
        this.logger.error(error);
        await queryRunner.rollbackTransaction();
        return throwError(() => error);
      }),
      finalize(() => {
        queryRunner.release();
      }),
    );
  }
}
