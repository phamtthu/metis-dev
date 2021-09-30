import { PartialType } from '@nestjs/mapped-types';
import { AddTaskDTO } from './add-task.dto';

export class UpdateTaskDTO extends PartialType(AddTaskDTO) {}
