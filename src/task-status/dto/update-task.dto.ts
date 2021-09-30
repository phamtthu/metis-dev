import { PartialType } from "@nestjs/mapped-types"
import { AddTaskStatusDTO } from "./add-task.dto";

export class UpdateTaskStatusDTO extends PartialType(AddTaskStatusDTO) {}