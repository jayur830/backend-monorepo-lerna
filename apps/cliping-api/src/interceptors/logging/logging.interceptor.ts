import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logger = new Logger(
      `${context.getClass().name} - ${context.getHandler().name}`,
    );
    const [, request] = context.getArgs();
    logger.log(`Request: ${JSON.stringify(request, null, 2)}`);
    return next
      .handle()
      .pipe(
        tap((response) =>
          logger.log(`Response: ${JSON.stringify(response, null, 2)}`),
        ),
      );
  }
}
