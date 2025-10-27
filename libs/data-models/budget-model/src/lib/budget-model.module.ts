import { Module } from '@nestjs/common';
import { Transaction } from './budget.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([Transaction])],
})
export class BudgetModelModule {}
