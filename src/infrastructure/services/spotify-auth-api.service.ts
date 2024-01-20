import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { BaseService } from '@application/services/base-service';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { configService } from '@infrastructure/config/config.service';
import { generate } from 'rxjs';

@Injectable()
export class SpotifyAuthApiService extends BaseService {
  private accessToken: string;
  private codeVerifier: string;
  private userAccessToken: string;

  constructor(private readonly httpService: HttpService) {
    super(SpotifyAuthApiService.name);
  }

  async _generateAccessToken() {
    const url = configService.getValue('SPOTIFY_API_TOKEN_URL');
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
      this.logger.log('Access token generated.');
      this.accessToken = response.data.access_token;
    } catch (error) {
      if (error.status) {
        this.logger.error('_getAccessToken error: ' + error);
      } else {
        throw error;
      }
    }
  }

  async getAccessToken() {
    if (this.accessToken === undefined) {
      await this._generateAccessToken();
      return this.accessToken;
    } else {
      return this.accessToken;
    }
  }

  async getUserAccessToken() {
    return this.userAccessToken;
  }

  async setUserAccessToken(token) {
    this.userAccessToken = token;
  }

  async _generateRandomString(length: number) {
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], '');
  }

  async _sha256(plain: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return await crypto.subtle.digest('SHA-256', data);
  }

  async _base64encode(input) {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  async _generateCodeChallenge(): Promise<string> {
    this.codeVerifier = await this._generateRandomString(64);
    const hashed = await this._sha256(this.codeVerifier);
    return await this._base64encode(hashed);
  }

  async userLogin(): Promise<URL> {
    const codeChallenge = await this._generateCodeChallenge();

    const client_id = configService.getValue('SPOTIFY_API_CLIENT_ID');
    const redirectUri = configService.getValue('SPOTIFY_AUTH_REDIRECT_URI');

    const scope = 'user-read-private user-read-email';
    const authUrl = new URL(configService.getValue('SPOTIFY_API_AUTH_URL'));

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirectUri,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    });

    authUrl.search = new URLSearchParams(params).toString();

    return authUrl;
  }

  async _generateUserAccessToken(auth_code) {
    const url = configService.getValue('SPOTIFY_API_TOKEN_URL');
    const data = {
      grant_type: 'authorization_code',
      code: auth_code,
      redirect_uri: configService.getValue('SPOTIFY_AUTH_REDIRECT_URI'),
      client_id: configService.getValue('SPOTIFY_API_CLIENT_ID'),
      code_verifier: this.codeVerifier,
    };
    const options: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    try {
      const response: AxiosResponse<any> = await this.httpService.axiosRef.post(
        url,
        data,
        options,
      );
      this.logger.log(response.data);
      this.setUserAccessToken(response.data.access_token);
      return this.getUserAccessToken();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
