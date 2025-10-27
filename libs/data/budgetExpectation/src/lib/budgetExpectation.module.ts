import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetExpectation } from 'libs/data-models/budgettExpectation-model/src/lib/budgettExpectation.entity';
import { AuthModule } from '../../../../data/auth/src/lib/auth.module';
import { BudgetExpectationService } from './budgetExpectation.service';
import { BudgetExpectationController } from './budgetExpectation.controller';
import { User } from 'libs/data-models/auth-model/src/lib/auth.entity';

@Module({
  controllers: [BudgetExpectationController],
  providers: [BudgetExpectationService],
  exports: [],
  imports: [TypeOrmModule.forFeature([User]),TypeOrmModule.forFeature([BudgetExpectation]),AuthModule],
})
export class BudgetExpectationModule {}


