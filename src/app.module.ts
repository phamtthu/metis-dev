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
import { ResourceModule } from './resource/resource.module';
import { SkillModule } from './skill/skill.module';
import { ResourceCategoryModule } from './resource-category/resource-category.module';
import { WorkCenterModule } from './workcenter/workcenter.module';
import { TaskModule } from './task/task.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { CustomerModule } from './customer/customer.module';
import { LabelModule } from './label/label.module';
import { ProcessModule } from './process/process.module';
import { SequenceModule } from './sequence/sequence.module';
import { PartModule } from './part/part.module';
import { PartCategoryModule } from './part-category/part-category.module';
import { TaskStatusModule } from './task-status/task-status.module';
import { ProductWorkCenterModule } from './product-workcenter/product-workcenter.module';
import { BoardModule } from './board/board.module';
import { CommentModule } from './comment/comment.module';
import { TaskChecklistModule } from './task-checklist/task-checklist.module';
import { TaskGroupModule } from './task-group/task-group.module';
import { AttachmentModule } from './attachment/attachment.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    ScheduleModule.forRoot(),
    ConfigModule,
    DatabaseModule.forRoot(),
    UserModule,
    AuthModule,
    UploadModule,
    ResourceModule,
    ResourceCategoryModule,
    ProductCategoryModule,
    SkillModule,
    WorkCenterModule,
    TaskModule,
    OrderModule,
    ProductModule,
    CustomerModule,
    LabelModule,
    ProcessModule,
    SequenceModule,
    PartModule,
    PartCategoryModule,
    TaskStatusModule,
    TaskGroupModule,
    LabelModule,
    ProductWorkCenterModule,

    BoardModule,
    AttachmentModule,
    CommentModule,
    TaskChecklistModule,
  ],
  controllers: [AppController],
  providers: [AppService, CronService],
})
export class AppModule {}
