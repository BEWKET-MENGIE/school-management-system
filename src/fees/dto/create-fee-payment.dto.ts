import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreateFeePaymentDto {
  @IsUUID()
  @IsNotEmpty()
  feeStructureId!: string;

  @IsUUID()
  @IsNotEmpty()
  studentId!: string;

  @IsNumber()
  @Min(0.01)
  amountPaid!: number;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod!: PaymentMethod;

  @IsString()
  @IsNotEmpty()
  receiptNumber!: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
