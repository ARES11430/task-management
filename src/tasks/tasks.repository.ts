import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TaskRepository {
  public readonly repo: Repository<Task> & {
    findDone(): Promise<Task[]>;
    findById(id: string): Promise<Task | null>;
  };

  constructor(private dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(Task).extend({
      findDone() {
        return this.find({ where: { status: TaskStatus.DONE } });
      },
      findById(id: string) {
        return this.findOneBy({ id });
      },
    });
  }
}
