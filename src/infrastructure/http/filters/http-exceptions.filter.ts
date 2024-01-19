import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ExternalApiException } from '@infrastructure/exceptions/external-api.exception';
import { SpotifyBadAccessTokenException } from '@infrastructure/exceptions/bad-access-token.exception';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(HttpExceptionsFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status: number, message: string;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      status = exception.getStatus();
      message = exceptionResponse['message'] || exceptionResponse;
    } else if (exception instanceof ExternalApiException) {
      this.logger.error(exception.message, exception.stack);
      switch (exception.name) {
        case SpotifyBadAccessTokenException.name:
          status = HttpStatus.UNAUTHORIZED;
          message = 'Bad or expired access token.';
          break;
        default:
          status = HttpStatus.SERVICE_UNAVAILABLE;
          message = 'Service unavailable.';
      }
    } else {
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
