import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './tasks.model';

@Injectable()
export class TaskRepository {
  public readonly repo: Repository<Task> & {
    findDone(): Promise<Task[]>;
  };

  constructor(private dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(Task).extend({
      findDone() {
        return this.find({ where: { status: TaskStatus.DONE } });
      },
    });
  }
}
