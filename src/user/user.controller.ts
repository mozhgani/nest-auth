import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Redirect, HttpException, HttpStatus, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('signup')
  @Render('signup')
  async showCreateForm() {
    return {};
  }
  
  @Post('signup')
  @Redirect('/users', 303)
  async createUser(@Body() createUserDto: any) {
    await this.userService.createUser(createUserDto);
  }

  @Get()
  @Render('users')
  @UseGuards(JwtAuthGuard)
  async findAllUsers() {
    const users = await this.userService.findAllUsers(); 
    return {users : users}
  }

  @Get(':id/profile')
  @UseGuards(JwtAuthGuard)
  @Render('profile')
  async userProfile(@Param('id') id: string) {
    const user = await this.userService.profile(id);
    return { user };
  }

  @Get('login')
  @Render('login')
  async showLoginFrom() {
    return {};
  }

  @Post('login')
  async login(@Body() loginInfo: { name: string; password: string }, @Res() res: Response) {
      const user = await this.userService.validateUser(loginInfo.name, loginInfo.password);
      
      if (!user) {
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      
      const jwt = await this.authService.login(user);

      res.cookie('jwt', jwt.access_token, { httpOnly: true, secure: true, path: '/', maxAge: 3600000 });
      res.redirect('/users');
  }

  @Get('logout')
  async logout(@Res() res: Response) {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect('/users/login');
  }


}
