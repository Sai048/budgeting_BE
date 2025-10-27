import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetExpectation } from 'libs/data-models/budgettExpectation-model/src/lib/budgettExpectation.entity';
import {
  ExpectationBudgetDTO,
  UpdateExpectationBudgetDTOBudgetDTO,
} from './dto/budgetExpectation.dto';
import { HttpStatusCode } from 'axios';
import { User } from 'libs/data-models/auth-model/src/lib/auth.entity';

@Injectable()
export class BudgetExpectationService {
  constructor(
    @InjectRepository(BudgetExpectation)
    private readonly budgetRepo: Repository<BudgetExpectation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async createBudget(expectationBudgetDTO: ExpectationBudgetDTO): Promise<any> {
    const existingBudget = await this.budgetRepo.findOne({
      where: { name: expectationBudgetDTO.name },
    });

    if (existingBudget) {
      return {
        status: 400,
        message: 'Budget with this name already exists',
      };
    }
    const newBudget = this.budgetRepo.create(expectationBudgetDTO);
    const data = this.budgetRepo.save(newBudget);

    return {
      status: HttpStatus.OK,
      message: 'Budget Create Succcessfully',
      data,
    };
  }

  async getAllBudgets(): Promise<any> {
    const data = this.budgetRepo.find({ order: { createdAt: 'DESC' } });
    return {
      status: HttpStatus.OK,
      message: 'Budget Retrived Succcessfully',
      data,
    };
  }

  async getAllBudgetsByUserId(
    userId: number,
    filters?: {
      amountType?: string;
      name?: string;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const query = this.budgetRepo
      .createQueryBuilder('budget')
      .where('budget.userId = :userId', { userId });

    if (filters?.amountType) {
      query.andWhere('budget.amountType = :amountType', {
        amountType: filters.amountType,
      });
    }
    if (filters?.name) {
      query.andWhere('budget.name = :name', {
        name: filters.name,
      });
    }
    if (filters?.fromDate) {
      query.andWhere('budget.createdAt >= :fromDate', {
        fromDate: filters.fromDate,
      });
    }

    if (filters?.toDate) {
      query.andWhere('budget.createdAt <= :toDate', { toDate: filters.toDate });
    }

    query.orderBy('budget.createdAt', 'DESC');

    const [data, total] = await query.getManyAndCount();

    return {
      status: HttpStatus.OK,
      message: 'Budget Retrived Succcessfully',
      data,
      total,
    };
  }

  async getBudgetById(id: number): Promise<any> {
    const budget = await this.budgetRepo.findOne({ where: { id } });
    if (!budget) throw new NotFoundException('Budget not found');
    return {
      status: HttpStatus.OK,
      message: 'Budget Retrived Succcessfully',
      data: budget,
    };
  }

  async updateBudget(
    id: number,
    updateExpectationBudgetDTOBudgetDTO: UpdateExpectationBudgetDTOBudgetDTO
  ): Promise<any> {
    const budget = await this.getBudgetById(id);
    if (!budget) {
      return {
        status: 404,
        message: 'Budget not found',
      };
    }
    const updatedBudget = this.budgetRepo.update(
      id,
      updateExpectationBudgetDTOBudgetDTO
    );
    return {
      status: 200,
      message: 'Budget updated successfully',
      data: updatedBudget,
    };
  }

  async deleteBudget(id: number): Promise<any> {
    const budget = await this.budgetRepo.delete(id);
    if (!budget) {
      return {
        status: 404,
        message: 'Budget not found',
      };
    }
    return {
      status: HttpStatus.OK,
      message: 'Budget deleted successfully',
    };
  }
}
