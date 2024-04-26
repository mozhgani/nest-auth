import { Injectable, ExecutionContext, UnauthorizedException, Redirect, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
          const active = await super.canActivate(context) as boolean;
          return active;
        } catch (error) {
          const response = context.switchToHttp().getResponse();
          response.redirect('/users/login');
        }
      }
      

      handleRequest(err, user, info, context) {
        if (err || !user) {
          const response = context.switchToHttp().getResponse();
          response.redirect('/users/login');
        }
        return user;
      }
      
}
