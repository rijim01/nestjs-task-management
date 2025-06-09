/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { TaskStatus } from "./task-status.enum";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { GetTasksFilterDTO } from "./dto/get-tasks-filter.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { Repository } from "typeorm";

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>
  ) {}
  //  getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // getTasksWithFilters(filterDto: GetTasksFilterDTO): Task[] {
  //   const {status,search} = filterDto;
  //   let tasks = this.getAllTasks();
  //   if(status)  {
  //     tasks = tasks.filter((task) => task.status === status)
  //   }
  //   if(search) {
  //     tasks = tasks.filter((task) => {
  //       if(task.title.includes(search) || task.description.includes(search)) {
  //         return true
  //       }
  //       return false;
  //     });
  //   }
  //   return tasks;
  // }
 
      async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
        const {title,description} = createTaskDTO;

        const task = this.tasksRepository.create({
          title,
          description,
          status: TaskStatus.OPEN
        })
        await this.tasksRepository.save(task);
        return task;
      }
  // getTaskById(id: string): Task {
  //   const found = this.tasks.find((task) => task.id === id);
  //   if (!found) {
  //     // throw new Error(`Task with ID "${id}" not found`);
  //      throw new NotFoundException(`Task with ID "${id}" not found`)
  //   }
  //   return found;
  // }

      async getTaskById(id: string): Promise<Task> {
        const task = await this.tasksRepository.findOne({ where: { id } });

        if(!task) {
          throw new NotFoundException(`Task with ID ${id} not found`)
        }
        return task;
      }
  // deleteTaskById(id: string): void {
  //  this.tasks = this.tasks.filter(task => task.id !== id);
  // }
  // updateTaskStatus(id: string,status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}
