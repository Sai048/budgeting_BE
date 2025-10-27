import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Transaction } from '../../../../data-models/budget-model/src/lib/budget.entity';
import { User } from '../../../../data-models/auth-model/src/lib/auth.entity';
import { BudgetDTO, UpdateBudgetDTO } from './dto/budget.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async createTransaction(budgetDTO: BudgetDTO): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: budgetDTO.userId },
    });
    if (!user) throw new NotFoundException('User not found');
    const lastTransaction = await this.transactionRepo.findOne({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
    });

    let balance = 0;
    if (lastTransaction) {
      if (budgetDTO.amountType === 'Credit') {
        balance =
          Number(lastTransaction.balance) + Number(budgetDTO.actualAmount);
      } else {
        balance =
          Number(lastTransaction.balance) - Number(budgetDTO.actualAmount);
      }
    } else {
      balance =
        budgetDTO.amountType === 'Credit'
          ? Number(budgetDTO.actualAmount)
          : -Number(budgetDTO.actualAmount);
    }
    const transaction = this.transactionRepo.create({
      userId: budgetDTO.userId,
      amountType: budgetDTO.amountType as 'Credit' | 'Debit',
      categoryType: budgetDTO.categoryType,
      actualAmount: budgetDTO.actualAmount,
      balance,
    });

    const save = this.transactionRepo.save(transaction);

    return {
      status: HttpStatus.CREATED,
      message: 'Transaction created successfully',
      data: save,
    };
  }

  async getAllTransactions(): Promise<any> {
    return this.transactionRepo.find({ relations: ['user'] });
  }

  async getTransactionsByUser(
    userId: number,
    page: number = 1,
    limit: number = 10,
    filters?: {
      amountType?: string;
      categoryType?: string;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const query = this.transactionRepo
      .createQueryBuilder('t')
      .where('t.userId = :userId', { userId })
      .leftJoinAndSelect('t.user', 'user');

    if (filters?.amountType) {
      query.andWhere('t.amountType = :amountType', {
        amountType: filters.amountType,
      });
    }
    if (filters?.categoryType) {
      query.andWhere('t.categoryType = :categoryType', {
        categoryType: filters.categoryType,
      });
    }
    if (filters?.fromDate) {
      query.andWhere('t.createdAt >= :fromDate', {
        fromDate: filters.fromDate,
      });
    }

    if (filters?.toDate) {
      query.andWhere('t.createdAt <= :toDate', { toDate: filters.toDate });
    }

    query.orderBy('t.createdAt', 'DESC');
    if (page && limit) {
      query.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await query.getManyAndCount();

    const sanitizedData = data.map((transaction) => {
      if (transaction.user) {
        const { password, ...userWithoutPassword } = transaction.user;
        return {
          ...transaction,
          user: userWithoutPassword,
        };
      }
      return transaction;
    });

    return {
      status: HttpStatus.OK,
      data: sanitizedData,
      total,
      page,
      limit,
    };
  }

  async getTransactionById(id: number): Promise<any> {
    const transaction = await this.transactionRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!transaction) throw new NotFoundException('Transaction not found');
    return {
      status: HttpStatus.OK,
      transaction,
    };
  }

  async updateTransaction(
    id: number,
    updateData: UpdateBudgetDTO
  ): Promise<any> {
    const updatedTransaction = await this.transactionRepo.findOne({
      where: { id },
    });
    if (!updatedTransaction)
      throw new NotFoundException('Transaction not found');

    await this.transactionRepo.update(id, updateData);

    const allTransactions = await this.transactionRepo.find({
      where: { userId: updatedTransaction.userId },
      order: { id: 'ASC' },
    });

    let runningBalance = 0;
    const updatedList: Transaction[] = [];

    for (const t of allTransactions) {
      const amount = Number(t.actualAmount);
      runningBalance += t.amountType === 'Credit' ? amount : -amount;

      if (Number(t.balance) !== runningBalance) {
        t.balance = parseFloat(runningBalance.toFixed(2));
        updatedList.push(t);
      }
    }

    if (updatedList.length > 0) {
      await this.transactionRepo.save(updatedList);
    }

    return {
      status: HttpStatus.OK,
      message: 'Transaction updated successfully and balances recalculated.',
      data: await this.transactionRepo.findOne({ where: { id } }),
    };
  }

  async deleteTransaction(id: number): Promise<any> {
    const queryRunner =
      this.transactionRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await queryRunner.manager.findOne(
        this.transactionRepo.target,
        { where: { id } }
      );
      if (!transaction) throw new NotFoundException('Transaction not found');

      const { userId } = transaction;

      await queryRunner.manager.delete(this.transactionRepo.target, id);

      const remainingTransactions = await queryRunner.manager.find(
        this.transactionRepo.target,
        {
          where: { userId },
          order: { id: 'ASC' },
        }
      );

      let runningBalance = 0;

      for (const t of remainingTransactions) {
        const amount = Number(t.actualAmount);
        if (isNaN(amount)) t.actualAmount = 0;

        runningBalance += t.amountType === 'Credit' ? amount : -amount;
        t.balance = parseFloat(runningBalance.toFixed(2));
      }

      if (remainingTransactions.length > 0) {
        await queryRunner.manager.save(
          this.transactionRepo.target,
          remainingTransactions
        );
      }

      await queryRunner.commitTransaction();

      return {
        status: HttpStatus.OK,
        message: 'Transaction deleted successfully and all balances updated.',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
