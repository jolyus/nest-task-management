import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = { username: 'Test user', id: 12 };

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
});

describe('TasksService', () => {
    let tasksService;
    let taskRepository;


    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository }
            ],
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('someValue');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filters: getTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Some search query' }
            const result = await tasksService.getTasks(filters, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue');
        });
    });

    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and successfuly returns the task', async () => {
            taskRepository.findOne.mockResolvedValue({title: 'test title', description: 'test description'});
        
            const result = await tasksService.getTaskById(1, mockUser);
            expect(result).toEqual({title: 'test title', description: 'test description'});

            expect(taskRepository.findOne).toHaveBeenCalledWith({ 
                where: { 
                    id: 1, 
                    userId: mockUser.id
                }
            });
        });

        it('throws an error when the task is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });
});