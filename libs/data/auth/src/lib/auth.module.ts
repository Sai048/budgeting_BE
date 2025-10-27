import { Module } from '@nestjs/common';
import { AuthModelModule } from '../../../../data-models/auth-model/src/lib/auth-model.module';
import { UsersController } from './auth.controller';
import { UsersService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'libs/data-models/auth-model/src/lib/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtAuthGuard],
  exports: [JwtAuthGuard, JwtModule],
  imports: [
    AuthModelModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env['Secret-Key'], 
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class AuthModule {}
