import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SpotifyApiController } from '../http/controllers/spotify-api.controller';
import { SpotifyApiService } from '../services/spotify-api.service';
import { SpotifyAuthApiModule } from './spotify-auth-api.module';
import { SpotifyAuthApiService } from '@infrastructure/services/spotify-auth-api.service';

@Module({
  imports: [HttpModule, SpotifyAuthApiModule],
  controllers: [SpotifyApiController],
  providers: [SpotifyApiService, SpotifyAuthApiService],
})
export class SpotifyApiModule {}
