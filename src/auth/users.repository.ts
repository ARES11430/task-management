import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRole } from './user-role.enum';
import { User } from './user.entity';

@Injectable()
export class UsersRepository {
  public readonly repo: Repository<User> & {
    createUser(authCredentials: AuthCredentialsDto): Promise<void>;
  };

  constructor(private dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(User).extend({
      async createUser(authCredentials: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentials;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.create({
          username,
          password: hashedPassword,
          role: UserRole.USER,
        });
        try {
          await this.save(user);
        } catch (error) {
          if (error.code === '23505') {
            throw new ConflictException('Username already exists');
          } else {
            throw new InternalServerErrorException();
          }
        }
      },
    });
  }
}
