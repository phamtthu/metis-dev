import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../user/user.module';
import { ProductWorkCenterDatabaseModule } from 'src/model/product-workcenter/product-workcenter-database.module';
import { ProductWorkCenterModule } from 'src/product-workcenter/product-workcenter.module';
import { TaskModule } from 'src/task/task.module';
import { TaskChecklistModule } from 'src/task-checklist/task-checklist.module';
import { TaskGroupModule } from 'src/task-group/task-group.module';
import { LabelModule } from 'src/label/label.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Global()
@Module({
  imports: [
    UserModule,
    PassportModule,
    // create JWT
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.TIME_EXPIRE },
    }),
    ProductWorkCenterModule,
    TaskModule,
    TaskChecklistModule,
    TaskGroupModule,
    LabelModule
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
