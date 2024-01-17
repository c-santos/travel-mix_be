import { Module } from '@nestjs/common';
import { AppController } from '@infrastructure/http/controllers/app.controller';
import { AppService } from '@application/services/app.service';
import { SpotifyApiModule } from './spotify-api.module';

@Module({
  imports: [SpotifyApiModule, SpotifyApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
