import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { TransformInterceptor } from '../utils/transform.interceptor';
import { AuthService } from './auth.service';
import { CreateRefreshTokenDto } from './dto/auth-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(TransformInterceptor)
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  login(@Body() createUserDto: CreateUserDto) {
    return this.authService.login(createUserDto);
  }

  @Post('refresh')
  refresh(@Body() createRefreshTokenDto: CreateRefreshTokenDto) {
    return this.authService.refresh(createRefreshTokenDto);
  }
}
