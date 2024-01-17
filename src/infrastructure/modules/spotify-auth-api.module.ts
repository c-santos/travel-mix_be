import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SpotifyAuthApiService } from '../services/spotify-auth-api.service';
import { SpotifyAuthApiController } from '../http/controllers/spotify-auth-api.controller';

@Module({
  imports: [HttpModule],
  controllers: [SpotifyAuthApiController],
  providers: [SpotifyAuthApiService],
})
export class SpotifyAuthApiModule {}
