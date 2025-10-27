import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../auth-model/src/lib/auth.entity';

@Entity('budgetexpectation')
export class BudgetExpectation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'enum', enum: ['Credit', 'Debit'] })
  amountType: 'Credit' | 'Debit';

  @Column()
  name: string;

  @Column({ type: 'decimal' })
  budget: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
