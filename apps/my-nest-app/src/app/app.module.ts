import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../../../../libs/data/auth/src/lib/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'libs/data-models/auth-model/src/lib/auth.entity';
import { BudgetModule } from '../../../../libs/data/budget/src/lib/budget.module';
import { Transaction } from 'libs/data-models/budget-model/src/lib/budget.entity';
import { BudgetExpectation } from 'libs/data-models/budgettExpectation-model/src/lib/budgettExpectation.entity';
import { BudgetExpectationModule } from 'libs/data/budgetExpectation/src/lib/budgetExpectation.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
     ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env['DB-Host'],
      port: Number(process.env.DB_PORT),
      username: 'postgres',
      password: process.env['DB-Password'],
      database: process.env['Database-Name'],
      ssl: {
        rejectUnauthorized: false,
      },
      autoLoadEntities: true,
      synchronize: true,
    }),

    AuthModule,
    BudgetModule,
    BudgetExpectationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
