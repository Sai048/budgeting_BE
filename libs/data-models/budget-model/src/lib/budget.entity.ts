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

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: ['Credit', 'Debit'] })
  amountType: 'Credit' | 'Debit';

  @Column({ type: 'varchar', length: 100 })
  categoryType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  actualAmount: number;

  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  balance: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
