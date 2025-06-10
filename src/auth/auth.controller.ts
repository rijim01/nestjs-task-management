/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() userDetails: AuthCredentialsDto): Promise<{message: string}> {
      return this.authService.createUser(userDetails)
  }

  @Post('/signin')
  async signin(@Body() userDetails: AuthCredentialsDto): Promise<{ accessToken: string}> {
    return this.authService.logIn(userDetails)
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req);
  }
  
}
