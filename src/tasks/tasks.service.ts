import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v1 as uuid} from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { getTasksFilterDto } from './dto/get-task-filter.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
    constructor (
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {}
    // private tasks: Task[] = [];
    
    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    // createTask(createTaskDto: CreateTaskDto): Task {
    //     const { title, description} = createTaskDto;
    //     const task: Task = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN
    //     };
        
    //     this.tasks.push(task);
    //     return task;
    // }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);
        if(!found) throw new NotFoundException(`Task with ID: ${id} not found.`);
        return found; 
    }

    // deleteTask(id: string): void {
    //     const found = this.getTaskById(id);
    //     this.tasks = this.tasks.filter(task => task.id !== found.id)
    // }

    // updateTask(id: string, status: TaskStatus): Task {
    //     let index = this.tasks.map(task => task.id).indexOf(id);

    //     if(index === -1) throw new NotFoundException(`Task with ID: ${id} not found.`)
        
    //     this.tasks[index].status = status;
    //     return this.tasks[index];
    // }

    // getTaskWithFilters(filterDto: getTasksFilterDto): Task[] {
    //     const { status, search } = filterDto;
    //     let tasks = this.getAllTasks();

    //     if(status) tasks = tasks.filter(task => task.status === status);
    //     if(search) tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search));

    //     return tasks;
    // }
}
