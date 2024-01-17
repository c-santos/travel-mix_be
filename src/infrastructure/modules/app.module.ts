import { Module } from '@nestjs/common';
import { AppController } from '@infrastructure/http/controllers/app.controller';
import { AppService } from '@application/services/app.service';
import { SpotifyApiModule } from './spotify-api.module';
import { SpotifyAuthApiModule } from './spotify-auth-api.module';

@Module({
  imports: [SpotifyAuthApiModule, SpotifyApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
