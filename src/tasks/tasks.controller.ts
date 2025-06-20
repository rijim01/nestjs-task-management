/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { GetTasksFilterDTO } from "./dto/get-tasks-filter.dto";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";
import { Task } from "./task.entity";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/auth/user.entity";

@Controller("tasks")
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDTO,@GetUser() user: User
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto,user)
  }

  
  @Post()
  async createTask(@Body() createTaskDTO: CreateTaskDTO,@GetUser() user: User): Promise<Task> {
    return this.tasksService.createTask(createTaskDTO,user);
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string,@GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id,user);
  }

  @Delete('/:id')
  async deleteTaskById(@Param('id') id: string,@GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTaskById(id,user)
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User
    ): Promise<Task> {
      const {status} = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status,user);
  }
}
