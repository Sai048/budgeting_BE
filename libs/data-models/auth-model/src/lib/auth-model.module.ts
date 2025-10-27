import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth.entity';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [TypeOrmModule.forFeature([User])],
})
export class AuthModelModule {}
