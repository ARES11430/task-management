import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as generateUUID } from 'uuid';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { Task, TaskStatus } from './tasks.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasks(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        return (
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    return tasks;
  }

  getTaskById(id: string): Task | undefined {
    const found = this.tasks.find((task) => task.id === id);
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  deleteTask(id: string): void {
    // * check not found validation
    this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    task.status = status;
    return task;
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
