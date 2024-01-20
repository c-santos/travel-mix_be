import { SpotifyAuthApiService } from '@infrastructure/services/spotify-auth-api.service';
import { Controller, Get, Req, Res, Post } from '@nestjs/common';

@Controller('spotify-auth')
export class SpotifyAuthApiController {
  constructor(private readonly spotifyAuthApiService: SpotifyAuthApiService) {}

  @Get('/getAccessToken')
  async getAccessToken() {
    return await this.spotifyAuthApiService.getAccessToken();
  }

  @Get('/login')
  async userLogin() {
    return await this.spotifyAuthApiService.userLogin();
  }

  @Post('/callback')
  async loginCallback(
    @Req() request,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(request);
    const accessToken =
      await this.spotifyAuthApiService._generateUserAccessToken(
        request.data.authCode,
      );

    response.cookie();
    return response.send();
  }
}
