/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-empty */
/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async createUser(authCredentialsDto : AuthCredentialsDto): Promise<{message: string}> {
    const { username, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password,salt);
    
    const user = this.userRepository.create({username, password: hashedPassword})
    try {
      await this.userRepository.save(user)
      return { message: 'User Signup successful'}
    } catch (error) {
      if(error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async logIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string}> {
    const {username,password} = authCredentialsDto;
    const user = await this.userRepository.findOne({where: {username}});
    if(user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username};
      const accessToken: string = await this.jwtService.sign(payload)
      return {accessToken}
    } else {
      throw new UnauthorizedException("Login failed")
    }
  }
}
