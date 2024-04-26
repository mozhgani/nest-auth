import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './user/guard/jwt-auth.guard';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {  
  }
}
