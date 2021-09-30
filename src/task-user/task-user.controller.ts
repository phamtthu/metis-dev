// import {
//     Body,
//     Delete,
//     HttpStatus,
//     Post,
//     Put,
//     Query,
//     Request,
//     Response,
//     UsePipes,
//     ValidationPipe
// } from '@nestjs/common'
// import { Controller, Get, Param } from '@nestjs/common'
// import { throwCntrllrErr } from 'src/common/utils/error'
// import { Request as ERequest } from 'express'
// import { Response as EResponse } from 'express'
// import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto'
// import { TaskUserID } from 'src/shared/pipe/taskStatusId.pipe'
// import { TaskUserService } from './task-status.service'
// import { AddTaskUserDTO } from './dto/add-rcategory.dto'
// import { UpdateTaskUserDTO } from './dto/update-rcategory.dto'

// @Controller('api/task-user')
// @UsePipes(new ValidationPipe({
//     skipMissingProperties: true,
//     forbidNonWhitelisted: true,
//     whitelist: true
// }))
// export class TaskUserController {

//     constructor(
//         private taskStatusService: TaskUserService
//     ) { }

//     @Post()
//     async create(
//         @Request() req: ERequest,
//         @Response() res: EResponse,
//         @Body() taskStatusDTO: AddTaskUserDTO
//     ) {
//         try {
//             const result = await this.taskStatusService.create(taskStatusDTO)
//             return res.status(HttpStatus.CREATED).json({
//                 message: 'Create TaskUser successfully',
//                 data: result
//             })
//         } catch (error) { throwCntrllrErr(error) }
//     }

//     @Get()
//     async getList(
//         @Request() req: ERequest,
//         @Response() res: EResponse,
//         @Query('search') search: string,
//         @Query('offset') offset: number,
//         @Query('limit') limit: number
//     ) {
//         try {
//             const result = await this.taskStatusService.getList({ offset, limit }, search?.trim())
//             return res.status(HttpStatus.OK).json({
//                 data: result
//             })
//         } catch (error) { throwCntrllrErr(error) }
//     }

//     // @Get('task/:taskStatusId')
//     // async getTasksWithGivenTaskUser(
//     //     @Request() req: ERequest,
//     //     @Response() res: EResponse,
//     //     @Param('taskStatusId', TaskUserID) taskStatusId: string,
//     //     @Query() paginateQuery: PaginationQueryDto
//     // ) {
//     //     try {
//     //         const result = await this.taskStatusService.getTasksWithGivenTaskUser(
//     //             taskStatusId, paginateQuery)
//     //         return res.status(HttpStatus.OK).json({
//     //             data: result
//     //         })
//     //     } catch (error) { throwCntrllrErr(error) }
//     // }

//     @Get('/:taskStatusId')
//     async getDetail(
//         @Request() req: ERequest,
//         @Response() res: EResponse,
//         @Param('taskStatusId', TaskUserID) taskStatusId: string
//     ) {
//         try {
//             const result = await this.taskStatusService.getDetail(taskStatusId)
//             return res.status(HttpStatus.OK).json({
//                 data: result
//             })
//         } catch (error) { throwCntrllrErr(error) }
//     }

//     @Delete('/:taskStatusId')
//     async delete(
//         @Request() req: ERequest,
//         @Response() res: EResponse,
//         @Param('taskStatusId', TaskUserID) taskStatusId: string
//     ) {
//         try {
//             await this.taskStatusService.delete(taskStatusId)
//             return res.status(HttpStatus.OK).json({
//                 message: 'Delete Task Status successfully'
//             })
//         } catch (error) { throwCntrllrErr(error) }
//     }

//     @Put('/:taskStatusId')
//     async update(
//         @Request() req: ERequest,
//         @Response() res: EResponse,
//         @Body() taskStatusDTO: UpdateTaskUserDTO,
//         @Param('taskStatusId', TaskUserID) taskStatusId: string
//     ) {
//         try {
//             const result = await this.taskStatusService.update(
//                 taskStatusId, taskStatusDTO)
//             return res.status(HttpStatus.OK).json({
//                 message: 'Update Task Status successfully',
//                 data: result
//             })
//         } catch (error) { throwCntrllrErr(error) }
//     }

// }
