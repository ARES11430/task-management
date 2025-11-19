// Import necessary NestJS testing utilities and modules
import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';

/**
 * Mock factory for the TaskRepository.
 * This function returns an object with a `repo` property,
 * which contains jest mock functions for the repository methods.
 * This structure mimics the actual TaskRepository implementation.
 */
const mockTaskRepository = () => ({
  repo: {
    findOne: jest.fn(),
    createTask: jest.fn(),
    getTasks: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
  },
});

// A mock user object to be used in tests.
const mockUser: User = {
  id: 'someUserId',
  username: 'TestUser',
  password: 'somePassword',
  tasks: [],
};

// A mock task object for consistent testing.
const mockTask = {
  id: 'someId',
  title: 'Test Task',
  description: 'Test Desc',
  status: TaskStatus.OPEN,
  user: mockUser,
};

// A mock for the create task DTO.
const mockCreateTaskDto: CreateTaskDto = {
  title: 'Test Task',
  description: 'Test Desc',
};

// Main describe block for the TasksService unit tests.
describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository;

  // `beforeEach` block to set up the testing module before each test.
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        // Provide the mock factory for the TaskRepository.
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  // Test suite for the `getTaskById` method.
  describe('getTaskById', () => {
    it('should call TaskRepository.repo.findOne and return the task', async () => {
      // Mock the `findOne` method to resolve with the mock task.
      taskRepository.repo.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById('someId', mockUser);
      // Expect the result to be the mock task.
      expect(result).toEqual(mockTask);
      // Expect `findOne` to have been called with the correct parameters.
      expect(taskRepository.repo.findOne).toHaveBeenCalledWith({
        where: { id: 'someId', user: mockUser },
      });
    });

    it('should throw a NotFoundException if the task is not found', async () => {
      // Mock the `findOne` method to resolve with null.
      taskRepository.repo.findOne.mockResolvedValue(null);
      // Expect the service method to throw a NotFoundException.
      await expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // Test suite for the `createTask` method.
  describe('createTask', () => {
    it('should call TaskRepository.repo.createTask and return the result', async () => {
      // Mock the `createTask` method to resolve with the mock task.
      taskRepository.repo.createTask.mockResolvedValue(mockTask);

      const result = await tasksService.createTask(mockCreateTaskDto, mockUser);
      // Expect the result to be the mock task.
      expect(result).toEqual(mockTask);
      // Expect `createTask` to have been called with the correct parameters.
      expect(taskRepository.repo.createTask).toHaveBeenCalledWith(
        mockCreateTaskDto,
        mockUser,
      );
    });
  });

  // Test suite for the `getTasks` method.
  describe('getTasks', () => {
    it('should call TaskRepository.repo.getTasks and return the result', async () => {
      const mockFilterDto: GetTasksFilterDto = {
        status: TaskStatus.OPEN,
        search: 'test',
      };
      const mockTasks = [mockTask];
      // Mock the `getTasks` method to resolve with the mock tasks.
      taskRepository.repo.getTasks.mockResolvedValue(mockTasks);

      const result = await tasksService.getTasks(mockFilterDto, mockUser);
      // Expect the result to be the mock tasks.
      expect(result).toEqual(mockTasks);
      // Expect `getTasks` to have been called with the correct parameters.
      expect(taskRepository.repo.getTasks).toHaveBeenCalledWith(
        mockFilterDto,
        mockUser,
      );
    });
  });

  // Test suite for the `deleteTask` method.
  describe('deleteTask', () => {
    it('should call TaskRepository.repo.delete and resolve on successful deletion', async () => {
      // Mock the `delete` method to resolve with an object indicating one affected row.
      taskRepository.repo.delete.mockResolvedValue({ affected: 1 });
      // Expect the service method to resolve without a value (void).
      await expect(
        tasksService.deleteTask('someId', mockUser),
      ).resolves.toBeUndefined();
      // Expect `delete` to have been called with the correct parameters.
      expect(taskRepository.repo.delete).toHaveBeenCalledWith({
        id: 'someId',
        user: mockUser,
      });
    });

    it('should throw a NotFoundException if the task to delete is not found', async () => {
      // Mock the `delete` method to resolve with an object indicating zero affected rows.
      taskRepository.repo.delete.mockResolvedValue({ affected: 0 });
      // Expect the service method to throw a NotFoundException.
      await expect(tasksService.deleteTask('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // Test suite for the `updateTaskStatus` method.
  describe('updateTaskStatus', () => {
    it('should update a task status', async () => {
      // A new mock task object with a `save` method for this specific test.
      const save = jest.fn();
      const task = { ...mockTask, save };

      // Mock `findOne` to return our task.
      taskRepository.repo.findOne.mockResolvedValue(task);
      // Mock `save` to resolve, completing the save operation.
      taskRepository.repo.save.mockResolvedValue(task);

      // Call the service method to update the status.
      const result = await tasksService.updateTaskStatus(
        'someId',
        TaskStatus.DONE,
        mockUser,
      );

      // Expect the `findOne` method to have been called to fetch the task.
      expect(taskRepository.repo.findOne).toHaveBeenCalled();
      // Expect the `save` method to have been called to persist the change.
      expect(taskRepository.repo.save).toHaveBeenCalledWith(task);
      // Expect the status of the returned task to be updated.
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});
