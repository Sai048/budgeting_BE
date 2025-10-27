import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../../../../data-models/budget-model/src/lib/budget.entity';
import { TransactionController } from './budget.controller';
import { TransactionService } from './budget.service';
import { User } from 'libs/data-models/auth-model/src/lib/auth.entity';
import { AuthModule } from '../../../../data/auth/src/lib/auth.module';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [],
  imports: [TypeOrmModule.forFeature([Transaction]), TypeOrmModule.forFeature([User]),AuthModule],
})
export class BudgetModule {}
