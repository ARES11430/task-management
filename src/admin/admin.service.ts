import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '../auth/user-role.enum';
import { User } from '../auth/user.entity';
import { UsersRepository } from '../auth/users.repository';

@Injectable()
export class AdminService {
  constructor(private usersRepository: UsersRepository) {}

  async getUsers(): Promise<User[]> {
    return this.usersRepository.repo.find();
  }

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    const user = await this.usersRepository.repo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    user.role = role;
    await this.usersRepository.repo.save(user);
    return user;
  }
}
