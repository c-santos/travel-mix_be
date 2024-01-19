import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  readonly logger: Logger;
  constructor() {
    this.logger = new Logger(LoggerInterceptor.name);
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.log('Before...');
    const now = Date.now();

    return next
      .handle()
      .pipe(tap(() => this.logger.log(`After... ${Date.now() - now}ms`)));
  }
}
