import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(private userRepository: UsersRepository) {}

  async sinUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.repo.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.repo.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      return 'Signed in successfully';
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
