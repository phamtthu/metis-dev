import { PartialType } from '@nestjs/mapped-types';
import { AddSkillDTO } from './add-skill.dto';

export class UpdateSkillDTO extends PartialType(AddSkillDTO) {}
