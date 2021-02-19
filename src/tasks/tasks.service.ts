import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { getTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
    constructor (
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {}

    async getTasks(filterDto: getTasksFilterDto): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto);
    }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);
        if(!found) throw new NotFoundException(`Task with ID: ${id} not found.`);
        return found; 
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }

    
    async removeTask(id: number): Promise<Task> {
        const task = await this.getTaskById(id)

        // uses remove method to delete task, accepts Task entity as argument
        return await this.taskRepository.remove(task);
    }

    async deleteTask(id: number): Promise<void> {
        // uses delete method to delete task, accepts task id as argument
        const result = await this.taskRepository.delete(id);

        if(result.affected === 0) throw new NotFoundException(`Task with ID: ${id} not found.`);
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }
}
