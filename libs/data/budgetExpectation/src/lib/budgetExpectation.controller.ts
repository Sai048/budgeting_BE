import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BudgetExpectationService } from './budgetExpectation.service';
import {
  ExpectationBudgetDTO,
  UpdateExpectationBudgetDTOBudgetDTO,
} from './dto/budgetExpectation.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'libs/data/auth/src/lib/auth.guard';

@ApiTags('budgetExpectation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('budget-expectation')
export class BudgetExpectationController {
  constructor(private readonly budgetService: BudgetExpectationService) {}

  @Post()
  async createBudget(
    @Body() expectationBudgetDTO: ExpectationBudgetDTO
  ): Promise<any> {
    return this.budgetService.createBudget(expectationBudgetDTO);
  }

  @Get()
  async getAllBudgets(): Promise<any[]> {
    return this.budgetService.getAllBudgets();
  }

  @Get('user/:userId')
  @ApiQuery({ name: 'amountType', type: String, required: false })
  @ApiQuery({ name: 'name', type: String, required: false })
  @ApiQuery({ name: 'fromDate', type: String, required: false })
  @ApiQuery({ name: 'toDate', type: String, required: false })
  async getAllBudgetsByUserId(
    @Param('userId') userId: number,
    @Query('amountType') amountType?: string,
    @Query('name') name?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string
  ): Promise<any> {
    const filters: any = {};

    if (amountType) filters.amountType = amountType;
    if (name) filters.name = name;
    if (fromDate || toDate) {
      if (fromDate) filters.fromDate = new Date(fromDate);
      if (toDate) filters.toDate = new Date(toDate);
    }

    return this.budgetService.getAllBudgetsByUserId(userId, filters);
  }

  @Get(':id')
  async getBudget(@Param('id') id: number): Promise<any> {
    return this.budgetService.getBudgetById(id);
  }

  @Put(':id')
  async updateBudget(
    @Param('id') id: number,
    @Body()
    updateExpectationBudgetDTOBudgetDTO: UpdateExpectationBudgetDTOBudgetDTO
  ): Promise<any> {
    return this.budgetService.updateBudget(
      id,
      updateExpectationBudgetDTOBudgetDTO
    );
  }

  @Delete(':id')
  async deleteBudget(@Param('id') id: number): Promise<{ message: string }> {
    return this.budgetService.deleteBudget(id);
  }
}
