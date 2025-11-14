import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class UsersRepository {
  public readonly repo: Repository<User> & {
    createUser(authCredentials: AuthCredentialsDto): Promise<void>;
  };

  constructor(private dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(User).extend({
      async createUser(authCredentials: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentials;
        const user = this.create({ username, password });
        await this.save(user);
      },
    });
  }
}
