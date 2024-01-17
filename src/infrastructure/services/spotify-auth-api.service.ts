import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/application/services/base-service';

@Injectable()
export class SpotifyAuthApiService extends BaseService {
  constructor(private readonly httpService: HttpService) {
    super(SpotifyAuthApiService.name);
  }

  async _getAccessToken() {}
}
