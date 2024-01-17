import { SpotifyAuthApiService } from '@infrastructure/services/spotify-auth-api.service';
import { Controller, Get } from '@nestjs/common';

@Controller('spotify-auth')
export class SpotifyAuthApiController {
  constructor(private readonly spotifyAuthApiService: SpotifyAuthApiService) {}

  @Get('/getAccessToken')
  async getAccessToken() {
    return await this.spotifyAuthApiService.getAccessToken();
  }
}
