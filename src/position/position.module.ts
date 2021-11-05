import { Module } from '@nestjs/common';
import { PositionController } from './position.controller';
import { PositionDatabaseModule } from 'src/model/position/position-database.module';
import { PositionService } from './position.service';
import { UserDatabaseModule } from 'src/model/user/user-database.module';
import { PositionExistValidator } from './custom-validator/position-exist-validator';

@Module({
  imports: [PositionDatabaseModule, UserDatabaseModule],
  controllers: [PositionController],
  providers: [PositionService, PositionExistValidator],
  exports: [PositionService],
})
export class PositionModule {}
