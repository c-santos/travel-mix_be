import { SpotifyApiService } from '@infrastructure/services/spotify-api.service';
import { Controller, Get, Body, Post, Param } from '@nestjs/common';

@Controller('spotify')
export class SpotifyApiController {
  constructor(private readonly spotifyApiService: SpotifyApiService) {}

  @Get('/jb')
  async getJB() {
    return await this.spotifyApiService.getJB();
  }

  @Get('/:artistId')
  async getArtist(@Param('artistId') artistId: string) {
    return await this.spotifyApiService.getArtist(artistId);
  }
}
