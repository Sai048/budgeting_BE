import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthDto, LoginDto } from './authdto/auth.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() authDto: AuthDto) {
    return this.usersService.createUser(authDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto.email, loginDto.password);
  }
}
