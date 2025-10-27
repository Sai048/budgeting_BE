import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TransactionService } from './budget.service';
import { Transaction } from '../../../../data-models/budget-model/src/lib/budget.entity';
import { User } from '../../../../data-models/auth-model/src/lib/auth.entity';
import { ApiBearerAuth, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BudgetDTO, UpdateBudgetDTO } from './dto/budget.dto';
import { JwtAuthGuard } from '../../../../data/auth/src/lib/auth.guard';

@ApiTags('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(@Body() budgetDTO: BudgetDTO): Promise<Transaction> {
    return this.transactionService.createTransaction(budgetDTO);
  }

  @Get()
  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionService.getAllTransactions();
  }

  @Get('user/:userId')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'amountType', type: String, required: false })
  @ApiQuery({ name: 'categoryType', type: String, required: false })
  @ApiQuery({ name: 'fromDate', type: String, required: false })
  @ApiQuery({ name: 'toDate', type: String, required: false })
  async getTransactionsByUser(
    @Param('userId') userId: number,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('amountType') amountType?: string,
    @Query('categoryType') categoryType?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string
  ) {
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const filters: any = {};

    if (amountType) filters.amountType = amountType;
    if (categoryType) filters.categoryType = categoryType;
    if (fromDate || toDate) {
      if (fromDate) filters.fromDate = new Date(fromDate);
      if (toDate) filters.toDate = new Date(toDate);
    }

    return this.transactionService.getTransactionsByUser(
      userId,
      pageNumber,
      limitNumber,
      filters
    );
  }

  @Get(':id')
  async getTransactionById(@Param('id') id: number): Promise<Transaction> {
    return this.transactionService.getTransactionById(id);
  }

  @Put(':id')
  async updateTransaction(
    @Param('id') id: number,
    @Body() updateData: UpdateBudgetDTO
  ): Promise<Transaction> {
    return this.transactionService.updateTransaction(id, updateData);
  }

  @Delete(':id')
  async deleteTransaction(@Param('id') id: number) {
    return this.transactionService.deleteTransaction(id);
  }
}
