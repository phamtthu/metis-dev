import { Module } from '@nestjs/common';
import { ResourceDatabaseModule } from 'src/model/resource-database.module';
import { ResourceUserDatabaseModule } from 'src/model/resource-user-database.module';
import { UserDatabaseModule } from 'src/model/user-database.module';
import { WorkCenterUserDatabaseModule } from 'src/model/workcenter-user-database.module';
import { SharedModule } from 'src/shared/shared.module';
import { UserIDsExistenceValidator } from './custom-validator/userIds.validator';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    UserDatabaseModule,
    ResourceUserDatabaseModule,
    ResourceDatabaseModule,
    WorkCenterUserDatabaseModule,
    SharedModule,
  ],
  providers: [UserService, UserIDsExistenceValidator],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
