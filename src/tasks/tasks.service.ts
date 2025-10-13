import { Injectable } from '@nestjs/common';
import { v4 as generateUUID } from 'uuid';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { Task, TaskStatus } from './tasks.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  createTask(createTaskDTO: CreateTaskDTO): Task {
    const { title, description } = createTaskDTO;

    const task: Task = {
      id: generateUUID(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }
}
