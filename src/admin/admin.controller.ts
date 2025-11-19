import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../auth/user-role.enum';
import { User } from '../auth/user.entity';
import { AdminService } from './admin.service';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Controller('admin')
@UseGuards(AuthGuard(), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('/users')
  getUsers(): Promise<User[]> {
    return this.adminService.getUsers();
  }

  @Patch('/users/:id/role')
  updateUserRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<User> {
    const { role } = updateRoleDto;
    return this.adminService.updateUserRole(id, role);
  }
}
