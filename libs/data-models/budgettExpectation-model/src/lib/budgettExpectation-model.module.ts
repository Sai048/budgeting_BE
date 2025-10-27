import { Module } from '@nestjs/common';
import { BudgetExpectation } from 'libs/data-models/budgettExpectation-model/src/lib/budgettExpectation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [TypeOrmModule.forFeature([BudgetExpectation])]
})
export class BudgettExpectationModelModule {}
