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

export class ExpectationBudgetDTO {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsEnum(AmountType, { message: 'AmountType must be Credit or Debit' })
  amountType: AmountType;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  budget: number;
}

export class UpdateExpectationBudgetDTOBudgetDTO {
  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsEnum(AmountType, { message: 'AmountType must be Credit or Debit' })
  amountType?: AmountType;

  @IsOptional()
  @IsNumber()
  name: string;

  @IsOptional()
  @IsNumber()
  budget: number;
}
