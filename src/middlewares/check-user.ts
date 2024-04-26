// src/common/middlewares/check-user.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service'; // فرض بر این است که این سرویس برای دسترسی به کاربران است

@Injectable()
export class CheckUserMiddleware implements NestMiddleware {
  constructor(private usersService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.jwt;
    
    if (token) {
      jwt.verify(token, 'my secret', async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          const user = await this.usersService.findByName(decodedToken.name);
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  }
}
