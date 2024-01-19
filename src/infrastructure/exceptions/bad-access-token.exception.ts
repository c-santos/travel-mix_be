import { HttpException, HttpStatus } from '@nestjs/common';
import { ExternalApiException } from './external-api.exception';

export class SpotifyBadAccessTokenException extends ExternalApiException {
  constructor() {
    super('Bad or expired access token.');
  }
}
