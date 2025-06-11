/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { TaskStatus } from "./task-status.enum";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { GetTasksFilterDTO } from "./dto/get-tasks-filter.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { Repository } from "typeorm";
import { User } from "src/auth/user.entity";


@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getTasks(filterDto: GetTasksFilterDTO,user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.tasksRepository.createQueryBuilder("task");
    query.where("task.userId = :userId", { userId: user.id });


    if (status) {
      query.andWhere("task.status = :status", { status });
    }

    if (search) {
      query.andWhere(
        "(task.title ILIKE :search OR task.description ILIKE :search)",
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDTO: CreateTaskDTO,user: User): Promise<Task> {
    const { title, description } = createTaskDTO;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    });
    await this.tasksRepository.save(task);
    return task;
  }

  async getTaskById(id: string,user: User): Promise<Task> {
     
    console.log(user.username)
    
    const task = await this.tasksRepository.findOne({ where: { id,user: {id: user.id}} ,  relations: ['user'],});

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    if(task.user.id !== user.id) {
       throw new UnauthorizedException('Invalid user or token');
    }

    return task;
  }

  async deleteTaskById(id: string,user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user: { id: user.id } });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus,user: User): Promise<Task> {
    const task = await this.getTaskById(id,user);

    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
