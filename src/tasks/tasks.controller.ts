import { Body, Controller, Get, Post } from '@nestjs/common';
import type { Task } from './tasks.model';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dtos/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }

  @Post()
  createTask(@Body() createTaskDTO: CreateTaskDTO): Task {
    return this.tasksService.createTask(createTaskDTO);
  }
}
