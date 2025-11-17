import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TaskRepository {
  public readonly repo: Repository<Task> & {
    findDone(): Promise<Task[]>;
    findById(id: string): Promise<Task | null>;
    createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task>;
    getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]>;
  };

  constructor(private dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(Task).extend({
      findDone() {
        return this.find({ where: { status: TaskStatus.DONE } });
      },
      findById(id: string) {
        return this.findOneBy({ id });
      },
      async createTask(createTaskDTO: CreateTaskDTO, user: User) {
        const { title, description } = createTaskDTO;

        const task = this.create({
          title,
          description,
          status: TaskStatus.OPEN,
          user,
        });

        await this.save(task);
        return task;
      },
      async getTasks(
        filterDto: GetTasksFilterDto,
        user: User,
      ): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        query.where({ user });

        if (status) {
          query.andWhere('task.status = :status', { status });
        }

        if (search) {
          query.andWhere(
            '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
            { search: `%${search}%` },
          );
        }

        const tasks = await query.getMany();
        return tasks;
      },
    });
  }
}
