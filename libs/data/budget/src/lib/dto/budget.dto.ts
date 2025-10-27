import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';

export enum AmountType {
  Credit = 'Credit',
  Debit = 'Debit',
}

export class BudgetDTO {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsEnum(AmountType, { message: 'AmountType must be Credit or Debit' })
  amountType: AmountType;

  @IsNotEmpty()
  @IsString()
  categoryType: string;

  @IsNotEmpty()
  @IsNumber()
  actualAmount: number;
}

export class UpdateBudgetDTO {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsEnum(AmountType, { message: 'AmountType must be Credit or Debit' })
  amountType?: AmountType;

  @IsOptional()
  @IsString()
  categoryType?: string;

  @IsOptional()
  @IsNumber()
  actualAmount?: number;
}
