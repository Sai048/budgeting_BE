import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../data-models/auth-model/src/lib/auth.entity';
import { AuthDto } from './authdto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async createUser(authDto: AuthDto): Promise<any> {
    const { name, email, password } = authDto;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      return {
        status: HttpStatus.CONFLICT,
        message: 'Email already exists',
      };
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(String(password), salt);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(user);
    return {
      status: HttpStatus.CREATED,
      message: 'User created successfully',
      data: savedUser,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
      };
    }

    const isPasswordValid = await bcrypt.compare(String(password), user.password);

    if (!isPasswordValid) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
      };
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      status: HttpStatus.OK,
      message: 'Login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        accesstoken: token,
      },
    };
  }
}
