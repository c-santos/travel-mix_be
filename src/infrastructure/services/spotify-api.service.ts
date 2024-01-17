import { BaseService } from '@application/services/base-service';
import { configService } from '@infrastructure/config/config.service';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { SpotifyAuthApiService } from './spotify-auth-api.service';
import { config } from 'process';

@Injectable()
export class SpotifyApiService extends BaseService {
  private JBSpotifyID = '1uNFoZAHBGtllmzznpCI3s?si=aCAQzw7CRTSL9yvKLSre7g';

  constructor(
    private readonly httpService: HttpService,
    private readonly authService: SpotifyAuthApiService,
  ) {
    super(SpotifyApiService.name);
  }

  async getArtist(artistId: string) {
    const baseUrl = configService.getValue('SPOTIFY_API_BASE_URL');
    const url = `${baseUrl}/artists/${artistId}`;

    const accessToken = await this.authService.getAccessToken();

    const options: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await this.httpService.axiosRef.post(
        url,
        undefined,
        options,
      );

      return response.data;
    } catch (error) {
      this.logger.error('getArtist error' + error);
      if (error.code) {
        switch (error.code) {
          case '401':
            throw new Error('Access token expired.');
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

  async getJB() {
    return await this.getArtist(this.JBSpotifyID);
  }
}
