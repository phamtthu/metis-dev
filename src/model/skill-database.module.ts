import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SkillSchema } from './skill.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Skill', schema: SkillSchema }]),
  ],
  exports: [MongooseModule],
})
export class SkillDatabaseModule {}
