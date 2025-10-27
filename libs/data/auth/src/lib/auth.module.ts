import { Module } from '@nestjs/common';
import { AuthModelModule } from '../../../../data-models/auth-model/src/lib/auth-model.module';
import { UsersController } from './auth.controller';
import { UsersService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'libs/data-models/auth-model/src/lib/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtAuthGuard, JwtStrategy],
  exports: [JwtModule, JwtAuthGuard, PassportModule],
  imports: [
    AuthModelModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env['SECRET_KEY'],
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class AuthModule {}
