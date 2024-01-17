import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SpotifyApiController } from '../http/controllers/spotify-api.controller';
import { SpotifyApiService } from '../services/spotify-api.service';

@Module({
  imports: [HttpModule],
  controllers: [SpotifyApiController],
  providers: [SpotifyApiService],
})
export class SpotifyApiModule {}
