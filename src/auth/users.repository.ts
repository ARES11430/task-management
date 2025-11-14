import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  public readonly repo: Repository<User> & {};

  constructor(private dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(User).extend({});
  }
}
