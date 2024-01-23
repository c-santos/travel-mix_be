import { SpotifyAuthApiService } from '@infrastructure/services/spotify-auth-api.service';
import { Controller, Get, Req, Res, Post, Param } from '@nestjs/common';

@Controller('spotify-auth')
export class SpotifyAuthApiController {
  constructor(private readonly spotifyAuthApiService: SpotifyAuthApiService) {}

  @Get('/getAccessToken')
  async getAccessToken() {
    return await this.spotifyAuthApiService.getAccessToken();
  }

  @Get('/login')
  async login() {
    return await this.spotifyAuthApiService.login();
  }

  @Get('/callback')
  async loginCallback(@Req() request) {
    let authCode = request.query.auth_code;

    let response =
      await this.spotifyAuthApiService._generateUserAccessToken(authCode);

    return response;
  }
}
