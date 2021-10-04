import { Module } from '@nestjs/common';
import { ProductWorkCenterDatabaseModule } from 'src/model/product-workcenter/product-workcenter-database.module';
import { ResourceDatabaseModule } from 'src/model/resource/resource-database.module';
import { ResourceUserDatabaseModule } from 'src/model/resource-user/resource-user-database.module';
import { SequenceUserDatabaseModule } from 'src/model/sequence-user/sequence-user-database.module';
import { TaskDatabaseModule } from 'src/model/task/task-database.module';
import { TaskUserDatabaseModule } from 'src/model/task-user/taskuser-database.module';
import { UserDatabaseModule } from 'src/model/user/user-database.module';
import { WorkCenterUserDatabaseModule } from 'src/model/workcenter-user/workcenter-user-database.module';
import { UserIDsExistenceValidator } from './custom-validator/user-ids.validator';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    UserDatabaseModule,
    ResourceUserDatabaseModule,
    ResourceDatabaseModule,
    WorkCenterUserDatabaseModule,
    SequenceUserDatabaseModule,
    ProductWorkCenterDatabaseModule,
    TaskDatabaseModule,
    TaskUserDatabaseModule,
    ProductWorkCenterDatabaseModule,
  ],
  providers: [UserService, UserIDsExistenceValidator],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
