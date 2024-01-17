import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { BaseService } from '@application/services/base-service';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { configService } from '@infrastructure/config/config.service';

@Injectable()
export class SpotifyAuthApiService extends BaseService {
  private accessToken: string;

  constructor(private readonly httpService: HttpService) {
    super(SpotifyAuthApiService.name);
  }

  async _generateAccessToken() {
    const url = configService.getValue('SPOTIFY_API_TOKEN_BASE_URL');
    const client_secret = configService.getValue('SPOTIFY_API_CLIENT_SECRET');
    const client_id = configService.getValue('SPOTIFY_API_CLIENT_ID');
    const credentials = Buffer.from(client_id + ':' + client_secret).toString(
      'base64',
    );
    const data = {
      grant_type: 'client_credentials',
    };
    const options: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
    };
    try {
      const response: AxiosResponse<any> = await this.httpService.axiosRef.post(
        url,
        data,
        options,
      );
      this.logger.log('Generated an access token.');
      this.accessToken = response.data.access_token;
    } catch (error) {
      this.logger.log('_getAccessToken error');
      if (error.code) {
        switch (error.code) {
          case 'ECONNREFUSED':
            throw new Error(
              'Could not connect to the API service. Please contact Support. (Connection refused)',
            );
          case 'ETIMEOUT':
            throw new Error(
              'Could not connect to the API service. Please contact Support. (Connection timeout)',
            );
          default:
            throw new Error(
              'Could not connect to the API service. Please contact support. (Unknown error)',
            );
        }
      } else {
        throw error;
      }
    }
  }

  async getAccessToken() {
    // TODO: Add way to check if token is still alive. (Middleware?)
    if (this.accessToken === undefined) {
      await this._generateAccessToken();
      return this.accessToken;
    } else {
      return this.accessToken;
    }
  }
}
