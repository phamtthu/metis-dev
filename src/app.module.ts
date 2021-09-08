import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';
import { LaborModule } from './labor/labor.module';
import { ResourceModule } from './resource/resource.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    ScheduleModule.forRoot(),
    ConfigModule, DatabaseModule.forRoot(), 
    UserModule, 
    AuthModule, 
    UploadModule, 
    LaborModule,
    ResourceModule
  ],
  controllers: [AppController],
  providers: [AppService, CronService],
})
export class AppModule { }
